let user_item = document.querySelector('.user-item');
let category_item = document.querySelector('.category-item');
let service_item = document.querySelector('.service-item');
let roleid = localStorage.getItem('UserRole');
let tokenSidebar = localStorage.getItem('token');
console.log(roleid);
console.log(tokenSidebar);

if (!tokenSidebar) {
    location.href = `${window.location.origin}/src/views/auth/login.html`;
} else if (roleid == 1) {
    location.href = `${window.location.origin}/index.html`;
}

if (roleid == 3) {
    user_item.style.display = 'none';
    category_item.style.display = 'none';
} else if (roleid == 2) {
    service_item.style.display = 'none';
}
