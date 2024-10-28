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
