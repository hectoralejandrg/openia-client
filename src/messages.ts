import OpenAI from "openai";
import { printMessage } from "./cli";
import * as fs from 'fs';
import {
  initialMessageSystemPrompt,
  performNextStepSystemPrompt,
  firstTimeUserSystemPrompt,
} from "./prompts";
import { DEBUG } from "./env";
import { ConversationService } from './services/conversationService';
import { ConversationMessage } from './types/types';


export type MessageType =
  | OpenAI.Chat.Completions.ChatCompletionMessageParam
  | OpenAI.Chat.Completions.ChatCompletionMessage;

class MessageHandler {
  private messages: MessageType[] = [];
  private debug: boolean;
  private conversationService: ConversationService;
  constructor() {
    this.debug = DEBUG;
    this.conversationService = new ConversationService(); 
  }

  public loadMessages(
    addPerformNextStep: boolean = true
  ): MessageType[] | null {
    try {
      const rawMessages = fs.readFileSync("messages.json", "utf8");
      const messages = JSON.parse(rawMessages);
      

      if (addPerformNextStep) {
        messages.push(performNextStepSystemPrompt);
      }

      return messages;
    } catch (e) {
      console.log("Error loading messages", e);
      return null;
    }
  }

  async loadMessagesFromFirestore(userId: string) {
    try{
      const firestoreMessages = await this.conversationService.getContextHistory(userId); // Replace 'user_id' with the actual user ID
      
      // Check if this is the user's first message
      const isFirstMessage = await this.isFirstUserMessage(userId);
      
      // Choose the appropriate system prompt based on whether it's the first message
      const systemPrompt = isFirstMessage 
        ? firstTimeUserSystemPrompt(userId)
        : initialMessageSystemPrompt(userId);
      
      // Combina con el mensaje inicial del sistema
      this.messages = [
        systemPrompt,
        ...this.sanitizeMessages(firestoreMessages),
      ];
      console.log('messages', this.messages);

    }catch (error) {
      console.error('Failed to load messages from Firestore:', error);
    }
  }

  public addMessage(message: MessageType, userId: string) {
    this.messages.push(message);
    //console.log("Add messages in memory:", message);
    printMessage(message, this.debug);

    try {
      this.conversationService.addMessagesSubcollection(userId, message as ConversationMessage); // Replace 'user_id' with the actual user ID
    } catch (error) {
      console.error('Failed to add message to database:', error);
    }
  }

  public addPerformNextStep() {
    //console.log("Add messages in memory:", performNextStepSystemPrompt);
    this.messages.push(performNextStepSystemPrompt);
  }

  public addMessages(messages: MessageType[], userId: string) {
    //console.log('addMessages', userId);
    messages.forEach((message) => this.addMessage(message, userId));
    //console.log('messages', userId);

  }


  public async addMessagesBatch(messages: MessageType[], userId: string) {
    this.messages.push(...messages);
    
    try {
      await this.conversationService.addMessagesBatchSubcollection(userId, messages as ConversationMessage[]);
    } catch (error) {
      console.error('Failed to add batch messages to database:', error);
    }
  }

  public storeMessages() {
    fs.writeFileSync("messages.json", JSON.stringify(this.messages, null, 2));
  }

  public getMessages() {
    // Apply sanitization before returning messages to ensure no problematic tool messages
    const sanitizedMessages = this.sanitizeMessages([...this.messages]);
    return sanitizedMessages;
  }

  public sanitizeMessages(messages: MessageType[]) {
     // Verificar si hay un mensaje con role 'tool' en la posición 1 y eliminarlo
     if (messages.length > 1 && messages[1] && messages[1].role === 'tool') {
       messages.splice(1, 1);
     }
     
     return messages;
  }

  /**
   * Check if this is the user's first message
   * @param userId - The user ID to check
   * @returns Promise<boolean> - true if this is the first message, false otherwise
   */
  public async isFirstUserMessage(userId: string): Promise<boolean> {
    try {
      const firestoreMessages = await this.conversationService.getContextHistory(userId);
      //const sanitizedMessages = this.sanitizeMessages(firestoreMessages);
      
      // Check if there are any user messages in the history
      const userMessages = firestoreMessages.filter(msg => msg.role === 'user');
      
      return userMessages.length === 0;
    } catch (error) {
      console.error('Failed to check if first user message:', error);
      // If there's an error, assume it's not the first message to be safe
      return false;
    }
  }

  /**
   * Alternative method to check first message using local messages array
   * @returns boolean - true if this is the first user message in current session
   */
  public isFirstUserMessageInSession(): boolean {
    const userMessages = this.messages.filter(msg => msg.role === 'user');
    return userMessages.length === 0;
  }
}

export { MessageHandler };
