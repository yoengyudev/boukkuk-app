import { baseUrl } from "./baseUrl.js";

const messageBox = document.getElementById('messageBox');
messageBox.style.display = 'none';

document.getElementById('emailForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    let email = document.getElementById('email').value;
    let saveButton = document.getElementById('saveButton');
    let spinner = document.getElementById('spinner');
    let buttonText = document.getElementById('buttonText');

    saveButton.disabled = true;
    spinner.style.display = 'inline-block';
    buttonText.textContent = 'កំណត់ពាក្យសម្ងាត់...';

    try {
        const response = await fetch(`${baseUrl}/api/forgot/pass`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        })
        .finally(() => {
            saveButton.disabled = false;
            spinner.style.display = 'none';
            buttonText.textContent = 'កំណត់ពាក្យសម្ងាត់';
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('otpEmail', email)
            messageBox.textContent = 'OTP កូដត្រូវបានផ្ញើទៅកាន់ Email របស់អ្នក';
            location.href = 'otp.html';
        } else {
            messageBox.style.display = 'block';
            messageBox.style.color = 'red';
            messageBox.innerHTML = `<i class="bi bi-exclamation-circle"></i> ពិនិត្យអុីម៉ែលរបស់អ្នក`;
        }
    } catch (error) {
        messageBox.textContent = 'OTP Error';
    }
});