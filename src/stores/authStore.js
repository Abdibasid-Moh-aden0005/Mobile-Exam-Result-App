import { create } from 'zustand';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebaseConfig';

const useAuthStore = create((set) => ({
  user: null,
  role: null,
  studentId: null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const userDoc = await getDoc(doc(db, 'users', uid));
      if (!userDoc.exists()) {
        throw new Error('User not found in database');
      }

      const userData = userDoc.data();
      set({
        user: userCredential.user,
        role: userData.role,
        studentId: userData.studentId || null,
        loading: false,
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
