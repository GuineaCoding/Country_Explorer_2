import { db } from '../services/firebase';
import { ref, set, push } from 'firebase/database';
import { getAuth } from 'firebase/auth';

export async function addLandmark(landmark, categoryId) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        console.error("User is not logged in.");
        return false; // Make sure the user is logged in
    }

    if (!categoryId) {
        console.error("No category ID provided.");
        return false; // Validate that category ID is provided
    }

    // Reference to the landmarks under the specific category ID for the logged-in user
    const userLandmarksRef = ref(db, `users/${user.uid}/categories/${categoryId}/landmarks`);

    try {
        const newLandmarkRef = push(userLandmarksRef);
        await set(newLandmarkRef, landmark);
        console.log("Landmark added successfully under user ID and category ID!");
        return true;
    } catch (e) {
        console.error("Error adding landmark under user ID and category ID: ", e);
        return false;
    }
}
