// controller/landmarkController.js

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

    // Map to ensure each landmark object has an 'id' property
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
