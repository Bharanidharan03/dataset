import { db } from '../firebase';
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    orderBy,
    serverTimestamp
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
