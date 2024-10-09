import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
     apiKey: "AIzaSyC7pK4bURWr3Y8YGXlYGOxhEQGmBLuxLd4",
     NEXT_PUBLIC_authDomain: process.env.NEXT_PUBLIC_authDomain,
     NEXT_PUBLIC_projectId: process.env.NEXT_PUBLIC_projectId,
     NEXT_PUBLIC_storageBucket: process.env.NEXT_PUBLIC_storageBucket,
     NEXT_PUBLIC_messagingSenderId: process.env.NEXT_PUBLIC_messagingSenderId,
     NEXT_PUBLIC_appId: process.env.NEXT_PUBLIC_appId,
     NEXT_PUBLIC_measurementId: process.env.NEXT_PUBLIC_measurementId
  };
  
  export const app = initializeApp(firebaseConfig);
//   const analytics = getAnalytics(app);
