// src/controllers/landmarkController.js

import { db } from '../services/firebase';
import { ref, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';

export async function fetchLandmarkDetails(landmarkId, categoryId) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        console.error("User is not logged in.");
        return null;
    }

    if (!landmarkId || !categoryId) {
        console.error("Landmark ID or Category ID not provided.");
        return null;
    }

    const landmarkRef = ref(db, `users/${user.uid}/categories/${categoryId}/landmarks/${landmarkId}`);
    try {
        const snapshot = await get(landmarkRef);
        if (snapshot.exists()) {
            console.log("Landmark details fetched successfully!");
            return snapshot.val();
        } else {
            console.log("No landmark found with the provided ID.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching landmark details:", error);
        return null;
    }
}
