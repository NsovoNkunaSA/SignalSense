import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('signup-form');
  
  form.addEventListener('submit', function(event) {
    event.preventDefault(); // Stop page reload
    
    // Reset error messages
    document.querySelectorAll('.error').forEach(el => el.textContent = '');
    
    const email = document.getElementById('email').value;  
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Validation
    let isValid = true;
    
    if (!email) {
      document.getElementById('email-error').textContent = 'Email is required';
      isValid = false;
    }
    
    if (!password) {
      document.getElementById('password-error').textContent = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      document.getElementById('password-error').textContent = 'Password must be at least 6 characters';
      isValid = false;
    }
    
    if (password !== confirmPassword) {
      document.getElementById('confirm-password-error').textContent = "Passwords do not match";
      isValid = false;
    }
    
    if (!isValid) return;

    // Firebase Signup
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert("Signup successful! Now login.");
        window.location.href = "../HTML/login.html"; // Redirect to login page
      })
      .catch((error) => {
        let errorMessage = "An error occurred during signup.";
        
        // Handle specific Firebase errors
        switch(error.code) {
          case 'auth/email-already-in-use':
            errorMessage = "This email is already in use.";
            break;
          case 'auth/invalid-email':
            errorMessage = "Invalid email address.";
            break;
          case 'auth/weak-password':
            errorMessage = "Password is too weak.";
            break;
          default:
            errorMessage = error.message;
        }
        
        alert("Error: " + errorMessage);
      });
  });
});