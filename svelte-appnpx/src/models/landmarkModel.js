import { db } from '../services/firebase';
import { ref, set } from 'firebase/database';

export async function addLandmark(landmark) {
    const newLandmarkRef = ref(db, 'landmarks/' + Date.now());
    try {
        await set(newLandmarkRef, landmark);
        console.log("Landmark added successfully!");
        return true;
    } catch (e) {
        console.error("Error adding landmark: ", e);
        return false;
    }
}
