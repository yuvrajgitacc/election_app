import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { UserProgress, Message } from '@/types';

export const saveProgress = async (userId: string, country: string, progress: UserProgress) => {
  const docRef = doc(db, `users/${userId}/progress/${country}`);
  await setDoc(docRef, progress, { merge: true });
};

export const getProgress = async (userId: string, country: string): Promise<UserProgress | null> => {
  const docRef = doc(db, `users/${userId}/progress/${country}`);
  const snap = await getDoc(docRef);
  return snap.exists() ? (snap.data() as UserProgress) : null;
};

export const saveChatHistory = async (userId: string, country: string, messages: Message[]) => {
  const docRef = doc(db, `users/${userId}/chats/${country}`);
  await setDoc(docRef, { messages });
};

export const getChatHistory = async (userId: string, country: string): Promise<Message[] | null> => {
  const docRef = doc(db, `users/${userId}/chats/${country}`);
  const snap = await getDoc(docRef);
  return snap.exists() ? (snap.data().messages as Message[]) : null;
};

export const cacheGeminiResponse = async (key: string, response: string) => {
  const docRef = doc(db, `gemini_cache/${key}`);
  await setDoc(docRef, { response, timestamp: new Date() });
};

export const getCachedResponse = async (key: string): Promise<string | null> => {
  const docRef = doc(db, `gemini_cache/${key}`);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    const data = snap.data();
    const now = new Date();
    const timestamp = data.timestamp.toDate();
    const hoursDiff = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60);
    if (hoursDiff < 24) {
      return data.response;
    }
  }
  return null;
};
