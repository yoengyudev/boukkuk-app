// script navigation bar
document.addEventListener('DOMContentLoaded', function() {
    var dropdownToggle = document.getElementById('locationDropdown');
    var dropdownMenu = dropdownToggle.nextElementSibling;
    var overlay = document.getElementById('overlay');

    function toggleDropdown() {
        dropdownMenu.classList.toggle('show');
        overlay.classList.toggle('show');
    }

    dropdownToggle.addEventListener('click', function(e) {
        e.preventDefault();
        toggleDropdown();
    });

    document.addEventListener('click', function(e) {
        if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target) || overlay.contains(e.target)) {
            dropdownMenu.classList.remove('show');
            overlay.classList.remove('show');
        }
    });
});