import { create } from "zustand";
import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const useCourseStore = create((set) => ({
  courses: [],
  loading: false,
  error: null,

  fetchCourses: async () => {
    set({ loading: true, error: null });
    try {
      const querySnapshot = await getDocs(collection(db, "courses"));
      const courses = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      set({ courses, loading: false });
    } catch (err) {
      set({ loading: false, error: err.message });
    }
  },

  createCourse: async (courseData) => {
    set({ loading: true, error: null });
    try {
      const docRef = await addDoc(collection(db, "courses"), {
        ...courseData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      set({ loading: false });
      return docRef.id;
    } catch (err) {
      set({ loading: false, error: err.message });
    }
  },

  updateCourse: async (id, courseData) => {
    set({ loading: true, error: null });
    try {
      await updateDoc(doc(db, "courses", id), {
        ...courseData,
        updatedAt: serverTimestamp(),
      });
      set({ loading: false });
    } catch (err) {
      set({ loading: false, error: err.message });
    }
  },

  deleteCourse: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteDoc(doc(db, "courses", id));
      set({ loading: false });
    } catch (err) {
      set({ loading: false, error: err.message });
    }
  },
}));

export default useCourseStore;
