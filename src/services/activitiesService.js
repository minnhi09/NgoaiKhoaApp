// src/services/activitiesService.js
import { db } from "../lib/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  orderBy,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const COL = "activities";

export async function addActivity(uid, data) {
  // data gồm: title, date (YYYY-MM-DD), points (number), category, notes
  const ref = collection(db, COL);
  await addDoc(ref, {
    uid,
    title: data.title || "",
    date: data.date || null,
    points: Number(data.points || 0),
    category: data.category || "other",
    notes: data.notes || "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    imageURL: data.imageURL || null, // để dành cho Storage nếu có
  });
}

export function subscribeMyActivities(uid, callback) {
  const ref = collection(db, COL);
  const q = query(ref, where("uid", "==", uid), orderBy("createdAt", "desc"));
  const unsub = onSnapshot(q, (snap) => {
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(list);
  });
  return unsub;
}

export async function updateActivity(id, patch) {
  const dref = doc(db, COL, id);
  await updateDoc(dref, { ...patch, updatedAt: serverTimestamp() });
}

export async function removeActivity(id) {
  const dref = doc(db, COL, id);
  await deleteDoc(dref);
}
