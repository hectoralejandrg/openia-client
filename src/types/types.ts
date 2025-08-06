// src/types/types.ts

// Define a type for a single message in a conversation
export type ConversationMessage = any;
// Define a type for the conversation history
export interface ConversationHistory {
    id?: string,
    messages: ConversationMessage[]; // An array of messages
    lastUpdated: number; // The last time the conversation was updated
}