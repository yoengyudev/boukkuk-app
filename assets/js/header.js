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

logout.addEventListener("click", () => {
  let token = localStorage.getItem("token");
  fetch("......", {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((Data) => {
      console.log(Data.data);
    });
});
