lucide.createIcons();

function togglePassword(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);
  const isPassword = input.type === "password";

  input.type = isPassword ? "text" : "password";
  icon.setAttribute("data-lucide", isPassword ? "eye-off" : "eye");
  lucide.createIcons();
}

// Function to display error message
function showError(inputId, message) {
  const errorElement = document.getElementById(`error${inputId}`);
  errorElement.textContent = message;
  errorElement.style.color = "red"; // Style the error message
}

// Function to clear error message
function clearError(inputId) {
  const errorElement = document.getElementById(`error${inputId}`);
  errorElement.textContent = "";
}

// Password validation function
function validatePassword(password) {
  const hasMinLength = password.length >= 6;
  const isAtLeastSixLength = /^[a-zA-Z0-9]{6,}$/.test(password);
  return "";
}

document.getElementById("resetForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const pass1 = document.getElementById("Password1").value.trim();
  const pass2 = document.getElementById("Password2").value.trim();
  const email = localStorage.getItem("otpEmail");
  const otp = localStorage.getItem("getOtp");

  // Clear previous errors
  clearError("Password1");
  clearError("Password2");

  // Check localStorage values
  console.log("Email:", email);
  console.log("OTP:", otp);

  // Validate input fields
  const validationError = validatePassword(pass1);
  if (validationError) {
    showError("Password1", validationError);
    return;
  }

  // Check if passwords match
  if (pass1 !== pass2) {
    showError("Password2", "ពាក្យសម្ងាត់មិនដូចគ្នា");
    return;
  }

  // Check if email or OTP is missing
  if (!email || !otp) {
    showError("Password1", "កំហុស: Email ឬ OTP មិនមាន");
    return;
  }

  // API request
  fetch("https://mps10.chandalen.dev/api/reset/pass", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      email: email,
      otp: otp,
      new_pass: pass1,
      new_pass_confirmation: pass2,
    }),
  })
    .then((res) => res.json())
    .then((json) => {
      console.log("API Response:", json);
    
      // Check API response using result and code
      if (json.result === true && json.code === 1) {
        // Success - Redirect to login page without showing any message
        window.location.href = "login.html";
      } else {
        // Show error message if not successful
        showError("Password1", json.message || "កំហុស: Invalid input value");
      }
    })
    .catch((error) => {
      console.error("API Error:", error);
      showError("Password1", "កំហុស: Could not connect to server");
    });
});
