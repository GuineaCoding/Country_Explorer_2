import { writable } from 'svelte/store';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const user = writable(null);
const auth = getAuth();

onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
        user.set(firebaseUser);
    } else {
        user.set(null);
    }
});


onAuthStateChanged(auth, (firebaseUser) => {
    user.set(firebaseUser);
});
