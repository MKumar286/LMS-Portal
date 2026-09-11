import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Paste your Firebase Config keys here
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById("signupBtn").addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const collegeCode = document.getElementById("collegeCode").value.toUpperCase().trim();

  try {
    // 1. Create account in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // 2. Link student to College Code or set as INDIVIDUAL
    const studentData = {
      name: name,
      email: email,
      studentType: collegeCode !== "" ? "COLLEGE" : "INDIVIDUAL",
      collegeId: collegeCode !== "" ? collegeCode : "NONE",
      coursesEnrolled: [],
      progress: 0
    };

    // 3. Save to Firestore
    await setDoc(doc(db, "students", uid), studentData);
    alert("Account created successfully!");

  } catch (error) {
    alert("Error: " + error.message);
  }
});
