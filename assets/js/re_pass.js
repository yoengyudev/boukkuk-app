import { baseUrl } from "./baseUrl.js";

// Initialize lucide icons after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
});

// Function to toggle password visibility
function togglePassword(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);

  if (input && icon) {
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    icon.setAttribute("data-lucide", isPassword ? "eye-off" : "eye");
    lucide.createIcons(); // Refresh icons after toggle
  } else {
    console.error("Toggle Password: Element not found.");
  }
}
window.togglePassword = togglePassword;

// Function to display error message
function showError(inputId, message) {
  const errorElement = document.getElementById(`error${inputId}`);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.color = "red"; // Style the error message
    errorElement.style.display = "block"; // Ensure the error message is visible
  }
}

// Function to clear error message
function clearError(inputId) {
  const errorElement = document.getElementById(`error${inputId}`);
  if (errorElement) {
    errorElement.textContent = "";
    errorElement.style.display = "none"; // Hide the error message
  }
}

// Password validation function
function validatePassword(password) {
  if (!password) {
    return "សូមបញ្ចូលពាក្យសម្ងាត់";
  }
  if (password.length < 6) {
    return "ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ 6 តួអក្សរ";
  }
  if (!/^[a-zA-Z0-9]+$/.test(password)) {
    return "ពាក្យសម្ងាត់ត្រូវមានតែអក្សរ និង លេខ";
  }
  return ""; // No error
}

document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  // Form submission handler
  document.getElementById("resetForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form default behavior

    const pass1 = document.getElementById("Password1").value.trim();
    const pass2 = document.getElementById("Password2").value.trim();

    // Clear previous error messages
    clearError("Password1");
    clearError("Password2");

    let hasError = false;

    // Validate Password1
    const password1Error = validatePassword(pass1);
    if (password1Error) {
      showError("Password1", password1Error);
      hasError = true;
    }

    // Validate Password2
    if (!pass2) {
      showError("Password2", "សូមបញ្ចូលពាក្យសម្ងាត់បញ្ជាក់");
      hasError = true;
    } else if (pass1 && pass1 !== pass2) {
      showError("Password2", "ពាក្យសម្ងាត់មិនដូចគ្នា");
      hasError = true;
    }

    // If there are errors, do not proceed
    if (hasError) {
      return;
    }

    // Show spinner and proceed with API request
    document.getElementById("forget_spinner").style.display = "inline-block";

    const email = localStorage.getItem("otpEmail");
    const otp = localStorage.getItem("getOtp");

    // Check if email or OTP is missing
    if (!email || !otp) {
      showError("Password1", "កំហុស: Email ឬ OTP មិនមាន");
      document.getElementById("forget_spinner").style.display = "none";
      return;
    }

    // API request
    fetch(`${baseUrl}/api/reset/pass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        otp,
        new_pass: pass1,
        new_pass_confirmation: pass2,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        // Hide spinner
        document.getElementById("forget_spinner").style.display = "none";

        if (json.result === true && json.code === 1) {
          // Success - Redirect to login page
          window.location.href = "login.html";
        } else {
          showError("Password1", json.message || "កំហុស: Invalid input value");
        }
      })
      .catch((error) => {
        console.error("API Error:", error);
        showError("Password1", "កំហុស: Could not connect to server");
        document.getElementById("forget_spinner").style.display = "none";
      });
  });
});
