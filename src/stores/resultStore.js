import { create } from "zustand";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const useResultStore = create((set) => ({
  results: [],
  studentResults: [],
  loading: false,
  error: null,

  fetchResults: async () => {
    set({ loading: true, error: null });
    try {
      const querySnapshot = await getDocs(collection(db, "results"));
      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      set({ results, loading: false });
    } catch (err) {
      set({ loading: false, error: err.message });
    }
  },

  fetchResultsByStudent: async (studentId) => {
    set({ loading: true, error: null });
    try {
      const q = query(
        collection(db, "results"),
        where("studentId", "==", studentId),
        where("published", "==", true),
      );
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      set({ studentResults: results, loading: false });
    } catch (err) {
      set({ loading: false, error: err.message });
    }
  },

  createResult: async (resultData) => {
    set({ loading: true, error: null });
    try {
      const docRef = await addDoc(collection(db, "results"), {
        ...resultData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      set({ loading: false });
      return docRef.id;
    } catch (err) {
      set({ loading: false, error: err.message });
    }
  },

  updateResult: async (id, resultData) => {
    set({ loading: true, error: null });
    try {
      await updateDoc(doc(db, "results", id), {
        ...resultData,
        updatedAt: serverTimestamp(),
      });
      set({ loading: false });
    } catch (err) {
      set({ loading: false, error: err.message });
    }
  },

  deleteResult: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteDoc(doc(db, "results", id));
      set({ loading: false });
    } catch (err) {
      set({ loading: false, error: err.message });
    }
  },
}));

export default useResultStore;
