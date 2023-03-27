import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "********************************",
    authDomain: "********************************",
    projectId: "********************************",
    storageBucket: "********************************",
    messagingSenderId: "********************************",
    appId: "********************************",
    measurementId: "********************************",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let role = "";

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const refreshRole =  () => {
  retreiveRole();
}

const retreiveRole =  () => {
  auth.currentUser && auth.currentUser.getIdTokenResult()
  .then((idTokenResult) => {
    if (!!idTokenResult.claims.ADMIN) {
      role = 'ADMIN';
    } else if (!!idTokenResult.claims.GUEST) {
      role = 'GUEST';
    } else if (!!idTokenResult.claims.SUBMITTER) {
      role = 'SUBMITTER';
    } else{
      role = 'NONE'
    }
  })
  .catch((error) => {
    console.log(error);
    logout();
  });
}

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    retreiveRole();
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const sendPasswordReset = async (email, callback) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
    callback();
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
  localStorage.removeItem('token');
};

export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  role,
  refreshRole,
};