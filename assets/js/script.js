let g9_host = "https://mps10.chandalen.dev";
let isAuthenticated = false;
let token = localStorage.getItem("token");

if (token) {
    isAuthenticated = true;
    console.log(token);
}


console.log(isAuthenticated);





