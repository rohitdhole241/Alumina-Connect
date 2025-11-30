// DOM Elements
const form = document.getElementById('signup-form');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const strengthBar = document.querySelector('.strength-bar');
const strengthText = document.querySelector('.strength-text');
const toggleInput = document.getElementById('toggle');
const studentFields = document.querySelector('.student-fields');
const alumniFields = document.querySelector('.alumni-fields');
const majorSelect = document.getElementById('major_field_of_study');
const otherMajorField = document.querySelector('.other-major');
const fileInput = document.getElementById('certificates');
const fileName = document.querySelector('.file-name');

// Initialize the form
document.addEventListener('DOMContentLoaded', function() {
  // Set current year in footer
  document.getElementById('graduation_year').textContent = new Date().getFullYear();
  
  // Password strength meter
  if (passwordInput) {
    passwordInput.addEventListener('input', checkPasswordStrength);
  }
  
  // Toggle between student and alumni
  if (toggleInput) {
    toggleInput.addEventListener('change', toggleStudentAlumni);
  }
  
  
  // Update file name on file selection
  if (fileInput) {
    fileInput.addEventListener('change', function() {
      if (this.files.length > 0) {
        fileName.textContent = this.files[0].name;
      } else {
        fileName.textContent = 'No file chosen';
      }
    });
  }
  
  // Form submission
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validate form
      if (validateForm()) {
        // Create a new FormData object
        const formData = new FormData(form);
  
        // Send the form data to the server
        fetch('/signup/', {
          method: 'POST',
          body: formData,
        })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
      }
    });
  }
});

// Toggle between student and alumni fields
function toggleStudentAlumni() {
  if (toggleInput.checked) {
    // Show Alumni fields, hide Student fields
    studentFields.style.display = 'none';
    alumniFields.style.display = 'block';
  } else {
    // Show Student fields, hide Alumni fields
    studentFields.style.display = 'block';
    alumniFields.style.display = 'none';
  }
}

// Check password strength
function checkPasswordStrength() {
  const password = passwordInput.value;
  let strength = 0;
  
  // Length check
  if (password.length >= 8) {
    strength += 1;
  }
  
  // Contains lowercase
  if (/[a-z]/.test(password)) {
    strength += 1;
  }
  
  // Contains uppercase
  if (/[A-Z]/.test(password)) {
    strength += 1;
  }
  
  // Contains number
  if (/[0-9]/.test(password)) {
    strength += 1;
  }
  
  // Contains special character
  if (/[^A-Za-z0-9]/.test(password)) {
    strength += 1;
  }
  
  // Update strength bar
  let width = (strength / 5) * 100;
  let color = '';
  let text = '';
  
  if (strength === 0) {
    color = '#e0e0e0';
    text = 'Password strength';
  } else if (strength <= 2) {
    color = '#e74c3c';
    text = 'Weak';
  } else if (strength <= 4) {
    color = '#f39c12';
    text = 'Medium';
  } else {
    color = '#2ecc71';
    text = 'Strong';
  }
  
  strengthBar.style.width = `${width}%`;
  strengthBar.style.backgroundColor = color;
  strengthText.textContent = text;
  strengthText.style.color = color;
}

// Validate form
function validateForm() {
  let isValid = true;
  
  // Validate email
  const email = document.getElementById('email').value;
  if (!email || !isValidEmail(email)) {
    alert('Please enter a valid email address');
    isValid = false;
    return false;
  }
  
  // Validate phone
  const phone_number = document.getElementById('phone_number').value;
  if (!phone_number || !isValidPhone(phone_number)) {
    alert('Please enter a valid phone number');
    isValid = false;
    return false;
  }
  
  // Validate password
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  
  if (!password || password.length < 8) {
    alert('Password must be at least 8 characters long');
    isValid = false;
    return false;
  } else if (password !== confirmPassword) {
    alert('Passwords do not match');
    isValid = false;
    return false;
  }
  
  // Validate name
  const name = document.getElementById('name').value;
  if (!name) {
    alert('Please enter your full name');
    isValid = false;
    return false;
  }
  
  // Validate gender
  const gender = document.getElementById('gender').value;
  if (!gender) {
    alert('Please select your gender');
    isValid = false;
    return false;
  }
  
  // Validate date of birth
  const date_of_birth = document.getElementById('date_of_birth').value;
  if (!date_of_birth) {
    alert('Please enter your date of birth');
    isValid = false;
    return false;
  }
  
  // Validate address
  const address = document.getElementById('address').value;
  if (!address) {
    alert('Please enter your current address');
    isValid = false;
    return false;
  }
  
  // Validate institution
  const institute_name = document.getElementById('institute_name').value;
  if (!institute_name) {
    alert('Please enter your institution name');
    isValid = false;
    return false;
  }
  
  // Validate degree
  const name_of_degree = document.getElementById('name_of_degree').value;
  if (!name_of_degree) {
    alert('Please enter your degree');
    isValid = false;
    return false;
  }
  
  // Validate major
  const major_field_of_study = document.getElementById('major_field_of_study').value;
  if (!major_field_of_study) {
    alert('Please select your major field of study');
    isValid = false;
    return false;
  }
  
  // Check terms agreement
  const termsCheckbox = document.querySelector('input[name="terms"]');
  if (!termsCheckbox.checked) {
    alert('Please agree to the Terms and Conditions');
    isValid = false;
    return false;
  }
  
  return isValid;
  
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone validation
function isValidPhone(phone_number) {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone_number);
}

// Form submission
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Validate form
    if (validateForm()) {
      // Create a new FormData object
      const formData = new FormData(form);

      // Send the form data to the server
      fetch('/signup/', {
        method: 'POST',
        body: formData,
      })
      .then((response) => {
        if (response.ok) {
          // Redirect to /myprofile/ on successful signup
          window.location.href = "/myprofile/";
        } else {
          // Handle signup errors by parsing the JSON error response
          return response.json().then(errorData => {
            console.error("Signup failed:", errorData);
            alert("Signup failed: " + (errorData.detail || "Something went wrong"));
            throw new Error("Signup failed");
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Something went wrong during signup.");
      });
    }
  });
}