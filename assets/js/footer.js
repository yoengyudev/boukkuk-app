import { UserToken } from "./tokens.js";
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
    let order_history = UserToken? location.href='profile.html' : location.href='../../../src/views/auth/login.html';
}
window.profileMe = profileMe;

 function profile_Me(){    
    let order_history = UserToken? location.href='../../../src/views/page/profile.html' : location.href='src/views/auth/login.html';
}
window.profile_Me = profile_Me;