import { db } from '../firebase';
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    orderBy,
    serverTimestamp,
    limit
} from 'firebase/firestore';

export const saveReport = async (userId, structuredData, rawText) => {
    try {
        const docRef = await addDoc(collection(db, `users/${userId}/reports`), {
            ...structuredData,
            rawText,
            timestamp: serverTimestamp(),
            createdAt: new Date().toISOString()
        });
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
};

export const getUserReports = async (userId) => {
    try {
        const q = query(
            collection(db, `users/${userId}/reports`),
            orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (e) {
        console.error("Error getting documents: ", e);
        return [];
    }
};

// --- Chat Persistence ---

export const saveChatMessage = async (userId, role, content) => {
    try {
        await addDoc(collection(db, `users/${userId}/chat`), {
            role,
            content,
            timestamp: serverTimestamp()
        });
    } catch (e) {
        console.error("Error saving chat:", e);
    }
};

export const getChatHistory = async (userId) => {
    try {
        const q = query(
            collection(db, `users/${userId}/chat`),
            orderBy("timestamp", "asc"),
            limit(50) // Keep last 50 messages for context
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            role: doc.data().role,
            content: doc.data().content
        }));
    } catch (e) {
        console.error("Error fetching chat:", e);
        return [];
    }
};
