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
      return null;
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

export async function updateDisplayName(uid, displayName) {
  try {
    const docRef = doc(db, COLLECTION, uid);
    await updateDoc(docRef, {
      displayName: displayName.trim(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating display name:", error);
    throw error;
  }
}

export async function ensureUserProfile(uid, defaultData = {}) {
  try {
    const docRef = doc(db, COLLECTION, uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      const profileData = {
        displayName: defaultData.displayName || "",
        email: defaultData.email || "",
        class: defaultData.class || "",
        faculty: defaultData.faculty || "",
        scoreTarget: defaultData.scoreTarget || 100,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(docRef, profileData);
      return { id: uid, ...profileData };
    }

    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error("Error ensuring user profile:", error);
    throw error;
  }
}
