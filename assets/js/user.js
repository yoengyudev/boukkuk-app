// =======================>> Get all user <<========================
import { AdminToken } from "./tokens.js";
import { baseUrl } from "./baseUrl.js";
import { modalContent, togglePasswordVisibility } from "./updateUserInfo.js";

fetch(`${baseUrl}/api/users`, {
  method: "GET",
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${AdminToken}`,
  },
})
  .then((res) => res.json())
  .then((json) => {
    let tr = "";
    const users = json.data;
    users.forEach((e) => {
      const isDisabled = e.is_disabled === 1;
      tr += `<tr>
                <td class='text-start'>${e.id}</td>
                <td>${e.name}</td>
                <td>${e.email}</td>
               <td>
                    <div class="btn-group dropstart p-0">
                        <button type="button" class="btn p-0 border-0" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-person-fill"></i>
                            <i class="bi bi-arrow-up-short"></i>
                        </button>
                        <ul class="dropdown-menu" style="width:200px">
                            <li>
                                <button type="button" class="btn" onclick="promoteUser(1, ${e.id})">
                                    <i class="bi bi-person-fill text-success"></i> User
                                </button>
                            </li>
                            <li>
                                <button type="button" class="btn" onclick="promoteUser(3, ${e.id})">
                                    <i class="bi bi-briefcase-fill text-info"></i> Provider
                                </button>
                            </li>
                            <li>
                                <button type="button" class="btn" onclick="promoteUser(2, ${e.id})">
                                    <i class="bi bi-shield-lock-fill text-primary"></i> Admin
                                </button>
                            </li>
                        </ul>
                    </div>
                </td>


                <td>
                    <a href="javascript:void(0)" onclick="toggleUserStatus(this, ${e.id}, ${isDisabled})" class="btn_status p-0 text-decoration-none">
                        <i class="bi bi-toggle-${isDisabled ? 'off' : 'on'} text-${isDisabled ? 'dark' : 'primary'} btn_status_icon fs-4"></i>
                    </a>
                </td>
                <td>
                    <div class="btn-group dropstart">
                        <button type="button" class="btn border-0 p-0" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-three-dots-vertical"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li>
                             <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#updateUser" onclick="getUserForUpdate(${e.id})">
                                <i class="bi bi-pencil-square text-warning"></i> Edit
                            </button>
                            </li>
                            <li>
                                <button type="button" onclick="deleteUser(${e.id})" class="btn">
                                    <i class="bi bi-trash text-danger"></i> Delete
                                </button>
                            </li>
                            <li>
                                <button type="button" onclick="viewDetails(${e.id})" class="btn" data-bs-toggle="modal" data-bs-target="#getDetail">
                                    <i class="bi bi-eye text-primary"></i> View Details
                                </button>
                            </li>
                        </ul>
                    </div>
                </td>
            </tr>`;
    });
    document.getElementById("table_body").innerHTML = tr;

    $("#userTabel").DataTable({
      responsive: true,
    });
  })
  .catch((error) => console.error("Error fetching data:", error));

// ======================  add new users ======================================

// Regular expression patterns
const namePattern = /^.{3,50}$/;
const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const phonePattern = /^\+?\d{1,2}?[-\s]?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/;
const passwordPattern = /^\d{6,}$/;

function validateForm() {
  let isValid = true;

  // Validate name
  let nameInput = document.getElementById("userName");
  if (!namePattern.test(nameInput.value) || nameInput.value.trim() === "") {
    nameInput.classList.add("is-invalid");
    nameInput.nextElementSibling.textContent = "Please enter a valid name.";
    isValid = false;
  } else {
    nameInput.classList.remove("is-invalid");
    nameInput.nextElementSibling.textContent = "";
  }

  // Validate email
  let emailInput = document.getElementById("userEmail");
  if (
    !emailPattern.test(emailInput.value.trim()) ||
    emailInput.value.trim() === ""
  ) {
    emailInput.classList.add("is-invalid");
    emailInput.nextElementSibling.textContent =
      "Please enter a valid email address.";
    isValid = false;
  } else {
    emailInput.classList.remove("is-invalid");
    emailInput.nextElementSibling.textContent = "";
  }

  // Validate phone
  let phoneInput = document.getElementById("userPhone");
  if (
    !phonePattern.test(phoneInput.value.trim()) ||
    phoneInput.value.trim() === ""
  ) {
    phoneInput.classList.add("is-invalid");
    phoneInput.nextElementSibling.textContent =
      "Please enter a valid phone number.";
    isValid = false;
  } else {
    phoneInput.classList.remove("is-invalid");
    phoneInput.nextElementSibling.textContent = "";
  }

  // Validate password
  let passwordInput = document.getElementById("userPass");
  let confirmPasswordInput = document.getElementById("userConfirmPass");
  if (
    !passwordPattern.test(passwordInput.value.trim()) ||
    passwordInput.value.trim() === ""
  ) {
    passwordInput.classList.add("is-invalid");
    passwordInput.nextElementSibling.textContent =
      "Password must be at least 6 characters";
    isValid = false;
  } else {
    passwordInput.classList.remove("is-invalid");
    passwordInput.nextElementSibling.textContent = "";
  }

  // Validate confirm password
  if (
    confirmPasswordInput.value.trim() === "" ||
    passwordInput.value.trim() !== confirmPasswordInput.value.trim()
  ) {
    confirmPasswordInput.classList.add("is-invalid");
    confirmPasswordInput.nextElementSibling.textContent =
      "Passwords do not match.";
    isValid = false;
  } else {
    confirmPasswordInput.classList.remove("is-invalid");
    confirmPasswordInput.nextElementSibling.textContent = "";
  }

  // Validate image file (optional but if selected, must be an image)
  let imageInput = document.getElementById("userImage");
  if (imageInput.files.length > 0) {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(imageInput.files[0].type)) {
      imageInput.classList.add("is-invalid");
      imageInput.nextElementSibling.textContent =
        "Please upload a valid image file (JPEG, PNG, GIF).";
      isValid = false;
    } else {
      imageInput.classList.remove("is-invalid");
      imageInput.nextElementSibling.textContent = "";
    }
  } else {
    imageInput.classList.add("is-invalid");
    imageInput.nextElementSibling.textContent =
      "Please select a profile image.";
    isValid = false;
  }

  // Validate user role
  let roleSelected = document.querySelector('input[name="userRole"]:checked');
  if (!roleSelected) {
    document.getElementById("userRoleError").textContent =
      "Please select a user role.";
    isValid = false;
  } else {
    document.getElementById("userRoleError").textContent = "";
  }

  return isValid;
}

document.getElementById("addUserForm").addEventListener("submit", function (e) {
  e.preventDefault();

  if (validateForm()) {
    let registerButton = document.getElementById("registerButton");
    let spinner = document.getElementById("spinner");
    let buttonText = document.getElementById("buttonText");

    registerButton.disabled = true;
    spinner.style.display = "inline-block";
    buttonText.textContent = "Creating...";

    if (!getToken) {
      alert("No authentication token found. Please log in.");
      return;
    }

    // Get values from form inputs
    let userName = document.getElementById("userName").value;
    let userEmail = document.getElementById("userEmail").value;
    let userPhone = document.getElementById("userPhone").value;
    let userLocation = document.getElementById("userLocation").value;
    let userPass = document.getElementById("userPass").value;
    let userConfirmPass = document.getElementById("userConfirmPass").value;
    let userRole = document.querySelector(
      'input[name="userRole"]:checked'
    ).value; // <-- Fix here
    let userImage = document.getElementById("userImage").files[0];

    // Append form data
    let formData = new FormData();
    formData.append("name", userName);
    formData.append("email", userEmail);
    formData.append("phone", userPhone);
    formData.append("google_map_url", userLocation);
    formData.append("password", userPass);
    formData.append("password_confirmation", userConfirmPass);
    formData.append("role_id", userRole);
    if (userImage) {
      formData.append("avatar", userImage);
    }

    fetch(`${baseUrl}/api/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${getToken}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        let addUserModal = bootstrap.Modal.getInstance(
          document.getElementById("addUserModal")
        );
        addUserModal.hide();
        document.getElementById("addUserForm").reset();
        setTimeout(() => {
          window.location.reload();
        }, 500);
      })
      .finally(() => {
        registerButton.disabled = false;
        spinner.style.display = "none";
        buttonText.textContent = "Create User";
      })
      .catch((error) => console.error("Error adding user:", error));
  }
});

