import { db } from '../services/firebase';
import { ref, set, push } from 'firebase/database';
import { getAuth } from 'firebase/auth';

export async function addLandmark(landmark) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
       
        const userLandmarksRef = ref(db, 'users/' + user.uid + '/landmarks');

        try {
          
            const newLandmarkRef = push(userLandmarksRef);
            await set(newLandmarkRef, landmark);
            console.log("Landmark added successfully under user ID!");
            return true;
        } catch (e) {
            console.error("Error adding landmark under user ID: ", e);
            return false;
        }
    } else {
        console.error("User is not logged in.");
        return false;
    }
}
