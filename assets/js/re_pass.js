lucide.createIcons();

function togglePassword(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);
  const isPassword = input.type === "password";

  input.type = isPassword ? "text" : "password";
  icon.setAttribute("data-lucide", isPassword ? "eye-off" : "eye");
  lucide.createIcons();
}

console.log(localStorage.getItem('getOtp'));
console.log(localStorage.getItem('otpEmail'));


document.getElementById("resetForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const pass1 = document.getElementById("Password1").value;
  const pass2 = document.getElementById("Password2").value;

  let saveButton = document.getElementById('forgetButton');
  let spinner = document.getElementById('forget_spinner');
  let buttonText = document.getElementById('buttonText_forget');

  saveButton.disabled = true;
  spinner.style.display = 'inline-block';
  buttonText.textContent = 'បញ្ជាក់...';

  fetch('https://mps10.chandalen.dev/api/reset/pass', {
    
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Accept': "application/json",
    },
    body: JSON.stringify({
      email: localStorage.getItem('otpEmail'),
      otp: localStorage.getItem('getOtp'),
      new_pass: pass1,
      new_pass_confirmation: pass2,
    }),
  })
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      if (json.pass1 === json.pass2){
        setTimeout(() => {
        location.href = 'login.html';
        }, 1000);
      }
      
    })
    .finally(() => {
      saveButton.disabled = false;
      spinner.style.display = 'none';
      buttonText.textContent = 'បញ្ជាក់';
    });
});