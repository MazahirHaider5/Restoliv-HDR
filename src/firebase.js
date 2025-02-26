import { initializeApp, getApps, getApp } from 'firebase/app'
import {
    getMessaging,
    getToken,
    onMessage,
    isSupported,
} from 'firebase/messaging'
import { useStoreFcm } from './hooks/react-query/push-notification/usePushNotification'
const firebaseConfig = {
    apiKey: "AIzaSyBhjyeVEayrX8NZBGOWVjUlaSAf5k1rop0",
    authDomain: "restoliv-7c16f.firebaseapp.com",
    projectId: "restoliv-7c16f",
    storageBucket: "restoliv-7c16f.firebasestorage.app",
    messagingSenderId: "1033834088012",
    appId: "1:1033834088012:web:276a0112246b51bd4656e9",
    measurementId: "G-ZLPPL4DVEV"
  };

const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const messaging = (async () => {
    try {
        const isSupportedBrowser = await isSupported()
        if (isSupportedBrowser) {
            return getMessaging(firebaseApp)
        }

        return null
    } catch (err) {
        return null
    }
})()

export const fetchToken = async (setTokenFound, setFcmToken) => {
    return getToken(await messaging, {
        vapidKey:
            'BBEVtGI3ZXlRQH3CS1nANY8Cq6c209sXx5Hi5iBZGZP2tP0fhLfpKR6ScBYIK01kJfRHdxZyqm6BSG_U6XjK7y4',
    })
        .then((currentToken) => {
            if (currentToken) {
                setTokenFound(true)
                setFcmToken(currentToken)

                // Track the token -> client mapping, by sending to backend server
                // show on the UI that permission is secured
            } else {
                setTokenFound(false)
                setFcmToken()
                // shows on the UI that permission is required
            }
        })
        .catch((err) => {
            console.error(err)
            // catch error while creating client token
        })
}

export const onMessageListener = async () =>
    new Promise((resolve) =>
        (async () => {
            const messagingResolve = await messaging
            onMessage(messagingResolve, (payload) => {
                resolve(payload)
            })
        })()
    )