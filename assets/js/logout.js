import { baseUrl } from "./baseUrl.js";
// ============================ logout ============================
const currentPath = window.location.href;
const basePath = currentPath.substring(0, currentPath.indexOf("/src/") + 1);

let logout = document.getElementById("logout-list");
let logoutAdmin = document.getElementById("logout-admin");


if (logoutAdmin) {
    logoutAdmin.addEventListener('click', () => {
        localStorage.removeItem('AdminToken');
        localStorage.removeItem('ProviderID');
        localStorage.removeItem('AdminRole');
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
            window.location.reload();
        })
    });
}

if (logout) {
    logout.addEventListener('click', () => {
        localStorage.removeItem('UserToken');
        sessionStorage.removeItem('creator_id');
        localStorage.removeItem('UserRole');
        localStorage.removeItem('UserName');
        fetch(`${baseUrl}/api/logout`, {
            method: 'DELETE', 
            headers: {
              'Accept': 'application/json'
            },
            body: null
        })
        .then(res => res.json())
        .then(data => {
            console.log("Hello world ", data);
            location.href = `${basePath}index.html`;
        })
    });
}

// ============================ end of logout ============================