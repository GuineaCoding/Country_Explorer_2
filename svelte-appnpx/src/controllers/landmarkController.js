// controller/landmarkController.js
import { getAuth } from 'firebase/auth';
import * as landmarkModel from '../models/landmarkModel';

export async function createLandmark(landmark, categoryId) {
    if (!landmark.name || !landmark.description || !landmark.latitude || !landmark.longitude) {
        console.error("Invalid landmark data.");
        return false;
    }
    return await landmarkModel.addLandmark(landmark, categoryId);
}

export async function fetchLandmarks(categoryId) {
    const landmarks = await landmarkModel.getLandmarks(categoryId);

    return Object.entries(landmarks).map(([key, value]) => ({
        id: key,
        ...value
    }));
}

export async function modifyLandmark(landmarkId, landmark, categoryId) {
    if (!landmark.name || !landmark.description || !landmark.latitude || !landmark.longitude) {
        console.error("Invalid landmark data.");
        return false;
    }
    return await landmarkModel.updateLandmark(landmarkId, landmark, categoryId);
}

export async function removeLandmark(landmarkId, categoryId) {
    return await landmarkModel.deleteLandmark(landmarkId, categoryId);
}

export async function getLandmarkDetails(categoryId, landmarkId) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        throw new Error("User is not logged in.");
    }

    try {
        return await landmarkModel.fetchLandmark(user.uid, categoryId, landmarkId);
    } catch (error) {
        console.error("Error retrieving landmark details:", error);
        throw error; 
    }
}


