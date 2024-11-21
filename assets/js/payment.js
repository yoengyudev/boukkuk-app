import { baseUrl } from "./baseUrl.js";
import { UserToken } from "./tokens.js";
let UserName = localStorage.getItem("UserName");
console.log('Username is ', UserName);

document
  .getElementById("receiptUpload")
  .addEventListener("change", function () {
    const fileInput = document.getElementById("receiptUpload");
    const uploadStatus = document.getElementById("uploadStatus");
    const successIcon = document.getElementById("successIcon");

    if (fileInput.files.length > 0) {
      uploadStatus.style.display = "block";
      successIcon.style.display = "none";

      // Simulate a file upload process
      setTimeout(() => {
        uploadStatus.style.display = "none";
        successIcon.style.display = "flex";
      }, 2000);
    }
  });




// Add this new function to fetch and display cart data
async function fetchAndDisplayCartData() {
  if (!UserToken) {
    const currentPath = window.location.href;
    const basePath = currentPath.substring(0, currentPath.indexOf("/src/") + 1);
    location.href = `${basePath}src/views/auth/login.html`;
    return;
  }

  try {
    const response = await fetch(`${baseUrl}/api/profile/carts`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${UserToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch cart data");
    }

    const cartData = await response.json();
    let total = cartData.data.total;

    document.getElementById('total-checkout').innerText = total.toLocaleString() + "៛";


    console.log("Cart data:", cartData);

    // ==================================
    const totalAmount = document.getElementById("totalAmount");
    totalAmount.textContent = cartData.data.total.toLocaleString() + "៛";
    const serviceList = document.getElementById("serviceList");
    let firstCreatorName = cartData.data.items[0]?.service?.creator?.name || '';
    document.getElementById('seller').value = firstCreatorName;
    console.log(document.getElementById('seller').value);
    


    serviceList.innerHTML = cartData.data.items
      .map(
        (item) => `
      <div class="col-12 col-md-6 mb-3">
        <div class="clothes-card">
          <img src="${item.service.image}" 
               alt="${item.service.name}" 
               style="width: 40px; height: auto;">
          <div class="service-info ps-3">
            <div class="service-name">${item.service.name}</div>
            <div class="service-type">${item.service.category.name}</div>
           
          </div>
          <div class="service-quantity ps-4">
         <div class="service-price">${item.price.toLocaleString()}៛</div>
              <div class="service-quantity-text ">ចំនួន: <strong>${item.qty
          }</strong></div>
          </div>
        </div>
      </div>
    `
      )
      .join("");
  } catch (error) {
    console.error("Error fetching cart data:", error);
    alert("មានបញ្ហាក្នុងការទាញយកទិន្នន័យកន្ត្រក");
  }
}


// Call the function when the page loads
document.addEventListener("DOMContentLoaded", fetchAndDisplayCartData);

document
  .getElementById("confirmPayment")
  .addEventListener("click", async function () {
    if (!UserToken) {
      window.location.href = "login.html";
      return;
    }

    this.disabled = true;
    this.innerHTML =
      '<span class="spinner-border spinner-border-sm me-2"></span> កំពុងដំណើរការ...';

    const receiptFile = document.getElementById("receiptUpload").files[0];

    if (!receiptFile) {
      alert("សូមបញ្ចូលបង្កាន់ដៃការទូទាត់។");
      this.disabled = false;
      this.innerHTML =
        '<i class="fas fa-check-circle me-2"></i> បញ្ជាក់ការទូទាត់';
      return;
    }

    const MAX_FILE_SIZE = 2 * 1024 * 1024;
    if (receiptFile.size > MAX_FILE_SIZE) {
      alert("សូមជ្រើសរើសឯកសារដែលតិចជាង 2MB។");
      this.disabled = false;
      this.innerHTML =
        '<i class="fas fa-check-circle me-2"></i> បញ្ជាក់ការទូទាត់';
      return;
    }

    if (!["image/png", "image/jpeg", "image/jpg"].includes(receiptFile.type)) {
      alert("សូមជ្រើសរើសឯកសារប្រភេទ PNG ឬ JPEG។");
      this.disabled = false;
      this.innerHTML =
        '<i class="fas fa-check-circle me-2"></i> បញ្ជាក់ការទូទាត់';
      return;
    }

    const formData = new FormData();
    formData.append("transaction_file", receiptFile);

    try {
      const response = await fetch(`${baseUrl}/api/carts/checkout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${UserToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        alert(`បញ្ហា៖ ${errorData.message || "មិនអាចដំណើរការបានទេ"}`);
        this.disabled = false;
        this.innerHTML =
          '<i class="fas fa-check-circle me-2"></i> បញ្ជាក់ការទូទាត់';
        return;
      }

      // Get current date and time from the user's local computer
      const now = new Date();
      const currentDate = now.toLocaleDateString("km-KH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const currentTime = now.toLocaleTimeString("km-KH", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      let seller = document.getElementById("seller").value;
      
    
      const summaryData = {
        serviceProvider: seller,
        customerName: UserName,
      };

      // Update modal content with summary data
      const summaryDetails = document.getElementById("summaryDetails");
      summaryDetails.innerHTML = `
        <ul class="list-unstyled">
          <li class="d-flex justify-content-between mb-2">
            <span>ឈ្មោះអ្នកលក់</span>
            <span class="text-black fw-medium">${summaryData.serviceProvider}</span>
          </li>
          <li class="d-flex justify-content-between mb-2">
            <span>កាលបរិច្ឆេទ</span>
            <span class="text-black fw-medium">${currentDate}</span>
          </li>
          <li class="d-flex justify-content-between mb-2">
            <span>ម៉ោង</span>
            <span class="text-black fw-medium">${currentTime}</span>
          </li>
          <li class="d-flex justify-content-between mb-2">
            <span>អ្នកទិញ</span>
            <span class="text-black fw-medium">${summaryData.customerName}</span>
          </li>
        </ul>
      `;

      // Show success modal
      const successModal = new bootstrap.Modal(
        document.getElementById("successModal")
      );
      successModal.show();

      this.disabled = false;
      this.innerHTML =
        '<i class="fas fa-check-circle me-2"></i> បញ្ជាក់ការទូទាត់';
    } catch (error) {
      console.error("Payment error:", error);
      alert("មានបញ្ហាក្នុងការទូទាត់");
      this.disabled = false;
      this.innerHTML =
        '<i class="fas fa-check-circle me-2"></i> បញ្ជាក់ការទូទាត់';
    }
  });


document.getElementById("downloadBtn").addEventListener("click", async function () {
  const modalContent = document.querySelector(".success-modal .modal-content");

  try {
    // Use html2canvas to capture the modal as an image
    const canvas = await html2canvas(modalContent);
    const imgData = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = imgData;
    link.download = "payment-summary.png";
    link.click();

    setTimeout(() => {
      window.location.href = "../../../index.html";
    }, 500);
  } catch (error) {
    console.error("Error generating PNG:", error);
    alert("មានបញ្ហាក្នុងការទាញយករូបភាព");
  }
});

