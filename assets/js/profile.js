import { AdminToken, UserToken } from "./tokens.js";
import { baseUrl } from "./baseUrl.js";
// Validation functions using regex
const validators = {
  name: {
    regex: /^.{3,50}$/,
    message:
      "Name must be 3-50 characters long and contain only letters, numbers and spaces",
  },
  description: {
    regex: /^.{5,500}$/,
    message: "Description must be between 10-500 characters long",
  },
  price: {
    regex: /^\d*\.?\d{0,2}$/,
    message: "Please enter a valid price (e.g., 99.99)",
  },
  discount: {
    regex: /^(?:100|[0-9]{1,2})$/,
    message: "Discount must be between 0-100",
  },
  category_id: {
    regex: /^[1-9]\d*$/,
    message: "Please select a valid category",
  },
};

// Function to validate a single field
const validateField = (name, value) => {
  if (!validators[name]) return true;

  // Handle empty required fields
  if (!value && name !== "discount") {
    return false;
  }

  return validators[name].regex.test(value);
};





// Add this function to handle password visibility toggle
window.togglePasswordVisibility = function (inputId, icon) {
  const input = document.getElementById(inputId);
  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("bi-eye");
    icon.classList.add("bi-eye-slash");
  } else {
    input.type = "password";
    icon.classList.remove("bi-eye-slash");
    icon.classList.add("bi-eye");
  }
};

// Update your menu items to trigger the modal
document.addEventListener("DOMContentLoaded", function () {
  const profile = document.querySelector(".profile");
  const menu = document.querySelector(".menu");
  const profileModal = new bootstrap.Modal(
    document.getElementById("profileModal")
  );

  // Handle menu item clicks
  menu.addEventListener("click", function (e) {
    const link = e.target.closest("a");
    if (!link) return;

    e.preventDefault();
    const type = link.textContent.trim().toLowerCase().includes("password")
      ? "password"
      : "information";

    // Update modal content
    const modalTitle = document.getElementById("profileModalTitle");
    const modalBody = document.querySelector("#profileModal .modal-body");

    modalTitle.textContent = modalContent[type].title;
    modalBody.innerHTML = modalContent[type].content;

    // Initialize form handlers AFTER the modal content is set
    if (type === "information") {
      // Wait for next tick to ensure DOM is updated
      setTimeout(() => {
        initInformationForm();
      }, 0);
    } else {
      initPasswordForm();
    }

    // Show modal
    profileModal.show();
    menu.classList.remove("active");
  });

  // Information form handler
  function initInformationForm() {
    const form = document.getElementById("informationForm");
    fetch(`${baseUrl}/api/me`, {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + AdminToken,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        document.getElementById("profileName").value = data.data.name || "";
        document.getElementById("profileEmail").value = data.data.email || "";
        document.getElementById("profilePhone").value = data.data.phone || "";
        document.getElementById("profileLongitude").value = data.data.longitude || "";
        document.getElementById("profileLatitude").value = data.data.latitude || "";
      });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = new FormData();
      formData.append("name", document.getElementById("profileName").value);
      formData.append("email", document.getElementById("profileEmail").value);
      formData.append("phone", document.getElementById("profilePhone").value);
      formData.append("longitude", document.getElementById("profileLongitude").value);
      formData.append("latitude", document.getElementById("profileLatitude").value);
      // Update profile info
      fetch(`${baseUrl}/api/profile/info`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + AdminToken,
        },
        body: JSON.stringify(formData),
      })
        .then((res) => {
          // Log the raw response
          console.log("Profile update response:", res);
          return res.json();
        })
        .then((data) => {
          // Log the parsed response data
          console.log("Profile update data:", data);

          // Check if there's an avatar to update
          const avatarInput = document.getElementById("profileAvatar");
          if (avatarInput.files.length > 0) {
            const avatarFormData = new FormData();
            avatarFormData.append("avatar", avatarInput.files[0]);

            // Log avatar update attempt
            console.log("Sending avatar update");

            // Update avatar
            return fetch(`${baseUrl}/api/profile/avatar`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                Authorization: "Bearer " + AdminToken,
              },
              body: avatarFormData,
            });
          }
          return null;
        })
        .then((res) => {
          if (res) {
            // Log avatar update response
            console.log("Avatar update response:", res);
            return res.json();
          }
          return null;
        })
        .then((data) => {
          if (data) {
            // Log avatar update data
            console.log("Avatar update data:", data);
          }
          alert("Profile updated successfully!");
          profileModal.hide();
          window.location.reload();
        })
        .catch((error) => {
          // Detailed error logging
          console.error("Error updating profile:", error);
          console.error("Error details:", {
            message: error.message,
            stack: error.stack
          });
          alert("Failed to update profile. Please try again.");
        });
    });
  }
  window.initInformationForm = initInformationForm;
  initInformationForm();
  // Password form handler
  function initPasswordForm() {
    const form = document.getElementById("passwordForm");

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const newPassword = document.getElementById("newPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (newPassword !== confirmPassword) {
        alert("New passwords do not match!");
        return;
      }

      const data = {
        current_password: document.getElementById("currentPassword").value,
        new_password: newPassword,
        confirm_password: confirmPassword,
      };

      fetch(`${baseUrl}/api/change-password`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + AdminToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data) => {
          alert("Password changed successfully!");
          profileModal.hide();
          form.reset();
        })
        .catch((error) => {
          alert("Failed to change password. Please try again.");
        });
    });
  }
});
// ================================================
const sidebarItems = document.querySelectorAll(".sidebar-item");
const contentSections = document.querySelectorAll(".content-section");

