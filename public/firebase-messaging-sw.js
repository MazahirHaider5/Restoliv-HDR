importScripts(
    'https://www.gstatic.com/firebasejs/9.13.0/firebase-app-compat.js'
)
importScripts(
    'https://www.gstatic.com/firebasejs/9.13.0/firebase-messaging-compat.js'
)
firebase?.initializeApp({
    apiKey: "AIzaSyAT1Ff4lEwLNdaGpjDgK49sXMfavz5HqQ4",
    authDomain: "ammart-e9ef3.firebaseapp.com",
    projectId: "ammart-e9ef3",
    storageBucket: "ammart-e9ef3.firebasestorage.app",
    messagingSenderId: "1002134161719",
    appId: "1:1002134161719:web:8487de29401b45912272b2",
    measurementId: "G-SQZQZD9J2X"
})


// Retrieve firebase messaging
const messaging = firebase?.messaging()

messaging.onBackgroundMessage(function (payload) {
    const notificationTitle = payload.notification.title
    const notificationOptions = {
        body: payload.notification.body,
    }

    self.registration.showNotification(notificationTitle, notificationOptions)
})
