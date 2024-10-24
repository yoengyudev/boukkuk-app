let g9_host = "https://mps10.chandalen.dev";
let isAuthenticated = false;
let token = localStorage.getItem("token");

if (token) {
    isAuthenticated = true;
    console.log(token);
}


console.log(isAuthenticated);


if(!isAuthenticated) {
    document.getElementById("logout-list").style.display = "none";
}



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