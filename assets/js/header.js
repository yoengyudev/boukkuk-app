const getToken = localStorage.getItem("token");

let signup = document.getElementById("signup-list");
let login = document.getElementById("login-list");
let logout_pro = document.getElementById("logout-list");
let proSetting = document.getElementById("pro-setting");


console.log(getToken);

if (getToken) {
  signup.style.display = "none";
  login.style.display = "none";
  proSetting.style.display = "block";
  logout_pro.style.display = "block";
} else {
  signup.style.display = "block";
  login.style.display = "block";
  proSetting.style.display = "none";
  logout_pro.style.display = "none";
}

