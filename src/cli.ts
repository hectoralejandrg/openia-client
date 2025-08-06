import { OpenAI } from "openai";
import process from "node:process";
import readline from "node:readline";

type MessageRole = "system" | "user" | "assistant" | "tool" | "function";

const colorByRole: Record<MessageRole, string> = {
  system: "green",
  user: "blue",
  assistant: "red",
  tool: "yellow",
  function: "purple",
};

export const printMessage = (
  message:
    | OpenAI.Chat.Completions.ChatCompletionMessageParam
    | OpenAI.Chat.Completions.ChatCompletionMessage,
  debug: boolean = false
) => {
  if ((message.role === "system" || message.role === "tool") && !debug) {
    return;
  }

  const role = message.role as MessageRole;
  console.log(
    `%c${role}`,
    `color: ${colorByRole[role]}; font-weight: bold;`
  );

  if (message.role === "assistant" && message.tool_calls?.length) {
    console.log(
      `The tool %c${message.tool_calls?.[0]?.function.name}%c was called with the arguments: %c${message.tool_calls?.[0]?.function.arguments}`,
      `font-style: italic;`,
      "", // Reset styling
      `font-style: italic;`
    );
  } else {
    // If it fails, print the content as a string
    // console.log(message.content);
  }

  // Add a line break
  console.log("");
};

export const askForInput = async (): Promise<string> => {
  console.log("%cuser", `color: blue; font-weight: bold;`);
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question("> ", (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};
