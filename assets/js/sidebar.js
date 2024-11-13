let user_item = document.querySelector('.user-item');
let category_item = document.querySelector('.category-item');
let service_item = document.querySelector('.service-item');
let roleid = localStorage.getItem('UserRole');
let AdminToken = localStorage.getItem('AdminToken');
console.log(roleid);
console.log(AdminToken);

if (!AdminToken) {
    const currentPath = window.location.href;
    const basePath = currentPath.substring(0, currentPath.indexOf("/src/") + 1);
    location.href = `${basePath}src/views/auth/login.html`;
}

if (roleid == 3) {
    user_item.style.display = 'none';
    category_item.style.display = 'none';
} else if (roleid == 2) {
    service_item.style.display = 'none';
}
