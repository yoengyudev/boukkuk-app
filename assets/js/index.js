function wishlist() {
  let items_whishlist = getToken
    ? (location.href = "src/views/page/wishlist.html")
    : (location.href = "src/views/auth/login.html");
}

let isclick = false;

function wishlistCard() {
  let heart = document.querySelector(".heart");
  if (getToken){
    if(isclick){
      heart.innerHTML = `<i class="bi bi-suit-heart-fill"></i>`;
    }else{
      heart.innerHTML = `<i class="bi bi-heart"></i>`;
    }
    isclick =!isclick;
  } else {
    location.href = "src/views/auth/login.html";
  }
}

