// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { doc, addDoc, getDocs, getDoc, updateDoc, arrayUnion, collection, getFirestore, deleteDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCz2pzZN19R-b3_obMnI9jWzF4xy5-2XuA",
  authDomain: "administrasjon.firebaseapp.com",
  projectId: "administrasjon",
  storageBucket: "administrasjon.appspot.com",
  messagingSenderId: "1018453494625",
  appId: "1:1018453494625:web:4f1a40415bba54ca81d320"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)

export const db = getFirestore(app);


export const addCandidate = async ({
  firstname,
  files,
  lastname,
  phonenumber,
  mail,
  company,
  role,
  yearsOfExperience,
  leader,
  acquaintance,
  department,
  status,
  followUpTime,
  comments
}) => {
    try {
        const docRef = await addDoc(collection(db, 'candidates'), {
          files,
          firstname,
          lastname,
          phonenumber,
          mail,
          company,
          role,
          yearsOfExperience,
          leader,
          acquaintance,
          department,
          status,
          followUpTime,
          comments
        })
    } catch (e) {
        console.error("Error adding document: ", e)
    }
}

export const deleteCandidate = async (id) => {
  await deleteDoc(doc(db, "candidates", id))
}

export const addDialog = async (id, dialog) => {
  await updateDoc(doc(db, "candidates", id), {
    dialogs: arrayUnion(dialog)
  })
}

export const getCandidate = async id => {
  // const docRef = doc(db, "candidates", id)
  const response = await getDoc(doc(db, "candidates", id))
  return response.data()
}

export const getCandidates = async () => {
  const querySnapshot = await getDocs(collection(db, 'candidates'));
  let candidates = []

  querySnapshot.forEach(doc => {
    let data = doc.data()
    data.id = doc.id
    candidates.push(data)
  })

  return candidates
}