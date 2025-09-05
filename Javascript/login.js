import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('login-form');
  
  form.addEventListener('submit', function(event) {
    event.preventDefault(); // Stop page reload
    
    // Reset error messages
    document.querySelectorAll('.error').forEach(el => el.textContent = '');
    
    const email = document.getElementById('email').value;  
    const password = document.getElementById('password').value;
    
    // Validation
    let isValid = true;
    
    if (!email) {
      document.getElementById('email-error').textContent = 'Email is required';
      isValid = false;
    }
    
    if (!password) {
      document.getElementById('password-error').textContent = 'Password is required';
      isValid = false;
    }
    
    if (!isValid) return;

    // Firebase Login
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert("Login successful!");
        window.location.href = "login.html"; // Redirect to homepage
      })
      .catch((error) => {
        let errorMessage = "An error occurred during login.";
        
        // Handle specific Firebase errors
        switch(error.code) {
          case 'auth/invalid-email':
            errorMessage = "Invalid email address.";
            break;
          case 'auth/user-disabled':
            errorMessage = "This account has been disabled.";
            break;
          case 'auth/user-not-found':
            errorMessage = "No account found with this email.";
            break;
          case 'auth/wrong-password':
            errorMessage = "Incorrect password.";
            break;
          default:
            errorMessage = error.message;
        }
        
        alert("Error: " + errorMessage);
      });
  });
});