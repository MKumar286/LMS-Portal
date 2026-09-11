import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 1. Your Firebase Configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 2. Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 3. UI Elements
const viewStudentsBtn = document.getElementById("viewStudentsBtn");
const adminCollegeCodeInput = document.getElementById("adminCollegeCode");
const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");
const displayCollegeCode = document.getElementById("displayCollegeCode");
const studentCount = document.getElementById("studentCount");
const studentTableBody = document.getElementById("studentTableBody");

// 4. Fetch and Display College Students
viewStudentsBtn.addEventListener("click", async () => {
  const collegeCode = adminCollegeCodeInput.value.trim().toUpperCase();

  if (!collegeCode) {
    alert("Please enter a valid College Code!");
    return;
  }

  try {
    // Query Firestore: Get students where collegeId matches input code
    const studentsRef = collection(db, "students");
    const q = query(studentsRef, where("collegeId", "==", collegeCode));
    const querySnapshot = await getDocs(q);

    // Clear previous results
    studentTableBody.innerHTML = "";

    if (querySnapshot.empty) {
      alert("No students found for college code: " + collegeCode);
      return;
    }

    let count = 0;

    // Populate table with matching student records
    querySnapshot.forEach((doc) => {
      count++;
      const student = doc.data();

      const row = document.createElement("tr");
      row.innerHTML = `
        <td><strong>${student.name}</strong></td>
        <td>${student.email}</td>
        <td><span class="badge">${student.studentType || 'COLLEGE'}</span></td>
        <td>${student.progress || 0}% Completed</td>
      `;
      studentTableBody.appendChild(row);
    });

    // Update UI headers & show dashboard
    studentCount.textContent = count;
    displayCollegeCode.textContent = collegeCode;
    loginSection.classList.add("hidden");
    dashboardSection.classList.remove("hidden");

  } catch (error) {
    console.error("Error fetching students: ", error);
    alert("Failed to load student data. Check console for details.");
  }
});
