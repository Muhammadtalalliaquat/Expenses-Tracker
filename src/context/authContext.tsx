"use client";

import { app } from "@/firebase/firebaseconfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import {createContext, ReactNode, useContext, useEffect, useState} from "react";


type childrenType = {
    children: ReactNode;
}
type userType = {
    email: string | null;
    uid: string;
    emailVerified: boolean
}
 
type authContextType = {
    user: userType | null
}

const AuthFormContext = createContext<authContextType | null>(null);

export function AuthFormContextProvider({children}:childrenType){

        const [user , setUser] = useState<userType | null>(null)

        const router = useRouter();

        useEffect(()=>{

            const auth = getAuth(app);
            onAuthStateChanged(auth, (user) => {
            if (user){
                const {email , uid , emailVerified} = user;
                setUser({email , uid , emailVerified})
                // console.log(email , uid , emailVerified);
                if(user.emailVerified){
                     router.push("/");
                }
                else{
                    router.push("/emailverify");
                    
                }
            }
            else {
                console.log(`inside onauthstatechange else statemnet`);
                setUser(null);
                router.push("/signup");
        }
        });
        } , [router])
        
            

     return (
        <AuthFormContext.Provider value={{user}}>
                {children}
        </AuthFormContext.Provider>
     )   
    
}

// eslint-disable-next-line react-hooks/rules-of-hooks
export const authContextData = ()=> useContext(AuthFormContext);