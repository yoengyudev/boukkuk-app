
// header

window.addEventListener("scroll", function() {
    const header = document.querySelector("header");
    if (window.scrollY > 50) { // Adjust scroll distance as needed
        header.classList.add("fixed-header");
    } else {
        header.classList.remove("fixed-header");
    }
});

function profileMe(){
    let order_history = getToken? location.href='profile.html' : location.href='resource/views/auth/login.html';
}