sidebarItems.forEach((item) => {
  item.addEventListener("click", function () {
    const sectionId = this.getAttribute("data-section");

    sidebarItems.forEach((si) => si.classList.remove("active"));
    this.classList.add("active");

    contentSections.forEach((section) => {
      if (section.id === sectionId) {
        section.classList.remove("d-none");
      } else {
        section.classList.add("d-none");
      }
    });
  });
});

document
  .getElementById("cardNumber")
  .addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "").substring(0, 16);
    let formattedValue = "";
    for (let i = 0; i < value.length; i += 4) {
      formattedValue += value.substring(i, i + 4) + " ";
    }
    e.target.value = formattedValue.trim();
  });

document
  .getElementById("expiryDate")
  .addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "").substring(0, 4);
    let formattedValue = "";
    if (value.length > 2) {
      formattedValue =
        value.substring(0, 2) + "/" + value.substring(2, 4);
    } else {
      formattedValue = value;
    }
    e.target.value = formattedValue;
  });

document.getElementById("cvv").addEventListener("input", function (e) {
  this.value = this.value.replace(/\D/g, "").substring(0, 3);
});

document
  .getElementById("add-payment-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const paymentType = document.getElementById("paymentType").value;
    const cardNumber = document
      .getElementById("cardNumber")
      .value.replace(/\s/g, "");
    const lastFourDigits = cardNumber.slice(-4);
    const paymentMethodsList = document.getElementById(
      "payment-methods-list"
    );

    const newCard = document.createElement("div");
    newCard.className = "card mb-2";
    newCard.innerHTML = `
      <div class="card-body d-flex justify-content-between align-items-center">
        <div>
          <i class="fab fa-cc-${paymentType} me-2"></i>
          <span>${paymentType.charAt(0).toUpperCase() + paymentType.slice(1)
      } បញ្ចប់ដោយលេខ ${lastFourDigits}</span>
        </div>
        <button class="btn btn-sm btn-outline-danger remove-payment">លុប</button>
      </div>
    `;
    paymentMethodsList.appendChild(newCard);

    const modal = bootstrap.Modal.getInstance(
      document.getElementById("addPaymentModal")
    );
    modal.hide();
    document.getElementById("add-payment-form").reset();

    newCard
      .querySelector(".remove-payment")
      .addEventListener("click", function () {
        paymentMethodsList.removeChild(newCard);
      });
  });

document
  .getElementById("payment-methods-list")
  .addEventListener("click", function (e) {
    if (e.target.classList.contains("remove-payment")) {
      const card = e.target.closest(".card");
      paymentMethodsList.removeChild(card);
    }
  });

// Add this function to toggle password visibility
function togglePasswordVisibility(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);
  if (input.type === "password") {
    input.type = "text"; // Change to text to show password
    icon.classList.remove("fa-eye"); // Change icon to 'eye' open
    icon.classList.add("fa-eye-slash"); // Change icon to 'eye' closed
  } else {
    input.type = "password"; // Change back to password
    icon.classList.remove("fa-eye-slash"); // Change icon to 'eye' closed
    icon.classList.add("fa-eye"); // Change icon to 'eye' open
  }
}

// Add event listeners for the eye icons
document
  .getElementById("toggleCurrentPassword")
  .addEventListener("click", function () {
    togglePasswordVisibility("currentPassword", "toggleCurrentPassword");
  });

document
  .getElementById("toggleNewPassword")
  .addEventListener("click", function () {
    togglePasswordVisibility("newPassword", "toggleNewPassword");
  });

document
  .getElementById("toggleConfirmPassword")
  .addEventListener("click", function () {
    togglePasswordVisibility("confirmPassword", "toggleConfirmPassword");
  });