importScripts(
    'https://www.gstatic.com/firebasejs/9.13.0/firebase-app-compat.js'
)
importScripts(
    'https://www.gstatic.com/firebasejs/9.13.0/firebase-messaging-compat.js'
)
firebase?.initializeApp({
  apiKey: "AIzaSyBhjyeVEayrX8NZBGOWVjUlaSAf5k1rop0",
    authDomain: "restoliv-7c16f.firebaseapp.com",
    projectId: "restoliv-7c16f",
    storageBucket: "restoliv-7c16f.firebasestorage.app",
    messagingSenderId: "1033834088012",
    appId: "1:1033834088012:web:276a0112246b51bd4656e9",
    measurementId: "G-ZLPPL4DVEV"
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
