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
    let updateAddress = document.getElementById("address").value;
    let updateButton = document.getElementById("updateButton");
    let spinner = document.getElementById("spinner");
    let buttonText = document.getElementById("buttonText");

    updateButton.disabled = true;
    spinner.style.display = "inline-block";
    buttonText.textContent = "កំពុងរក្សាទុក...";

    let token = localStorage.getItem("token");

    if (!token) {
      updateButton.disabled = false;
      spinner.style.display = "none";
      buttonText.textContent = "រក្សាទុកការផ្លាស់ប្តូរ";
      return;
    }

    let updatedData = {
      name: updateName,
      email: updateEmail,
      phone: updatePhone,
      address: updateAddress,
    };
    console.log(updatedData.address);
    fetch(`${g9_host}/api/profile/info`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(updatedData),
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(response.data);
        console.log(response.data.name);
        console.log(response.data.email);
        console.log(response.data.phone);
        console.log(response.data.address);
      })
      .finally(() => {
        updateButton.disabled = false;
        spinner.style.display = "none";
        buttonText.textContent = "រក្សាទុកការផ្លាស់ប្តូរ";
      });
  });

// ======================================ending =================================//
