import "./middleware/firebase"
import { auth } from "./middleware/firebase";
import OpenAI from "openai";
import { mcpClient, initClient, disconnectClient } from "./client";
import {
  applyToolCallsIfPresent,
  isDone,
  mapToolListToOpenAiTools,
} from "./openai-utils";
import { OPENAI_API_KEY, OPENAI_MODEL, PORT } from "./env";
import { MessageHandler, type MessageType } from "./messages";
import { performNextStepSystemPrompt } from "./prompts";
import express, { Request, Response } from "express";
import { authMiddleware } from "./middleware/authMiddleware";
const app = express();

app.use(express.json());

const agentLoop = async (
  openai: OpenAI,
  openAiTools: OpenAI.Chat.Completions.ChatCompletionTool[],
  messagesHandler: MessageHandler,
  userId: string
) => {
  // Maximum number of autonomous steps
  const maxIterations = 10;
  let lastMessage: OpenAI.Chat.Completions.ChatCompletionMessage;

  for (let i = 0; i < maxIterations; i++) {
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      temperature: 0.7,
      messages: messagesHandler.getMessages(),
      tools: openAiTools,
      user: userId,
      top_p: 0.95,
      frequency_penalty: 0.4,
      presence_penalty: 0.3
    });

    lastMessage = response.choices[0].message;

    const toolCallResponse = await applyToolCallsIfPresent(response);

    if (toolCallResponse.length) {
      await messagesHandler.addMessagesBatch([lastMessage, ...toolCallResponse], userId);
    } else {
      messagesHandler.addMessage(lastMessage, userId);
    }


    if (isDone(response)) {
      break;
    }

    messagesHandler.addPerformNextStep();
  }
  return lastMessage!
};

const main = async () => {
  const messagesHandler = new MessageHandler();

  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });

  app.get("/", (req, res, next) => {
    res.json({"status": "API MCP Agent online!"});
  });

  app.post("/api/input", authMiddleware, async (req: Request, res: Response) => {
    try {
      const input = req.body.message;
      const token = await auth.verifyIdToken(String(req.token));
      const userId = token.uid;
      const role = req.body?.role ?? "user";
      //console.log("rolemax", role);
      //console.log("incoming message", req.body);
      

      
      
      await initClient(String(req.token || ''));


      const mcpToolsList = await mcpClient.listTools();
      const openAiTools = mapToolListToOpenAiTools(mcpToolsList);
      if (!input) {
        return res.status(400).json({ error: "Message is required" });
      }
      await messagesHandler.loadMessagesFromFirestore(userId);
       
      messagesHandler.addMessage(
        {
          role,
          content: input,
        } as MessageType,
        userId
      );

      const lastMessage = await agentLoop(openai, openAiTools, messagesHandler, userId);

      // Send a response back to the client
      res.json({ message: "Message processed successfully.", iaResponse: lastMessage });
    } catch (error) {
      console.error(error);
      // messagesHandler.storeMessages();
      res.status(500).json({ error: "Internal server error" });
    } finally {
      await disconnectClient();
    }
  });
  
  // Primero, añadiremos el system prompt para la versión simple
  const simpleSystemPrompt: OpenAI.Chat.Completions.ChatCompletionSystemMessageParam = {
    role: "system",
    content: "You are a helpful and friendly assistant. Respond in the same language as the user's message."
  };

  app.post("/api/simple", async (req: Request, res: Response) => {
    try {
      const input = req.body.message;
      
      if (!input) {
        return res.status(400).json({ error: "Message is required" });
      }

      const response = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        temperature: 0.2,
        messages: [
          simpleSystemPrompt,
          {
            role: "user",
            content: input
          } as OpenAI.Chat.Completions.ChatCompletionUserMessageParam
        ]
      });

      const lastMessage = response.choices[0].message;

      res.json({ 
        message: "Message processed successfully.", 
        iaResponse: lastMessage 
      });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

main().catch((error) => {
  console.error("Error in main:", error);
  process.exit(1);
});
