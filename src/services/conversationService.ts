import { ConversationHistory, ConversationMessage } from "../types/types";
import { db } from "../middleware/firebase";
import { Timestamp } from "firebase-admin/firestore";
import * as admin from "firebase-admin";

const USERS_COLLECTION = "users";
const LIMIT_CONVERSATIONS = 30; // Maximum number of conversations to retrieve

export class ConversationService {

  private getConversationsCollection(userId: string) {
    return db.collection(USERS_COLLECTION).doc(userId).collection("chats");
  }

  async getChatId(userId: string) {
    const refChats = this.getConversationsCollection(userId);

    const snapshot = await refChats.limit(1).get();

    if (!snapshot.empty) {
      const chatDoc = snapshot.docs[0];
      return chatDoc.id; // Return the ID of the first chat document
    }

    return null
  }

  async saveFirstMessage(userId: string, message: {}) {
    const refChats= await this.getConversationsCollection(userId).add({
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      })

      await refChats.collection("messages").add({
        ...message,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      })
  }

  async getContextHistory(userId: string, limit: number = LIMIT_CONVERSATIONS) {
    const chatId = await this.getChatId(userId);
    if (!chatId) {
      return [];
    }

    const refMessage = await this.getConversationsCollection(userId).doc(chatId).collection("messages");
    
    const snapshot = await refMessage.orderBy("timestamp", "desc").limit(limit).get();

    if (snapshot.empty) {
      return [];
    }

    const messages: ConversationMessage[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as ConversationMessage;
      messages.push({
        ...data,
        timestamp: data.timestamp ? (data.timestamp as Timestamp).toDate() : new Date(),
      });
    })

    return messages.reverse(); // Return messages in chronological order
  }

  async addMessagesSubcollection(userId: string, message: {}) {
    const chatId = await this.getChatId(userId);
    if (!chatId) {
      await this.saveFirstMessage(userId, message);
      return;
    }

    const chatDoc = await this.getConversationsCollection(userId).doc(chatId);
    const messagesRef = chatDoc.collection("messages");

    await chatDoc.update({
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await messagesRef.add({
      ...message,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  async addMessagesBatchSubcollection(userId: string, messages: {}[]) {
  const chatId = await this.getChatId(userId);
  if (!chatId) {
    // Si no hay chat, guardar el primero normalmente
    await this.saveFirstMessage(userId, messages[0]);
    // Guardar los demás si existen
    if (messages.length > 1) {
      const chatId2 = await this.getChatId(userId);
      if (!chatId2) return; // Protección extra
      const chatDoc2 = await this.getConversationsCollection(userId).doc(chatId2);
      const messagesRef2 = chatDoc2.collection("messages");
      const batch2 = db.batch();
      const baseTime = admin.firestore.Timestamp.now();
      for (let i = 1; i < messages.length; i++) {
        const docRef = messagesRef2.doc();
        batch2.set(docRef, {
          ...messages[i],
          timestamp: new admin.firestore.Timestamp(baseTime.seconds + i, baseTime.nanoseconds),
        });
      }
      await batch2.commit();
    }
    return;
  }

  // Si ya existe un chat, agregar todos los mensajes en batch
  const chatDoc = await this.getConversationsCollection(userId).doc(chatId);
  const messagesRef = chatDoc.collection("messages");
  const batch = db.batch();
  const baseTime = admin.firestore.Timestamp.now();

  await chatDoc.update({
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  for (let i = 0; i < messages.length; i++) {
    const docRef = messagesRef.doc();
    batch.set(docRef, {
      ...messages[i],
      timestamp: new admin.firestore.Timestamp(baseTime.seconds + i, baseTime.nanoseconds),
    });
  }
  await batch.commit();
}
}