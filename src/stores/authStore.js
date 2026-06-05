import { create } from "zustand";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";

const useAuthStore = create((set) => ({
  user: null,
  role: null,
  studentId: null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged listener in App.js handles the rest
    } catch (err) {
      set({ loading: false, error: err.message });
    }
  },

  handleAuthenticatedUser: async (firebaseUser) => {
    set({ loading: true });
    try {
      const uid = firebaseUser.uid;
      const email = firebaseUser.email;

      let userDoc = await getDoc(doc(db, "users", uid));
      let userData;

      if (!userDoc.exists()) {
        const newUserData = {
          email,
          role: "student",
          studentId: null,
          createdAt: serverTimestamp(),
        };
        await setDoc(doc(db, "users", uid), newUserData);
        userData = newUserData;
      } else {
        userData = userDoc.data();
      }

      let studentId = userData.studentId || null;

      if (!studentId) {
        const q = query(
          collection(db, "students"),
          where("email", "==", email),
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const studentDoc = snapshot.docs[0];
          await updateDoc(doc(db, "users", uid), {
            studentId: studentDoc.id,
          });
          studentId = studentDoc.id;
        }
      }

      set({
        user: firebaseUser,
        role: userData.role,
        studentId,
        loading: false,
        error: null,
      });
    } catch (err) {
      set({ loading: false, error: err.message });
    }
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null, role: null, studentId: null, error: null });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
