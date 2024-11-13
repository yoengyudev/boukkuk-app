let g9_host = "https://mps10.chandalen.dev";
// ============================ logout ============================

let logout = document.getElementById("logout-list");
let logoutAdmin = document.getElementById("logout-admin");
console.log(logout);


if (logoutAdmin) {
    logoutAdmin.addEventListener('click', () => {
        localStorage.removeItem('AdminToken');
        fetch(`${g9_host}/api/logout`, {
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