import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDE2mUDdNud56HdpOEsUpOx0V7hBe_H1Bk",
  authDomain: "landing-e1004.firebaseapp.com",
  projectId: "landing-e1004",
  storageBucket: "landing-e1004.firebasestorage.app",
  messagingSenderId: "661040978222",
  appId: "1:661040978222:web:b71493e1e6e11cace342bf",
  measurementId: "G-WKG69FW1W2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);

export default app;