// ========================= view Details User =======================

function viewDetails(userId) {
  fetch(`${baseUrl}/api/users/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${AdminToken}`,
    },
  })
    .then((response) => response.json())
    .then((userData) => {
      console.log("User Details:", userData);
      document.getElementById("de_image").src = userData.data.avatar;
      document.getElementById("de_id").textContent = userData.data.id;
      document.getElementById("de_name").textContent = userData.data.name;
      document.getElementById("de_email").textContent = userData.data.email;
      document.getElementById("de_phone").textContent = userData.data.phone;
      document.getElementById("de_role").textContent = userData.data.role;
      document.getElementById("de_location").textContent =
        userData.data.google_map_url;
      const roleName = userData.data.roles[0]
        ? userData.data.roles[0].name
        : "Unknown Role";
      document.getElementById("de_role").innerHTML = roleName;
    })
    .catch((error) => {
      console.error("Error fetching user details:", error);
    });
}

window.viewDetails = viewDetails;

// delete user ============================

function deleteUser(userId) {
  if (!confirm("Are you sure?")) {
    return;
  }

  fetch(`${baseUrl}/api/users/${userId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${AdminToken}`,
    },
  })
    .then((response) => {
      setTimeout(() => {
        window.location.reload();
      }, 500);
      return response.json();
    })
    .then((data) => {
      console.log("User deleted:", data);
      document.getElementById(`user-row-${userId}`).remove();
    })
    .catch((error) => {
      console.error("Error deleting user:", error);
    });
}

