import { auth, db } from '../services/firebase.js';
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { get, ref, set, update, push, getDatabase } from 'firebase/database';

const googleProvider = new GoogleAuthProvider();

export async function createUser(email, password, firstName, lastName, userType) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`
    });

    const db = getDatabase();
    await set(ref(db, 'users/' + user.uid), {
      firstName: firstName,
      lastName: lastName,
      email: email,
      userType: userType,
      loginCount: 1 
    });

    // Record the initial login event for new users
    await recordLoginEvent(user);

    return user;
  } catch (error) {
    console.error("Error creating user: ", error);
    throw error;
  }
}

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
    const user = userCredential.user;
    await recordLoginEvent(user);
    return user;
  } catch (error) {
    throw error;
  }
};

const nonsenseWords = ['Dinosaur', 'Noodle', 'Widget', 'Gizmo', 'Gadget', 'Whatchamacallit', 'Thingamajig', 'Doohickey', 'Doodad', 'Flibber'];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomNumber() {
  return Math.floor(Math.random() * 10000);
}

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    if (!user.email) {
      console.error("No email available from Google sign-in");
      throw new Error("Email is required but was not provided by Google sign-in");
    }

    const userRef = ref(getDatabase(), 'users/' + user.uid);
    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
      await set(userRef, {
        firstName: getRandomElement(nonsenseWords) + getRandomNumber(),
        lastName: getRandomElement(nonsenseWords) + getRandomNumber(),
        email: user.email,
        userType: 'user',
        loginCount: 0 
      });
    } else {
      await update(userRef, {
        loginCount: (snapshot.val().loginCount || 0) + 1
      });
    }

    // Record each Google login event
    await recordLoginEvent(user);

    return user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    throw error;
  }
};

export async function resetPassword(email) {
  try {
    console.log("Email being sent for reset:", email); 
    await sendPasswordResetEmail(auth, email);
    return 'Password reset email sent';
  } catch (error) {
    throw error;
  }
}

async function recordLoginEvent(user) {
  const userRef = ref(getDatabase(), `users/${user.uid}`);
  const analyticsRef = ref(getDatabase(), `users/${user.uid}/analytics/logins`);
  const ip = await fetchIpAddress();  

  // Increment login count
  const loginCountRef = ref(db, `users/${user.uid}/loginCount`);
  const snapshot = await get(loginCountRef);
  const currentCount = (snapshot.val() || 0) + 1;
  await update(userRef, { loginCount: currentCount });

  // Record each login event
  const newLoginRef = push(analyticsRef);
  await set(newLoginRef, {
    ip: ip,
    date: new Date().toISOString(),
    device: navigator.userAgent
  });
}

async function fetchIpAddress() {
  const response = await fetch('https://api.ipify.org?format=json');
  const data = await response.json();
  return data.ip;
}
