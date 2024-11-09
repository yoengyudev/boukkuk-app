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



function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

const login = document.getElementById("login");
login.addEventListener("submit", (event) => {
    event.preventDefault();

    let isValid = true;
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    let err_emaillge = document.getElementById('err_emaillg');
    let err_passlg = document.getElementById('err_passlg');

    // Validate email
    if (!email) {
        err_emaillge.innerHTML = `<i class="bi bi-exclamation-circle"></i> សូមបញ្ចូលអុីម៉ែល!`;
        isValid = false;
    } else if (!validateEmail(email)) {
        err_emaillge.innerHTML = `<i class="bi bi-exclamation-circle"></i> អុីម៉ែលមិនត្រឹមត្រូវ!`;
        isValid = false;
    }else{
        err_emaillge.style.display = 'none';
    }

    if (!password) {
        err_passlg.innerHTML = `<i class="bi bi-exclamation-circle"></i> សូមបញ្ចូលពាក្យសម្ងាត់`;
        isValid = false;
    } else if (!validatePassword(password)) {
        err_passlg.innerHTML = `<i class="bi bi-exclamation-circle"></i> ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ`;
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    const saveButton = document.getElementById('saveButton');
    const spinner = document.getElementById('spinner');
    const buttonText = document.getElementById('buttonText');

    saveButton.disabled = true;
    spinner.style.display = 'inline-block';
    buttonText.textContent = 'ចូលប្រើប្រាស់គណនី...';

    const formdata = new FormData();
    formdata.append('email_or_phone', email);
    formdata.append('password', password);

    fetch(`${g9_host}/api/login`, {
        method: "POST",
        headers: {
            'Accept': 'application/json'
        },
        body: formdata,
    })
        .then(res => {
            if (!res.ok) {
            }
            return res.json();
        })
        .then(json => {
            if (json.data && json.data.token) {
                const token = json.data.token;
                localStorage.setItem('token', token);
                location.href = '../../../index.html';
            } else {
                if (!json.data.email) {
                    err_emaillge.innerHTML = `<i class="bi bi-exclamation-circle"></i> អុីម៉ែលមិនត្រឹមត្រូវ!`;
                }

                if (!json.data.password) {
                    err_passlg.innerHTML = `<i class="bi bi-exclamation-circle"></i> ពាក្យសម្ងាត់មិនត្រឹមត្រូវ`;
                }else{
                    err_passlg.style.display = 'none';
                }
                
            }
        })
        .catch(error => {
            err_passlg.innerHTML = `<i class="bi bi-exclamation-circle"></i> អុីម៉ែលឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ`;
            console.error('Error:', error);
        })
        .finally(() => {
            saveButton.disabled = false;
            spinner.style.display = 'none';
            buttonText.textContent = 'ចូលប្រើប្រាស់គណនី';
        });
});

