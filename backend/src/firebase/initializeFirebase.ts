import admin from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import path from "path";

const initializeFirebaseApp = () => {
    const serviceAccount = path.join(`${__dirname}/config/e-learning-appplication-firebase-adminsdk-3kbp2-d91878c2ad.json`);
    initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

export default initializeFirebaseApp;