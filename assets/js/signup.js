// ==========================> hidden and Open eye in input box ======================
function togglePasswordVisibility() {
    const passwordInput = document.getElementById("pass");
    const toggleIcon = document.getElementById("toggleIcon4");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
    }
}
function togglePasswordVisibility1() {
    const passwordInput = document.getElementById("confirm_pass");
    const toggleIcon = document.getElementById("toggleIcon5");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
    }
}


// =======================================sing up script=============================

document.getElementById('registerForm').addEventListener('submit', function (event) {
    event.preventDefault();

    let registerButton = document.getElementById('registerButton');
    let spinner = document.getElementById('spinner');
    let buttonText = document.getElementById('buttonText');

    // Disable the button and show the spinner
    registerButton.disabled = true;
    spinner.style.display = 'inline-block';
    buttonText.textContent = 'កំពុងបញ្ចូល...';  // "Loading..." in Khmer

    let name = document.getElementById('name').value.trim();
    let email = document.getElementById('email').value.trim();
    let phone = document.getElementById('phone').value.trim();
    let pass = document.getElementById('pass').value.trim();
    let confirm_pass = document.getElementById('confirm_pass').value.trim();

    let formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('password', pass);
    formData.append('password_confirmation', confirm_pass);

    fetch('https://mps10.chandalen.dev/api/register', {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        },
        body: formData
    })
    .then(res => res.json())
    .then(json => {
        let token = json.data.token;
        localStorage.setItem('token', token);
        if (token) {
            location.href = '../../../index.html';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    })
    .finally(() => {
        // Re-enable the button and hide the spinner
        registerButton.disabled = false;
        spinner.style.display = 'none';
        buttonText.textContent = 'បង្កើតគណនី';  // "Create Account" in Khmer
    });
});
