// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  getFirestore,
  query,
  updateDoc,
  setDoc ,
  where,
  arrayRemove
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

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
// acquaintance, company, department, followUpTime, leader, mail, phonenumber, role, status, yearsOfExperience
export const updateCandidates = async (id, data) => {
  for (const key in data) {
    await setDoc(doc(db, "candidates", id), {
      [key]: data[key]
    }, {merge: true})
  }
}

export const uploadFiles = async(files, path) => {
  let fileList = []

  for(let key in files) {
    const fileRef = ref(storage, `${path}/${files[key].name}`)
    await uploadBytes(fileRef, files[key])
    .then(async() => {
      await getDownloadURL(fileRef)
      .then((url) => {
        let obj = { 
          fileName: files[key].name,
          url: url
        }
        fileList.push(obj)
      })
    })
  }
  return fileList
}

export const deleteCandidate = async (id, folder, files) => {
  files.forEach(({fileName}) => {
    deleteFile(folder, fileName)
  })
  await deleteDoc(doc(db, "candidates", id))
}

export const deleteFile = (folder, fileName) => {
    const candidateRef = ref(storage, `${folder}/${fileName}`)
    deleteObject(candidateRef)
}

// export delete

export const updateDocArray = async (key, id, value, remove) => {
  value.forEach(obj => {
    updateDoc(doc(db, "candidates", id), {
      [`${key}`]: remove ? arrayRemove(obj) : arrayUnion(obj)
    })    
  })
}

export const filter = async (field, value) => {
  const q = query(collection(db, "candidates"), where(field, "==", value))
  let filterList = []

  const querySnapshot = await getDocs(q)

  querySnapshot.forEach((doc) => {
    let data = doc.data()
    data.id = doc.id
    filterList.push(data)
  })
  
  return filterList
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