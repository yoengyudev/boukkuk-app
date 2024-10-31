// ======================>> get emails <<========================
document.getElementById('getEmail').textContent = localStorage.getItem('otpEmail') || 'name@gmail.com';

//=======================>> Input box <<=========================
const otpInputs = document.querySelectorAll('.otp-input');
otpInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        if (e.target.value.length === 1 && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && index > 0 && e.target.value === '') {
            otpInputs[index - 1].focus();
        }
    });
});

//======================>> Resend OTP functionality <<=====================
const otpMessageBox = document.getElementById('otpMessageBox');
const resendOtpButton = document.getElementById('resendOtpButton');
const spinner_resend = document.getElementById('spinner_resend');
const buttonText1 = document.getElementById('buttonText1');

resendOtpButton.addEventListener('click', async () => {
    otpMessageBox.style.display = 'none';
    resendOtpButton.disabled = true;
    spinner_resend.style.display = 'inline-block';
    buttonText1.textContent = 'ផ្ញើកូដម្ដងទៀត...';

    try {
        const response = await fetch('https://mps10.chandalen.dev/api/forgot/pass', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: localStorage.getItem('otpEmail') })
        });

        if (response.ok) {
            otpMessageBox.style.display = 'block';
            otpMessageBox.style.color = 'green';
            otpMessageBox.textContent = 'OTP បានផ្ញើដំណើរការឡើងវិញ! សូមពិនិត្យមើលអ៊ីមែលរបស់អ្នក។';
        } else {
            otpMessageBox.style.display = 'block';
            otpMessageBox.style.color = 'red';
            otpMessageBox.innerHTML = `<i class="bi bi-exclamation-circle"></i> មិនអាចផ្ញើ OTP ដំណើរការឡើងវិញទេ`;
        }
    } catch (error) {
        otpMessageBox.style.display = 'block';
        otpMessageBox.style.color = 'red';
        otpMessageBox.textContent = 'កំហុសក្នុងការផ្ញើ OTP ដំណើរការឡើងវិញ';
    } finally {
        resendOtpButton.disabled = false;
        spinner_resend.style.display = 'none';
        buttonText1.textContent = 'ផ្ញើកូដម្ដងទៀត';
    }
});



//======================>> OTP verification functionality <<========================

document.getElementById('otpForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    let saveButton = document.getElementById('otpVerifi');
    let spinner = document.getElementById('spinner');
    let buttonText = document.getElementById('buttonText');
    otpMessageBox.style.display = 'none';

    saveButton.disabled = true;
    spinner.style.display = 'inline-block';
    buttonText.textContent = 'កំណត់ពាក្យសម្ងាត់...';

    const otpValue = Array.from(otpInputs).map(input => input.value).join('');
    try {
        const response = await fetch('https://mps10.chandalen.dev/api/forgot/verify-otp', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ otp: otpValue, email: localStorage.getItem('otpEmail') })
        })
            .finally(() => {
                saveButton.disabled = false;
                spinner.style.display = 'none';
                buttonText.textContent = 'កំណត់ពាក្យសម្ងាត់';
            });

        if (response.ok) {
            otpMessageBox.style.display = 'block';
            otpMessageBox.style.color = 'green';
            otpMessageBox.textContent = 'OTP ត្រឹមត្រូវ! កំពុងបន្ត...';
            setTimeout(() => {
                location.href = 're-password.html';
            }, 1000);
        } else {
            otpMessageBox.style.display = 'block';
            otpMessageBox.style.color = 'red';
            otpMessageBox.innerHTML = `<i class="bi bi-exclamation-circle"></i> កូដ OTP មិនត្រឹមត្រូវទេ`;
        }
    } catch (error) {
        otpMessageBox.style.display = 'block';
        otpMessageBox.style.color = 'red';
        otpMessageBox.textContent = 'កំហុសក្នុងការផ្ទៀងផ្ទាត់';
    }
});