window.deleteUser = deleteUser;

// update user

// ========================= Get User Details for Update ========================
function getUserForUpdate(userId) {
  fetch(`${baseUrl}/api/users/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${AdminToken}`,
    },
  })
    .then((response) => response.json())
    .then((userData) => {
      console.log(userData.data);

      document.getElementById("editUserId").value = userData.data.id;
      document.getElementById("editUserName").value = userData.data.name;
      document.getElementById("editUserEmail").value = userData.data.email;
      document.getElementById("editUserPhone").value = userData.data.phone;
      document.getElementById("editUserLocation").value = userData.data.google_map_url;
      // encrypt the password
      document.getElementById("latitude").value = userData.data.latitude;
      document.getElementById("longitude").value = userData.data.longitude;

      console.log(userData.data.roles);
      const roleId = userData.data.roles[0]
        ? userData.data.roles[0].id
        : "Unknown Role";
      console.log(roleId);

      if (roleId == 1) {
        document.getElementById("editNormalUser").checked = true;
      } else if (roleId == 2) {
        document.getElementById("editAdminUser").checked = true;
      } else if (roleId == 3) {
        document.getElementById("editServiceProviderUser").checked = true;
      }
      document.getElementById("edit_profile").src =
        userData.data.avatar || "default_avatar.jpg";
    })
    .catch((error) =>
      console.error("Error fetching user data for update:", error)
    );
}

window.getUserForUpdate = getUserForUpdate;

// ========================Update code ========================

