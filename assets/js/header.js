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

let wishlistCount = 0;
function updateWishlistCounter() {
  if (!getToken) return;

  fetch('https://mps10.chandalen.dev/api/profile/wishlists?page=1&per_page=100', {
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + getToken
    }
  })
    .then(response => response.json())
    .then(data => {
      wishlistCount = data.paginate.total;
      const counter = document.querySelector('.wishlist-counter');
      if (counter) {
        counter.classList.add('updated');
        counter.textContent = wishlistCount;
        counter.style.display = wishlistCount > 0 ? 'flex' : 'none';

        setTimeout(() => {
          counter.classList.remove('updated');
        }, 200);
      }
    })
    .catch(error => console.error('Error fetching wishlist count:', error));
}
updateWishlistCounter();