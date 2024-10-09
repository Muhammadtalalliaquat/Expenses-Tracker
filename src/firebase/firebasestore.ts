"use cilent";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { app } from "./firebaseconfig";
import { auth } from "./firebaseauth";

const db = getFirestore(app);

type UserType = {
  email: string;
  uid: string;
  emailVerified: boolean
};

export default async function saveUser(user: UserType) {
  try {
    const docRef = doc(db, "users", user.uid);
    await setDoc(docRef, user);
  } catch (error) {
    console.log(error);
  }
}

export async function saveExpense(
  title: string,
  amount: number,
  category: string,
  optionalNote: string,
) {
  const uid = auth.currentUser?.uid;
  const collectionRef = collection(db, "expenses");
  const newExpenses = { title, amount, category, optionalNote, uid };

  try {
    const docRef = await addDoc(collectionRef, newExpenses);
    const docRefToUpdate = doc(db, "expenses", docRef.id);
    await updateDoc(docRefToUpdate, {
      firebaseID: docRef.id,
    });
  } catch (error) {
    console.log(error);
  }
}

// export async function fetchexpenses(){
//     let collectionRef = collection(db , "expenses");
//     let currentUser = auth.currentUser?.uid;

//     let condition = where("uid" , "==", currentUser);
//     let q = query(collectionRef , condition);

//     let allexpensesSnapshot = await getDocs(q);

//     // console.log(allTodos.size , "All list of Todos");

//     let allexpenses = allexpensesSnapshot.docs.map((allexpensesSnapshot)=>{
//         let expenseData = allexpensesSnapshot.data();
//         expenseData.id = allexpensesSnapshot.id;
//         console.log(expenseData);
//         return expenseData
//     })
//     return allexpenses;
// }





export async function delectExpenseList(firebaseID: string) {
  try {
    const expenseRef = doc(db, "expenses", firebaseID);
    await deleteDoc(expenseRef);
    console.log(firebaseID);
  } catch (error) {
    console.log(error, "delectExpenseList");
  }
}

































// import { collection, doc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";
// import { app } from "./firebaseconfig";
// import { auth } from "./firebaseauth";

// const db = getFirestore(app);


// type UserType = {
//     email: string,
//     emailVerified: boolean,
//     uid: string
// }

// export default  async function dbUser(user: UserType){
//     try{
//         const docRef = doc(db , "users" , user.uid);
//         await setDoc(docRef , user)
//     }
//     catch(error){
//         console.log(error)
//     }
// }


// export async function fetchUser(){
//     const collectionRef = collection(db , "todos");
//     const currentUser = auth.currentUser?.uid;

//     const condition = where("uid" , "==", currentUser);
//     const q = query(collectionRef , condition);

//     const allUserSnapshot = await getDocs(q);

//     // console.log(allTodosSnapshot.size , "All list of users");

//     const allUser = allUserSnapshot.docs.map((userSnapshot)=>{
//         const userData = userSnapshot.data();
//         userData.id = userSnapshot.id; 
//         console.log(userData);
//         return userData
//     })
//     return allUser;
// }