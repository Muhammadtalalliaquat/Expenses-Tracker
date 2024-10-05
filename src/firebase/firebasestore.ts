import { collection, doc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";
import { app } from "./firebaseconfig";
import { auth } from "./firebaseauth";

const db = getFirestore(app);


type UserType = {
    email: string,
    emailVerified: boolean,
    uid: string
}

export default  async function dbUser(user: UserType){
    try{
        const docRef = doc(db , "users" , user.uid);
        await setDoc(docRef , user)
    }
    catch(error){
        console.log(error)
    }
}


export async function fetchUser(){
    const collectionRef = collection(db , "todos");
    const currentUser = auth.currentUser?.uid;

    const condition = where("uid" , "==", currentUser);
    const q = query(collectionRef , condition);

    const allUserSnapshot = await getDocs(q);

    // console.log(allTodosSnapshot.size , "All list of users");

    const allUser = allUserSnapshot.docs.map((userSnapshot)=>{
        const userData = userSnapshot.data();
        userData.id = userSnapshot.id; 
        console.log(userData);
        return userData
    })
    return allUser;
}