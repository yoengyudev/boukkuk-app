import { AdminToken } from "./tokens.js";
import { baseUrl } from "./baseUrl.js";

// Add this near the top of the file
window.previewImage = function (input) {
  const preview = document.getElementById("avatarPreview");
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(input.files[0]);
  }
};
fetch(`${baseUrl}/api/me`, {
  headers: {
    Accept: "application/json",
    Authorization: "Bearer " + AdminToken,
  },
})
  .then((res) => res.json())
  .then((data) => {
    const profileImage = document.getElementById("profileImage");
    profileImage.src = data.data.avatar || "";
  });
// Modal content definitions
export const modalContent = {
  information: {
    title: "Change Information",
    content: `
      <form id="informationForm">
        <div class="mb-3">
          <label for="profileName" class="form-label">Full Name</label>
          <input type="text" class="form-control" id="profileName" required>
        </div>
        <div class="mb-3">
          <label for="profileEmail" class="form-label">Email</label>
          <input type="email" class="form-control" id="profileEmail" required>
        </div>
        <div class="mb-3">
          <label for="profilePhone" class="form-label">Phone</label>
          <input type="tel" class="form-control" id="profilePhone" required>
        </div>
        <div class="d-flex gap-2">
          <div class="mb-3 w-50">
            <label for="profileLongitude" class="form-label">Longitude</label>
            <input type="number" class="form-control" id="profileLongitude" step="any" required>
          </div>
          <div class="mb-3 w-50">
            <label for="profileLatitude" class="form-label">Latitude</label>
            <input type="number" class="form-control" id="profileLatitude" step="any" required>
          </div>
        </div>
        <div class="mb-3">
          <label for="profileGoogleMap" class="form-label">Google Map URL</label>
          <input type="url" class="form-control" id="profileGoogleMap" placeholder="https://maps.google.com/...">
        </div>
        <div class="mb-3">
          <label for="profileAvatar" class="form-label">Profile Picture</label>
          <input type="file" class="form-control" id="profileAvatar" accept="image/*" onchange="previewImage(this)">
          <div class="mt-2">
            <img id="avatarPreview" src="" alt="Avatar Preview" style="max-width: 200px; max-height: 200px; display: none;" class="img-thumbnail">
          </div>
        </div>
        <div class="d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Changes</button>
        </div>
      </form>
    `,
  },
  password: {
    title: "Change Password",
    content: `
      <form id="passwordForm">
        <div class="mb-3">
          <label for="currentPassword" class="form-label">Current Password</label>
          <div class="position-relative">
            <input type="password" class="form-control" id="currentPassword" required>
            <i class="bi bi-eye position-absolute top-50 end-0 translate-middle-y pe-3" 
               style="cursor: pointer;" 
               onclick="togglePasswordVisibility('currentPassword', this)"></i>
          </div>
        </div>
        <div class="mb-3">
          <label for="newPassword" class="form-label">New Password</label>
          <div class="position-relative">
            <input type="password" class="form-control" id="newPassword" required>
            <i class="bi bi-eye position-absolute top-50 end-0 translate-middle-y pe-3" 
               style="cursor: pointer;" 
               onclick="togglePasswordVisibility('newPassword', this)"></i>
          </div>
        </div>
        <div class="mb-3">
          <label for="confirmPassword" class="form-label">Confirm New Password</label>
          <div class="position-relative">
            <input type="password" class="form-control" id="confirmPassword" required>
            <i class="bi bi-eye position-absolute top-50 end-0 translate-middle-y pe-3" 
               style="cursor: pointer;" 
               onclick="togglePasswordVisibility('confirmPassword', this)"></i>
          </div>
        </div>
        <div class="d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="submit" class="btn btn-primary">Change Password</button>
        </div>
      </form>
    `,
  },
};

// Modal content definitions for admin users
export const adminModalContent = {
  information: {
    title: "Change Information",
    content: `
      <form id="informationForm">
        <div class="mb-3">
          <label for="profileName" class="form-label">Full Name</label>
          <input type="text" class="form-control" id="profileName" required>
        </div>
        <div class="mb-3">
          <label for="profileEmail" class="form-label">Email</label>
          <input type="email" class="form-control" id="profileEmail" required>
        </div>
        <div class="mb-3">
          <label for="profilePhone" class="form-label">Phone</label>
          <input type="tel" class="form-control" id="profilePhone" required>
        </div>
        <div class="mb-3">
          <label for="profileAvatar" class="form-label">Profile Picture</label>
          <input type="file" class="form-control" id="profileAvatar" accept="image/*" onchange="previewImage(this)">
          <div class="mt-2">
            <img id="avatarPreview" src="" alt="Avatar Preview" style="max-width: 200px; max-height: 200px; display: none;" class="img-thumbnail">
          </div>
        </div>
        <div class="d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Changes</button>
        </div>
      </form>
    `,
  },
  password: modalContent.password, // Reuse the password modal content
};

