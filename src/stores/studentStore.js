import { create } from "zustand";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const useStudentStore = create((set) => ({
  students: [],
  selectedStudent: null,
  loading: false,
  error: null,

  fetchStudents: async () => {
    set({ loading: true, error: null });
    try {
      const querySnapshot = await getDocs(collection(db, "students"));
      const students = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      set({ students: students, loading: false });
    } catch (err) {
      set({ loading: false, error: err.message });
    }
  },

  fetchStudentById: async (id) => {
    set({ loading: true, error: null });
    try {
      const docSnap = await getDoc(doc(db, "students", id));
      if (!docSnap.exists()) {
        return set({
          selectedStudent: "That Student Not Found",
          loading: false,
        });
      }
      set({
        selectedStudent: { id: docSnap.id, ...docSnap.data() },
        loading: false,
      });
    } catch (err) {
      set({ loading: false, error: err.message });
    }
  },

  createStudent: async (studentData) => {
    set({ loading: true, error: null });
    try {
      const docRef = await addDoc(collection(db, "students"), {
        ...studentData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      set({ loading: false });
      return docRef.id;
    } catch (err) {
      set({ loading: false, error: err.message });
    }
  },

  updateStudent: async (id, studentData) => {
    set({ loading: true, error: null });
    try {
      await updateDoc(doc(db, "students", id), {
        ...studentData,
        updatedAt: serverTimestamp(),
      });
      set({ loading: false });
    } catch (err) {
      set({ loading: false, error: err.message });
    }
  },

  deleteStudent: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteDoc(doc(db, "students", id));
      set({ loading: false });
    } catch (err) {
      set({ loading: false, error: err.message });
    }
  },
}));

export default useStudentStore;
