import { writable } from 'svelte/store';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const user = writable(undefined);  

const auth = getAuth();
onAuthStateChanged(auth, firebaseUser => {
    user.set(firebaseUser || null);  
});
