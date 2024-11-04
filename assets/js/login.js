//============================================== end of login ========================

function togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");
    const toggleIcon = document.getElementById("toggleIcon");

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



// ============================ login ============================
const login = document.getElementById("login");

login.addEventListener("submit", (even) => {
    even.preventDefault();
    let formdata = new FormData();
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let saveButton = document.getElementById('saveButton');
    let spinner = document.getElementById('spinner');
    let buttonText = document.getElementById('buttonText');

    saveButton.disabled = true;
    spinner.style.display = 'inline-block';
    buttonText.textContent = 'ចូលប្រើប្រាស់គណនី...';

    formdata.append('email_or_phone', email);
    formdata.append('password', password);

    fetch(`${g9_host}/api/login`, {
        method: "POST",
        body: formdata,
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(res => res.json())
        .then(json => {
            let token = json.data.token;
            localStorage.setItem('token', token);
            if (token) {
                location.href = '../../../index.html';
            }
        })
        .finally(() => {
            saveButton.disabled = false;
            spinner.style.display = 'none';
            buttonText.textContent = 'ចូលប្រើប្រាស់គណនី';
        });
});
