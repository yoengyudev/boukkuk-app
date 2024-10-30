let g9_host = "https://mps10.chandalen.dev";
// ============================ logout ============================

let logout = document.getElementById("logout-list");
console.log(logout);


if (logout) {
    logout.addEventListener('click', () => {
        localStorage.removeItem('token');
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
            console.log("Hello revmoe");
            window.location.reload();
        })
    });
}

// ============================ end of logout ============================