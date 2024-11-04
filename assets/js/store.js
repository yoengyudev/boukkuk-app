
document.addEventListener('DOMContentLoaded', function () {
    const serviceCards = document.querySelectorAll('.service-card');
    const continueBtn = document.getElementById('continueBtn');
    let selectedServices = new Set();

    serviceCards.forEach(card => {
        card.addEventListener('click', function () {
            const service = this.dataset.service;

            if (this.classList.contains('selected')) {
                this.classList.remove('selected');
                selectedServices.delete(service);
            } else {
                this.classList.add('selected');
                selectedServices.add(service);
            }

            // Enable/disable continue button based on selections
            if (selectedServices.size > 0) {
                continueBtn.classList.add('enabled');
                continueBtn.disabled = false;
            } else {
                continueBtn.classList.remove('enabled');
                continueBtn.disabled = true;
            }
        });
    });

    continueBtn.addEventListener('click', function () {
        if (selectedServices.size > 0) {
            // Handle the continue action here
            console.log('Selected services:', Array.from(selectedServices));
            location.href = 'cart.html'; 
            // You can redirect to the next page or handle the selection as needed
        }
    });
});


// like and unlike rating store page

let isclick = true;
function toggleLike() {
    const likeButton = document.querySelector('.like');
    
    if (isclick) {
        likeButton.innerHTML = '<i class="bi bi-hand-thumbs-up-fill fs-18"></i>';
    } else {
        likeButton.innerHTML = '<i class="bi bi-hand-thumbs-up fs-18"></i>';
    }
    isclick = !isclick;
}

function toggleUnLike() {
    const likeButton = document.querySelector('.unlike');

    if (isclick) {
        likeButton.innerHTML = '<i class="bi bi-hand-thumbs-down-fill fs-18"></i>';
    } else {
        likeButton.innerHTML = '<i class="bi bi-hand-thumbs-down fs-18"></i>';
    }
    isclick = !isclick;
}