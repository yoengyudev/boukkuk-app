let g9_host = "https://mps10.chandalen.dev";
let isAuthenticated = false;
let token = localStorage.getItem("token");

if (token) {
    isAuthenticated = true;
    console.log(token);
}


console.log(isAuthenticated);


if(!isAuthenticated) {
    let logout_list = document.getElementById("logout-list");
    if(logout_list) {
        logout_list.style.display = "none";
    }
}


// ============================ login ============================
const login = document.getElementById("login");

if (login) {
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
}

//============================================== end of login ========================

// ============================ logout ============================

let logout = document.getElementById("logout-list");
console.log(logout);


if (logout) {
    logout.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.reload();
    });
}

// ============================ end of logout ============================