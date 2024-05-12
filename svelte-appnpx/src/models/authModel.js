// Import required Firebase functions
import { auth } from '../services/firebase.js';
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { get, getDatabase, ref, set, push, child, update } from 'firebase/database';

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
      loginCount: 0 // Initialize login count to 0
    });

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
   
    // Generate random nonsense words and numbers for first and last name
    const firstName = getRandomElement(nonsenseWords) + getRandomNumber();
    const lastName = getRandomElement(nonsenseWords) + getRandomNumber();
    const userType = 'user';
    await recordLoginEvent(user);
    // Check if the user already has details in the database
    const db = getDatabase();
    const userRef = ref(db, 'users/' + user.uid);
    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
      
      await set(userRef, {
        firstName: firstName,
        lastName: lastName,
        email: user.email,
        userType: userType
      });
      
    } else {
      // Update first and last name if not already set
      const userData = snapshot.val();
      const updates = {};
      if (!userData.firstName) updates.firstName = firstName;
      if (!userData.lastName) updates.lastName = lastName;
      if (!userData.userType) updates.userType = userType;

      if (Object.keys(updates).length > 0) {
        await update(userRef, updates);
      }
    }

    return user;
  } catch (error) {
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
  const db = getDatabase();
  const userRef = ref(db, `users/${user.uid}`);
  const analyticsRef = ref(db, `users/${user.uid}/analytics/logins`);
  const ip = await fetchIpAddress();  

  // Increment login count
  const loginCountRef = child(userRef, 'loginCount');
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
