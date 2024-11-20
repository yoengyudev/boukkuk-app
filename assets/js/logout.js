import { baseUrl } from "./baseUrl.js";
// ============================ logout ============================

let logout = document.getElementById("logout-list");
let logoutAdmin = document.getElementById("logout-admin");
console.log(logout);


if (logoutAdmin) {
    logoutAdmin.addEventListener('click', () => {
        localStorage.removeItem('AdminToken');
        localStorage.removeItem('ProviderID');
        fetch(`${baseUrl}/api/logout`, {
            method: 'DELETE', 
            headers: {
              'Accept': 'application/json'
            },
            body: null
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            isAuthenticated = false;
            window.location.reload();
        })
    });
}

if (logout) {
    logout.addEventListener('click', () => {
        localStorage.removeItem('UserToken');
        fetch(`${baseUrl}/api/logout`, {
            method: 'DELETE', 
            headers: {
              'Accept': 'application/json'
            },
            body: null
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            isAuthenticated = false;
            window.location.reload();
        })
    });
}

// ============================ end of logout ============================