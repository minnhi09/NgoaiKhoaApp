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
  const ref = collection(db, COL);
  const monthKey = data.date
    ? new Date(data.date).toISOString().slice(0, 7)
    : null;

  await addDoc(ref, {
    uid,
    title: data.title || "",
    date: data.date || null,
    category: data.category || "other",
    location: data.location || "",
    score: Number(data.score || 0),
    note: data.note || "",
    attachments: data.attachments || [],
    monthKey,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
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
