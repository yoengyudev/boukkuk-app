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
      alert("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      alert("New password must be at least 8 characters long.");
      return;
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match.");
      return;
    }
    const buttonText = document.getElementById("buttonText");
    const spinner = document.getElementById("spinner");
    buttonText.style.display = "none";
    spinner.style.display = "inline-block";

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
        buttonText.style.display = "inline";
        spinner.style.display = "none";

        if (json.success) {
          alert("Password changed successfully!");
        }
        // Clear the input fields
        document.getElementById("currentPassword").value = "";
        document.getElementById("newPassword").value = "";
        document.getElementById("confirmPassword").value = "";
      })
      .catch((error) => {
        buttonText.style.display = "inline";
        spinner.style.display = "none";
        console.error("Error:", error);
        alert("An error occurred while changing the password.");
      });
  });
// =====================end of change password=================
