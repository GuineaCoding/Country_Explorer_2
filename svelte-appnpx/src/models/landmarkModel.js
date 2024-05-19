import { db } from '../services/firebase';
import { ref, set, push, get, remove, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Function to add a new landmark
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

// Function to get landmarks for a category
export async function getLandmarks(categoryId) {
    const auth = getAuth();
    const user = auth.currentUser;
    console.log(user)
    if (!user) {
        console.error("User is not logged in.");
        return [];
    }

    const landmarksRef = ref(db, `users/${user.uid}/categories/${categoryId}/landmarks`);
    try {
        const snapshot = await get(landmarksRef);
        const data = snapshot.val();

        if (!data) {
            console.error("No landmarks found for category:", categoryId);
            return [];
        }

        return Object.entries(data).map(([key, value]) => ({
            id: key,
            isPrivate: value.isPrivate || false, // Default to false if isPrivate is not explicitly set
            ...value
        }));
    } catch (e) {
        console.error("Error fetching landmarks from category:", categoryId, "Error:", e);
        return [];
    }
}

// Function to update a landmark's details
export async function updateLandmark(userId, categoryId, landmarkId, details) {
    console.log("Updating with details:", details);
    const landmarkRef = ref(db, `users/${userId}/categories/${categoryId}/landmarks/${landmarkId}`);
    try {
        await update(landmarkRef, details);
        console.log("Landmark updated successfully!");
        return true;
    } catch (error) {
        console.error("Error updating landmark:", error);
        return false;
    }
}

// Function to delete a landmark
export async function deleteLandmark(userId, categoryId, landmarkId) {
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
        console.error("Error deleting landmark:", e);
        return false;
    }
}

// Function to fetch a specific landmark
export async function fetchLandmark(userId, categoryId, landmarkId) {
    const landmarkRef = ref(db, `users/${userId}/categories/${categoryId}/landmarks/${landmarkId}`);
    const snapshot = await get(landmarkRef);
    if (snapshot.exists()) {
        return { id: snapshot.key, ...snapshot.val() };
    } else {
        throw new Error("Landmark not found");
    }
}
