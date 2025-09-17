import { db } from "../lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

const COLLECTION = "userProfiles";

export async function getUserProfile(uid) {
  try {
    const docRef = doc(db, COLLECTION, uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      // Tạo profile mặc định nếu chưa có
      const defaultProfile = {
        displayName: "",
        class: "",
        faculty: "",
        scoreTarget: 100,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(docRef, defaultProfile);
      return { id: uid, ...defaultProfile };
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
}

export async function updateUserProfile(uid, data) {
  try {
    const docRef = doc(db, COLLECTION, uid);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

export async function updateScoreTarget(uid, target) {
  try {
    const docRef = doc(db, COLLECTION, uid);
    await updateDoc(docRef, {
      scoreTarget: Number(target),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating score target:", error);
    throw error;
  }
}
