import { auth } from '../services/firebase.js';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword,signInWithEmailAndPassword, signOut} from 'firebase/auth';
const googleProvider = new GoogleAuthProvider();

export async function createUser(email, password, firstName, lastName) {
  try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, {
          displayName: `${firstName} ${lastName}`
      });
      return user;
  } catch (error) {
      console.error("Error creating user: ", error);
      throw error;
  }
};

export const logoutUser = async () => {
  try {
      await signOut(auth);
  } catch (error) {
      console.error("Error logging out", error);
      throw error;  
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      throw error;
    }
  };
