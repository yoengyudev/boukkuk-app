// header

const getToken = localStorage.getItem("token");

let signup = document.getElementById("signup-list");
let login = document.getElementById("login-list");
let logout = document.getElementById("logout-list");
let proSetting = document.getElementById("pro-setting");
console.log(getToken);

if (getToken) {
  signup.style.display = "none";
  login.style.display = "none";
  proSetting.style.display = "block";
  logout.style.display = "block";
} else {
  signup.style.display = "block";
  login.style.display = "block";
  proSetting.style.display = "none";
  logout.style.display = "none";
}

function wishlist() {
  let items_whishlist = getToken
    ? (location.href = "wishlist.html")
    : (location.href = "resource/views/auth/login.html");
}

function wishlistCard() {
  let heart = document.querySelector(".heart");
  if (getToken) {
    heart.innerHTML = `<i class="bi bi-suit-heart-fill"></i>`;
  } else {
    location.href = "resource/views/auth/login.html";
  }
}
