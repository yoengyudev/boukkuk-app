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
document
  .getElementById("changePasswordButton")
  .addEventListener("click", function () {
    const oldPassword = document.getElementById("currentPassword").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document
      .getElementById("confirmPassword")
      .value.trim();

    // Check if all password fields are filled
    if (!oldPassword || !newPassword || !confirmPassword) {
      showAlert("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      showAlert("New password must be at least 8 characters long.");
      return;
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      showAlert("New password and confirmation do not match.");
      return;
    }
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
        // Hide spinner and show button text again
        buttonText1.style.display = "inline";
        spinner1.style.display = "none";

        if (json.success) {
          showAlert("Password changed successfully!");
        }
        // Clear the input fields
        document.getElementById("currentPassword").value = "";
        document.getElementById("newPassword").value = "";
        document.getElementById("confirmPassword").value = "";
      })
      .catch((error) => {
        buttonText1.style.display = "inline";
        spinner1.style.display = "none";
        console.error("Error:", error);
        showAlert("An error occurred while changing the password.");
      });
  });
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
