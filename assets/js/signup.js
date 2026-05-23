const currentPath = window.location.href;
const basePath = currentPath.substring(0, currentPath.indexOf("/src/") + 1);

// ==========================> hidden and Open eye in input box ======================
function togglePasswordVisibility() {
    const passwordInput = document.getElementById("pass");
    const toggleIcon = document.getElementById("toggleIcon4");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
    }
}
function togglePasswordVisibility1() {
    const passwordInput = document.getElementById("confirm_pass");
    const toggleIcon = document.getElementById("toggleIcon5");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
    }
}


// =======================================sing up script=============================

// ==========================> hidden and Open eye in input box ======================
function togglePasswordVisibility() {
    const passwordInput = document.getElementById("pass");
    const toggleIcon = document.getElementById("toggleIcon4");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
    }
}
function togglePasswordVisibility1() {
    const passwordInput = document.getElementById("confirm_pass");
    const toggleIcon = document.getElementById("toggleIcon5");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
    }
}


// =======================================sing up script=============================

document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Clear previous errors
    document.querySelectorAll('.is-invalid').forEach(element => {
        removeError(element);
    });

    // Get form values
    let nameInput = document.getElementById('name');
    let emailInput = document.getElementById('email');
    let phoneInput = document.getElementById('phone');
    let passInput = document.getElementById('pass');
    let confirmPassInput = document.getElementById('confirm_pass');
    
    // Validate inputs (keeping the same validation logic as before)
    let isValid = true;
    
    if (nameInput.value.trim() === '') {
        showError(nameInput, 'សូមបញ្ចូលឈ្មោះរបស់អ្នក');
        isValid = false;
    }
    
    if (!validateEmail(emailInput.value.trim())) {
        showError(emailInput, 'សូមបញ្ចូលអ៊ីមែលឱ្យបានត្រឹមត្រូវ');
        isValid = false;
    }
    
    if (phoneInput.value.trim() === '') {
        showError(phoneInput, 'សូមបញ្ចូលលេខទូរស័ព្ទឱ្យបានត្រឹមត្រូវ');
        isValid = false;
    }
    
    if (passInput.value.length < 6) {
        showError(passInput, 'ពាក្យសម្ងាត់ត្រូវតែមានយ៉ាងតិច 6 តួអក្សរ');
        isValid = false;
    }
    
    if (passInput.value !== confirmPassInput.value) {
        showError(confirmPassInput, 'ពាក្យសម្ងាត់មិនត្រូវគ្នា');
        isValid = false;
    }
    
    if (!isValid) {
        return;
    }

    // Show loading state
    let registerButton = document.getElementById('registerButton');
    let spinner = document.getElementById('spinner');
    let buttonText = document.getElementById('buttonText');
    
    registerButton.disabled = true;
    spinner.style.display = 'inline-block';
    buttonText.textContent = 'កំពុងបញ្ចូល...';

    // Prepare the data as JSON
    const data = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        password: passInput.value,
        password_confirmation: confirmPassInput.value
    };

    // Send the request
    fetch('https://boukkuk-api.onrender.com/api/register', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => Promise.reject(err));
        }
        return response.json();
    })
    .then(json => {
        if (json.data && json.data.token) {
            localStorage.setItem('UserToken', json.data.token);
            location.href = `${basePath}src/views/auth/login.html`;
        } else {
            throw new Error('Token not found in response');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        
        // Handle validation errors from server
        if (error.errors) {
            Object.keys(error.errors).forEach(key => {
                const input = document.getElementById(key);
                if (input) {
                    showError(input, error.errors[key][0]);
                }
            });
        } else {
            // Show generic error message
            alert('មានបញ្ហាកើតឡើង សូមព្យាយាមម្តងទៀត');
        }
    })
    .finally(() => {
        // Reset button state
        registerButton.disabled = false;
        spinner.style.display = 'none';
        buttonText.textContent = 'បង្កើតគណនី';
    });
});

// Helper functions
function showError(element, message) {
    element.classList.add('is-invalid');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.innerText = message;
    // Remove any existing error message first
    const existingError = element.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }
    element.parentNode.appendChild(errorDiv);
}

function removeError(element) {
    element.classList.remove('is-invalid');
    const errorDiv = element.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