// Password visibility toggle function
export function togglePasswordVisibility(inputId, icon) {
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
}

// Information form initialization and handling
export function initInformationForm() {
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
      document.getElementById("profileLongitude").value =
        data.data.longitude || "";
      document.getElementById("profileLatitude").value =
        data.data.latitude || "";
      document.getElementById("profileGoogleMap").value =
        data.data.google_map_url || "";

      // Show current avatar if exists
      const preview = document.getElementById("avatarPreview");
      if (data.data.avatar) {
        preview.src = data.data.avatar;
        preview.style.display = "block";
      }
    });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const profileData = {
      name: document.getElementById("profileName").value,
      email: document.getElementById("profileEmail").value,
      phone: document.getElementById("profilePhone").value,
      longitude: document.getElementById("profileLongitude").value,
      latitude: document.getElementById("profileLatitude").value,
      google_map_url: document.getElementById("profileGoogleMap").value,
    };

    // Update profile info
    fetch(`${baseUrl}/api/profile/info`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + AdminToken,
      },
      body: JSON.stringify(profileData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Profile update data:", data);

        if (data.data && data.data.phone && data.data.phone.includes("The phone has already been taken.")) {
          alert('លេខទូរស័ព្ទ​ត្រូវបានគេប្រើ​​ហើយ។');
        } else if (data.message) {
          alert(data.message); // Handle other general error messages
        }

        // Check if there's an avatar to update
        const avatarInput = document.getElementById("profileAvatar");
        if (avatarInput.files.length > 0) {
          const avatarFormData = new FormData();
          avatarFormData.append("avatar", avatarInput.files[0]);

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
        if (res) return res.json();
        return null;
      })
      .then((data) => {
        bootstrap.Modal.getInstance(
          document.getElementById("profileModal")
        ).hide();
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        alert("Failed to update profile. Please try again.");
      });
  });
}
// Modified initInformationForm for admin users
export function initAdminInformationForm() {
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

      // Show current avatar if exists
      const preview = document.getElementById("avatarPreview");
      if (data.data.avatar) {
        preview.src = data.data.avatar;
        preview.style.display = "block";
      }
    });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const profileData = {
      name: document.getElementById("profileName").value,
      email: document.getElementById("profileEmail").value,
      phone: document.getElementById("profilePhone").value,
    };

    // Update profile info
    fetch(`${baseUrl}/api/profile/info`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + AdminToken,
      },
      body: JSON.stringify(profileData),
    })
      .then((res) => res.json())
      .then((data) => {
        // Handle avatar upload if a new file was selected
        const avatarInput = document.getElementById("profileAvatar");
        if (avatarInput.files.length > 0) {
          const avatarFormData = new FormData();
          avatarFormData.append("avatar", avatarInput.files[0]);

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
        if (res) return res.json();
        return null;
      })
      .then((data) => {
        bootstrap.Modal.getInstance(
          document.getElementById("profileModal")
        ).hide();
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        alert("Failed to update profile. Please try again.");
      });
  });
}

// Password form initialization and handling
export function initPasswordForm() {
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
      old_pass: document.getElementById("currentPassword").value,
      new_pass: newPassword,
      new_pass_confirmation: confirmPassword,
    };

    fetch(`${baseUrl}/api/profile/change-pass`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + AdminToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        bootstrap.Modal.getInstance(
          document.getElementById("profileModal")
        ).hide();
        form.reset();
      })
      .catch((error) => {
        alert("Failed to change password. Please try again.");
      });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const profile = document.querySelector(".global-profile-menu");
  const menu = profile?.querySelector(".dropdown-menu");
  const profileModal = new bootstrap.Modal(
    document.getElementById("profileModal")
  );
  const AdminRole = localStorage.getItem("AdminRole");
  const isAdmin = AdminRole === "2";

  console.log("Profile element:", profile); 
  console.log("Menu element:", menu); 
  if (profile && menu) {
    // Toggle menu on profile click
    profile.addEventListener("click", function (e) {
      e.stopPropagation(); // Prevent event bubbling
      menu.classList.toggle("active");
      console.log("Profile clicked, menu toggled"); // Debug log
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (e) {
      if (!profile.contains(e.target)) {
        menu.classList.remove("active");
      }
    });

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

      const modalConfig = isAdmin ? adminModalContent : modalContent;

      modalTitle.textContent = modalConfig[type].title;
      modalBody.innerHTML = modalConfig[type].content;

      window.togglePasswordVisibility = togglePasswordVisibility;

      if (type === "information") {
        setTimeout(() => {
          isAdmin ? initAdminInformationForm() : initInformationForm();
        }, 0);
      } else {
        initPasswordForm();
      }

      profileModal.show();
      menu.classList.remove("active");
    });
  } else {
    console.warn("Profile menu elements not found"); // Debug log
  }
});
