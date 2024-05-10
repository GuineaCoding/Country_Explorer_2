// models/landmarkModel.js

import { db } from '../services/firebase';
import { ref, set, push, get, remove, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';

export async function addLandmark(landmark, categoryId) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        console.error("User is not logged in.");
        return false;
    }

    if (!categoryId) {
        console.error("No category ID provided.");
        return false;
    }

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

export async function getLandmarks(categoryId) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        console.error("User is not logged in.");
        return [];
    }

    const landmarksRef = ref(db, `users/${user.uid}/categories/${categoryId}/landmarks`);
    try {
        const snapshot = await get(landmarksRef);
        const data = snapshot.val();

        if (!data) {
            return [];
        }

        // Convert data object to an array and include the Firebase keys as `id` properties
        return Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value
        }));
    } catch (e) {
        console.error("Error fetching landmarks: ", e);
        return [];
    }
}

export async function updateLandmark(landmarkId, landmark, categoryId) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        console.error("User is not logged in.");
        return false;
    }

    const landmarkRef = ref(db, `users/${user.uid}/categories/${categoryId}/landmarks/${landmarkId}`);
    try {
        await update(landmarkRef, landmark);
        console.log("Landmark updated successfully!");
        return true;
    } catch (e) {
        console.error("Error updating landmark: ", e);
        return false;
    }
}

export async function deleteLandmark(landmarkId, categoryId) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        console.error("User is not logged in.");
        return false;
    }

    const landmarkRef = ref(db, `users/${user.uid}/categories/${categoryId}/landmarks/${landmarkId}`);
    try {
        await remove(landmarkRef);
        console.log("Landmark deleted successfully!");
        return true;
    } catch (e) {
        console.error("Error deleting landmark: ", e);
        return false;
    }
}
export async function fetchLandmark(userId, categoryId, landmarkId) {
    const landmarkRef = ref(db, `users/${userId}/categories/${categoryId}/landmarks/${landmarkId}`);
    const snapshot = await get(landmarkRef);
    if (snapshot.exists()) {
        return { id: snapshot.key, ...snapshot.val() };
    } else {
        throw new Error("Landmark not found");
    }
}