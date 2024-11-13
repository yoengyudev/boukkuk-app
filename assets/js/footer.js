
// header

window.addEventListener("scroll", function() {
    const header = document.querySelector("header");
    if (window.scrollY > 50) {
        header.classList.add("fixed-header");
    } else {
        header.classList.remove("fixed-header");
    }
});

function profileMe(){
    let order_history = UserToken? location.href='profile.html' : location.href='resource/views/auth/login.html';
}