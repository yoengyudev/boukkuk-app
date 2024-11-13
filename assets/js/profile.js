//=============================>> Get User Information Functions <<===============================//

let g9_host = "https://mps10.chandalen.dev";

function getData() {
  let token = localStorage.getItem("token");
  fetch(`${g9_host}/api/me`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => res.json())
    .then((json) => {
      console.log(json.data);
      document.getElementById("fullname").value = json.data.name;
      document.getElementById("email").value = json.data.email;
      document.getElementById("phone").value = json.data.phone;
      document.getElementById("userAvatar").src = json.data.avatar;
    });
}
getData();

// =====================change password========================

document.getElementById("changePasswordButton").addEventListener("click", function () {
  // Clear previous error messages
  clearErrorMessages();
  
  const oldPassword = document.getElementById("currentPassword").value.trim();
  const newPassword = document.getElementById("newPassword").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  
  let hasError = false;

  // Validate current password
  if (!oldPassword) {
    displayError("error-mess-cur", "Current password is required");
    hasError = true;
  }

  // Validate new password
  if (!newPassword) {
    displayError("error-mess-new", "New password is required");
    hasError = true;
  } else if (newPassword.length < 6) {
    displayError("error-mess-new", "New password must be at least 6 characters long");
    hasError = true;
  }

  // Validate confirm password
  if (!confirmPassword) {
    displayError("error-mess-com", "Confirm password is required");
    hasError = true;
  } else if (newPassword !== confirmPassword) {
    displayError("error-mess-com", "Passwords do not match");
    hasError = true;
  }

  if (hasError) {
    return;
  }

  // Show loading state
  const buttonText1 = document.getElementById("buttonText1");
  const spinner1 = document.getElementById("spinner1");
  buttonText1.style.display = "none";
  spinner1.style.display = "inline-block";

  let token = localStorage.getItem("token");
  
  fetch(`${g9_host}/api/profile/change-pass`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      old_pass: oldPassword,
      new_pass: newPassword,
      new_pass_confirmation: confirmPassword,
    }),
  })
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      
      buttonText1.style.display = "inline";
      spinner1.style.display = "none";

      if (json.message) {
        // Clear inputs
        document.getElementById("currentPassword").value = "";
        document.getElementById("newPassword").value = "";
        document.getElementById("confirmPassword").value = "";
        
        alert("Password changed successfully!");
        
      } else {
        // Handle API error messages
        if (json.message) {
          if (json.message.toLowerCase().includes("old password")) {
            displayError("error-mess-cur", json.message);
          } else {
            alert(json.message);
          }
        }
      }
    })
    .catch((error) => {
      buttonText1.style.display = "inline";
      spinner1.style.display = "none";
      console.error("Error:", error);
      alert("An error occurred while changing the password.");
    });
});

// Helper functions
function displayError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = message;
  errorElement.style.color = "red";
  errorElement.style.fontSize = "12px";
  errorElement.style.marginTop = "5px";
}

function clearErrorMessages() {
  const errorElements = [
    "error-mess-cur",
    "error-mess-new",
    "error-mess-com"
  ];
  errorElements.forEach(elementId => {
    document.getElementById(elementId).textContent = "";
  });
}


// Add some CSS to your stylesheet
// =====================end of change password=================

//===============================>> Update User Information Function <<================================//

document
  .getElementById("updateForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    let updateName = document.getElementById("fullname").value;
    let updateEmail = document.getElementById("email").value;
    let updatePhone = document.getElementById("phone").value;
    let saveButton = document.getElementById('update_info');
    let spinner = document.getElementById('spinner');
    let buttonText = document.getElementById('buttonText');

    saveButton.disabled = true;
    spinner.style.display = 'inline-block';
    buttonText.textContent = 'រក្សាទុកការផ្លាស់ប្តូរ...';

    let token = localStorage.getItem("token");

    if (!token) {
      alert("No token found. Please log in first.");
      return;
    }

    let updatedData = {
      name: updateName,
      email: updateEmail,
      phone: updatePhone,
    };

    fetch('https://mps10.chandalen.dev/api/profile/info', {
      method: "PUT",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        console.log(json.data);
      })
      .finally(() => {
        saveButton.disabled = false;
        spinner.style.display = 'none';
        buttonText.textContent = 'រក្សាទុកការផ្លាស់ប្តូរ';
      })
  });

// ======================================ending =================================//

// ============================ change avarta =========================

document.addEventListener('DOMContentLoaded', function () {
  const avatarUpload = document.getElementById('avatarUpload');
  const userAvatar = document.getElementById('userAvatar');
  const deleteImageBtn = document.getElementById('deleteImageBtn');
  const cropperModal = new bootstrap.Modal(document.getElementById('cropperModal'));
  const cropperImage = document.getElementById('cropperImage');
  const cropImageBtn = document.getElementById('cropImageBtn');
  let cropper;

  avatarUpload.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        cropperImage.src = event.target.result;
        cropperModal.show();

        if (cropper) {
          cropper.destroy();
        }

        cropper = new Cropper(cropperImage, {
          aspectRatio: 1,
          viewMode: 1,
          minCropBoxWidth: 400, // Larger crop box area
          minCropBoxHeight: 400,
          background: false, // Keep modal background clean
          autoCropArea: 0.8, // Automatically fill 80% of the crop area
        });
      };
      reader.readAsDataURL(file);
    }
  });

  cropImageBtn.addEventListener('click', function () {
    const croppedCanvas = cropper.getCroppedCanvas({
      width: 400, // Adjust output size if needed
      height: 400
    });

    croppedCanvas.toBlob(function (blob) {
      const formData = new FormData();
      formData.append('avatar', blob);

      const token = localStorage.getItem('token');
      fetch(`${g9_host}/api/profile/avatar`, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + token,
        },
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          const url = URL.createObjectURL(blob);
          userAvatar.src = url;
          cropperModal.hide();
        })
        .catch(error => {
          console.error('Error:', error);
        });
    });
  });

  deleteImageBtn.addEventListener('click', function () {
    userAvatar.src = 'assets/img/AboutUs-review3avif.avif'; // Reset to default image
    avatarUpload.value = ''; // Clear the file input
  });
});




let delete_Avatar = document.getElementById("deleteImageBtn");
delete_Avatar.addEventListener("click", function () {
  let token = localStorage.getItem("token");
  fetch(`${g9_host}/api/profile/avatar`, {
    method: "delete",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => res.json())
    .then((json) => {
      console.log(json.data);
    });
});


// ============================ end of change avarta =========================
