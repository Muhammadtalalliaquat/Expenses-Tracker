import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
    NEXT_PUBLIC_apiKey= "AIzaSyC7pK4bURWr3Y8YGXlYGOxhEQGmBLuxLd4"
    NEXT_PUBLIC_authDomain= "authentication-project-a71a9.firebaseapp.com"
    NEXT_PUBLIC_projectId= "authentication-project-a71a9"
    NEXT_PUBLIC_storageBucket= "authentication-project-a71a9.appspot.com"
    NEXT_PUBLIC_messagingSenderId= "465429438842"
    NEXT_PUBLIC_appId= "1:465429438842:web:08e663796281fda2bdf6c3"
    NEXT_PUBLIC_measurementId= "G-FTF8W9KHYS"
  };
  
  export const app = initializeApp(firebaseConfig);
//   const analytics = getAnalytics(app);