document.getElementById("updateForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let userId = document.getElementById("editUserId").value;

  let editName = document.getElementById("editUserName").value;
  let editEmail = document.getElementById("editUserEmail").value.trim();
  let editPhone = document.getElementById("editUserPhone").value.trim();
  let editLocation = document.getElementById("editUserLocation").value;
  let editPass = document.getElementById("editUserPass").value.trim();
  let editConfirm_pass = document.getElementById("editUserConfirmPass").value.trim();
  let latitude = document.getElementById("latitude").value;
  let longitude = document.getElementById("longitude").value;
  let editImage = document.getElementById("editUserImage").files[0];
  let editRole = document.querySelector(
    'input[name="editUserRole"]:checked'
  ).value;

  console.log(editConfirm_pass);
  console.log(editPass);

  let isPass = true;
  let formData = new FormData();
  if (editPass && editConfirm_pass) {
    if (editPass === editConfirm_pass) {
      formData.append("password", editPass);
      formData.append("password_confirmation", editConfirm_pass);
    } else {
      document.getElementById("err_pass").innerHTML = `<i class="bi bi-info-circle"></i> Passwords do not match!`;
      isPass = false;
    }
  } else if (editPass || editConfirm_pass) {
    document.getElementById("err_pass").innerHTML = `<i class="bi bi-info-circle"></i> Both password fields must be filled out!`;
    isPass = false;
  }

  if (editName) formData.append("name", editName);
  if (editEmail) formData.append("email", editEmail);
  if (editPhone) formData.append("phone", editPhone);
  if (editLocation) formData.append("google_map_url", editLocation);
  formData.append("latitude", latitude);
  formData.append("longitude", longitude);
  formData.append("role_id", editRole);
  if (editImage) {
    formData.append("avatar", editImage);
  }

  let isValid = true;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[0-9]{9,10}$/;

  if (!editName) {
    document.getElementById(
      "err_name"
    ).innerHTML = `<i class="bi bi-info-circle"></i> Phone number is required!`;
    isValid = false;
  } else {
    document.getElementById("err_name").style.display = "none";
  }
  if (!editPhone) {
    document.getElementById(
      "err_phone"
    ).innerHTML = `<i class="bi bi-info-circle"></i> Full name is required!`;
    isValid = false;
  } else {
    document.getElementById("err_phone").style.display = "none";
  }

  if (isValid) {
    let updateUserButton = document.getElementById("updateButton");
    let spinner = document.getElementById("spinner_Update");
    let buttonText = document.getElementById("buttonTex_update");
    updateUserButton.disabled = true;
    spinner.style.display = "inline-block";
    buttonText.textContent = "Updating...";

    fetch(`${baseUrl}/api/users/${userId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${AdminToken}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json.data);
        let updateUserModal = bootstrap.Modal.getInstance(
          document.getElementById("updateUser")
        );
        updateUserModal.hide();
        document.getElementById("updateForm").reset();
        setTimeout(() => {
          window.location.reload();
        }, 500);
      })
      .finally(() => {
        updateUserButton.disabled = false;
        spinner.style.display = "none";
        buttonText.textContent = "Update";
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  }
});

// ====================== User status ========================

function toggleUserStatus(button, userId, isDisabled) {
  const endpoint = isDisabled
    ? `${baseUrl}/api/users/enable/${userId}`
    : `${baseUrl}/api/users/disable/${userId}`;

  fetch(endpoint, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${AdminToken}`,
    },
  })
    .then((res) => res.json())
    .then((response) => {
      if (response.result) {
        const icon = button.querySelector(".btn_status_icon");
        icon.classList.toggle("bi-toggle-on");
        icon.classList.toggle("bi-toggle-off");
        icon.classList.toggle("text-primary");
        icon.classList.toggle("text-dark");

        // Update the data attribute for toggling
        button.setAttribute(
          "onclick",
          `toggleUserStatus(this, ${userId}, ${!isDisabled})`
        );
      } else {
        alert("Failed to toggle user status: " + response.message);
      }
    })
    .catch((error) => console.error("Error toggling user status:", error));
}

window.toggleUserStatus = toggleUserStatus;

// ==============================promote user ==========================

function promoteUser(roleId, userId) {
  fetch(`${baseUrl}/api/users/set-role/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${AdminToken}`,
    },
    body: JSON.stringify({ role_id: roleId }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.result && data.code === 1) {
        alert("User role updated successfully!");
      } else {
        alert("Failed to update role. Please try again.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    });
}

window.promoteUser = promoteUser;
