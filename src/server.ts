// import { ConversationService } from './services/conversationService';
// import type { MessageRequest, MessageResponse, ConversationMessage } from './types';

// import express, { Request, Response } from 'express';
// const app = express();
// app.use(express.json());

// const conversationService = new ConversationService();

// app.get('/health', (req: Request, res: Response) => {
//   res.json({ status: 'ok', timestamp: new Date().toISOString() });
// });

// app.post('/api/message', async (req: Request, res: Response) => {
//   try {
//     const { user_id, message } = req.body as MessageRequest;

//     if (!user_id || !message) {
//       return res.status(400).json({
//         error: 'Missing required fields: user_id and message are required'
//       });
//     }

//     // Add user message to conversation history
//     const userMessage: ConversationMessage = {
//       role: 'user',
//       content: message,
//       timestamp: Date.now()
//     };
//     await conversationService.addMessage(user_id, userMessage);
//       // Get full conversation context for MCP
//       const context = await conversationService.getContextForMCP(user_id);

//          // Process message with MCP
   

  
  
//       res.json(response);
//     } catch (error) {
//       console.error('Error processing message:', error);
//       res.status(500).json({
//         error: 'Internal server error',
//         message: error instanceof Error ? error.message : 'Unknown error'
//       });
//     }
//   });
import express, { Request, Response } from 'express';
const app = express();
app.use(express.json());

app.post('/api/input', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Aquí puedes agregar lógica para procesar el mensaje si es necesario
    const processedMessage = message; // En este caso, simplemente devolvemos el mensaje recibido

    res.json({ message: processedMessage });
  } catch (error) {
    console.error('Error processing input:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});
  
  // Error handling middleware
  app.use((err: Error, req: Request, res: Response, next: Function) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
      error: 'Internal server error',
      message: err.message
    });
  });
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
  
  export { app }; 