// ============================ login ============================
const login = document.getElementById("login");

login.addEventListener("submit", (even) => {
    even.preventDefault();
    let formdata = new FormData();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
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
        });

        });

//============================================== end of login ========================

function togglePassword(inputId, iconId) {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = document.getElementById(iconId);
    
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.setAttribute("data-lucide", "eye-off");
    } else {
        passwordInput.type = "password";
        toggleIcon.setAttribute("data-lucide", "eye");
    }
}
