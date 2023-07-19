import admin from "firebase-admin";

const sendNotification = async (fcm: any, message: any) => {
    const notification = {
        token: fcm,
        notification: {
            title: 'New course alert',
            body: message
        }
    }

    const notifac = await admin.messaging().send(notification);
    console.log(`Push notification sent ${notifac}`)
}

export default sendNotification