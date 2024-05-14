// src/stores/authStore.js
import { writable } from 'svelte/store';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ref, get, child } from 'firebase/database';
import { db } from '../services/firebase'; 

export const user = writable(undefined);

const auth = getAuth();
onAuthStateChanged(auth, async firebaseUser => {
    if (firebaseUser) {
        const userRef = ref(db, `users/${firebaseUser.uid}`);
        const snapshot = await get(child(userRef, 'userType'));
        const userType = snapshot.exists() ? snapshot.val() : 'user'; 
        user.set({ ...firebaseUser, userType });
    } else {
        user.set(null);
    }
});
