// Import required Firebase functions
import { auth } from '../services/firebase.js';
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile // Add this import
} from 'firebase/auth';

const googleProvider = new GoogleAuthProvider();

export async function createUser(email, password, firstName, lastName, userType) {
  try {
    // Create a new user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update the user's profile with their display name
    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`
    });

    return user;
  } catch (error) {
    console.error("Error creating user: ", error);
    throw error;
  }
}

export const logoutUser = async () => {
  try {
    // Sign out the user
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out", error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    // Sign in with email and password
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    // Sign in with Google
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    throw error;
  }
};
