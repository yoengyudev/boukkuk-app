import { baseUrl } from "./baseUrl.js";
import { UserToken } from "./tokens.js";
//=============================>> Get User Information Functions <<===============================//

function getData() {
  fetch(`${baseUrl}/api/me`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + UserToken,
    },
  })
    .then((res) => res.json())
    .then((json) => {
      console.log(json.data);
      document.getElementById("fullname").value = json.data.name;
      document.getElementById("email").value = json.data.email;
      document.getElementById("phone").value = json.data.phone;
      document.getElementById("userAvatar").src = json.data.avatar;
    });
}
getData();

// =====================change password========================

document
  .getElementById("changePasswordButton")
  .addEventListener("click", function () {
    // Clear previous error messages
    clearErrorMessages();

    const oldPassword = document.getElementById("currentPassword").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document
      .getElementById("confirmPassword")
      .value.trim();

    let hasError = false;

    // Validate current password
    if (!oldPassword) {
      displayError("error-mess-cur", "Current password is required");
      hasError = true;
    }

    // Validate new password
    if (!newPassword) {
      displayError("error-mess-new", "New password is required");
      hasError = true;
    } else if (newPassword.length < 6) {
      displayError(
        "error-mess-new",
        "New password must be at least 6 characters long"
      );
      hasError = true;
    }

    // Validate confirm password
    if (!confirmPassword) {
      displayError("error-mess-com", "Confirm password is required");
      hasError = true;
    } else if (newPassword !== confirmPassword) {
      displayError("error-mess-com", "Passwords do not match");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // Show loading state
    const buttonText1 = document.getElementById("buttonText1");
    const spinner1 = document.getElementById("spinner1");
    buttonText1.style.display = "none";
    spinner1.style.display = "inline-block";

    fetch(`${baseUrl}/api/profile/change-pass`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + UserToken,
      },
      body: JSON.stringify({
        old_pass: oldPassword,
        new_pass: newPassword,
        new_pass_confirmation: confirmPassword,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);

        buttonText1.style.display = "inline";
        spinner1.style.display = "none";

        if (json.message) {
          // Clear inputs
          document.getElementById("currentPassword").value = "";
          document.getElementById("newPassword").value = "";
          document.getElementById("confirmPassword").value = "";

          alert("Password changed successfully!");
        } else {
          // Handle API error messages
          if (json.message) {
            if (json.message.toLowerCase().includes("old password")) {
              displayError("error-mess-cur", json.message);
            } else {
              alert(json.message);
            }
          }
        }
      })
      .catch((error) => {
        buttonText1.style.display = "inline";
        spinner1.style.display = "none";
        console.error("Error:", error);
        alert("An error occurred while changing the password.");
      });
  });

// Helper functions
function displayError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = message;
  errorElement.style.color = "red";
  errorElement.style.fontSize = "12px";
  errorElement.style.marginTop = "5px";
}

function clearErrorMessages() {
  const errorElements = ["error-mess-cur", "error-mess-new", "error-mess-com"];
  errorElements.forEach((elementId) => {
    document.getElementById(elementId).textContent = "";
  });
}

// =====================end of change password=================

//===============================>> Update User Information Function <<================================//

document
  .getElementById("updateForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    let updateName = document.getElementById("fullname").value;
    let updateEmail = document.getElementById("email").value;
    let updatePhone = document.getElementById("phone").value;
    let saveButton = document.getElementById("update_info");
    let spinner = document.getElementById("spinner");
    let buttonText = document.getElementById("buttonText");

    saveButton.disabled = true;
    spinner.style.display = "inline-block";
    buttonText.textContent = "រក្សាទុកការផ្លាស់ប្តូរ...";


    if (!UserToken) {
      alert("No token found. Please log in first.");
      return;
    }

    let updatedData = {
      name: updateName,
      email: updateEmail,
      phone: updatePhone,
    };

    fetch(`${baseUrl}/api/profile/info`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${UserToken}`,
      },
      body: JSON.stringify(updatedData),
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        console.log(json.data);
      })
      .finally(() => {
        saveButton.disabled = false;
        spinner.style.display = "none";
        buttonText.textContent = "រក្សាទុកការផ្លាស់ប្តូរ";
      });
  });

// ======================================ending =================================//

// ============================ change avarta =========================

document.addEventListener("DOMContentLoaded", function () {
  const avatarUpload = document.getElementById("avatarUpload");
  const userAvatar = document.getElementById("userAvatar");
  const deleteImageBtn = document.getElementById("deleteImageBtn");
  const cropperModal = new bootstrap.Modal(
    document.getElementById("cropperModal")
  );
  const cropperImage = document.getElementById("cropperImage");
  const cropImageBtn = document.getElementById("cropImageBtn");
  let cropper;

  avatarUpload.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        cropperImage.src = event.target.result;
        cropperModal.show();

        if (cropper) {
          cropper.destroy();
        }

        cropper = new Cropper(cropperImage, {
          aspectRatio: 1,
          viewMode: 1,
          minCropBoxWidth: 400, // Larger crop box area
          minCropBoxHeight: 400,
          background: false, // Keep modal background clean
          autoCropArea: 0.8, // Automatically fill 80% of the crop area
        });
      };
      reader.readAsDataURL(file);
    }
  });

  cropImageBtn.addEventListener("click", function () {
    const croppedCanvas = cropper.getCroppedCanvas({
      width: 400, // Adjust output size if needed
      height: 400,
    });

    croppedCanvas.toBlob(function (blob) {
      const formData = new FormData();
      formData.append("avatar", blob);

      fetch(`${baseUrl}/api/profile/avatar`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + UserToken,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          const url = URL.createObjectURL(blob);
          userAvatar.src = url;
          cropperModal.hide();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  });

  deleteImageBtn.addEventListener("click", function () {
    userAvatar.src = "assets/img/AboutUs-review3avif.avif"; // Reset to default image
    avatarUpload.value = ""; // Clear the file input
  });
});

let delete_Avatar = document.getElementById("deleteImageBtn");
delete_Avatar.addEventListener("click", function () {
  fetch(`${baseUrl}/api/profile/avatar`, {
    method: "delete",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + UserToken,
    },
  })
    .then((res) => res.json())
    .then((json) => {
      console.log(json.data);
    });
});

const apiUrl = `${baseUrl}/api/profile/purchased?page=1&per_page=20&payment_status=`;
const fetchOrders = async (status = "all") => {
  try {
    const response = await fetch(apiUrl + status);
    const data = await response.json();
    populateOrders(data.orders); // Assuming 'orders' is the key for the list of orders
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

//my purchased
function fetchPurchased(status = "all") {

  // Properly destroy existing DataTable
  let table = $("#purchasedTable").DataTable();
  if (table) {
    table.clear().destroy();
    // Also remove any lingering datatable classes/attributes
    $("#purchasedTable").removeClass("dataTable").find("tbody").empty();
  }

  fetch(`${baseUrl}/api/profile/purchased?page=1&per_page=20`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${UserToken}`,
    },
  })
    .then((res) => res.json())
    .then((json) => {
      const tableBody = document.getElementById("body_table");
      let tr = "";

      // Filter data based on status
      const filteredData = json.data.filter((order) => {
        if (status === "all") return true;
        // Make sure to convert both to same type for comparison
        return order.payment_status === parseInt(status);
      });

      console.log("Filtered Data:", filteredData); // Debug log
      filteredData.forEach((e) => {
        let statusText;
        let statusClass;

        switch (parseInt(e.payment_status)) {
          case 1:
            statusText = "Pending";
            statusClass = "text-warning";
            break;
          case 2:
            statusText = "Approved";
            statusClass = "text-success";
            break;
          case 3:
            statusText = "Rejected";
            statusClass = "text-danger";
            break;
          default:
            statusText = "Unknown";
            statusClass = "text-secondary";
        }

        tr += `
          <tr>
            <td class="text-start">
              <div class="d-flex align-items-center gap-3">
                <div class="service_img rounded overflow-hidden" style="width: 55px; height: 55px;"> 
                  <img src="${e.service.image
          }" class="w-100 h-100 object-fit-cover" alt="Service">
                </div>
                <div class="d-flex flex-column">
                  <span class="fw-medium text-start">${e.service?.name || "N/A"
          }</span>
                  <span class="text-muted small">Qty: ${e.qty || 0}</span>
                </div>
              </div>
            </td>
            <td class="text-start align-middle">
              <span class="${statusClass} fw-medium">
                ${statusText}
              </span>
            </td>
            <td class="text-start align-middle">
              ${e.service.price || "0.00"}៛
            </td>
            <td class="text-center align-middle">
              <button type="button" 
                class="btn btn-primary btn-sm px-3 py-1" 
                data-bs-toggle="modal" 
                data-bs-target="#orderModal"
                onclick='showOrderDetails(${JSON.stringify({
            service: {
              name: e.service?.name || "N/A",
              description: e.service?.description || "N/A",
              serviceType: e.service?.category?.name || "N/A",
              image: e.service?.image || "",
              status: e.service_status || e.status || null,
            },
            creator: {
              name: e.service?.creator?.name || "N/A",
              email: e.service?.creator?.email || "N/A",
              phone: e.service?.creator?.phone || "N/A",
              google_map_url: e.service?.creator?.google_map_url || "#",
              avatar: e.service?.creator?.avatar || "",
            },
            order: {
              orderDate: e.created_at || "N/A",
              status: statusText,
              qty: e.qty || 0,
              total: e.price || "0.00៛",
            },
          })})'
                title="View Details">
                <i class="bi bi-eye fs-5"></i>
              </button>
            </td>
          </tr>
        `;
      });

      tableBody.innerHTML = tr;

      // Initialize DataTable with configuration
      $("#purchasedTable").DataTable({
        destroy: true,
        responsive: true,
        lengthMenu: [
          [10, 25, 50, -1],
          [10, 25, 50, "All"],
        ],
        pageLength: 10,
        searching: true,
        dom: '<"top d-flex justify-content-between align-items-center mb-3"<"d-flex align-items-center"l><"d-flex align-items-center"f>>rt<"bottom"p>',
        language: {
          lengthMenu: `
            <div class="d-flex align-items-center gap-2">
              <select class="form-select mt-0 form-select-sm" aria-label="entries">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="-1">All</option>
              </select>
            </div>
          `,
          search: "_INPUT_",
          searchPlaceholder: "Search...",
        },
        classes: {
          sWrapper: "dataTables_wrapper dt-bootstrap5",
          sFilterInput: "form-control form-control-sm",
          sLengthSelect: "form-select form-select-sm",
        },
      });
    });
}

// Update the showOrderDetails function to include service status
function showOrderDetails(details) {
  const modalBody = document.querySelector("#orderModal .modal-body");
  modalBody.innerHTML = `
    <ul class="nav nav-tabs mb-3" id="orderDetailTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="service-tab" data-bs-toggle="tab" data-bs-target="#service-content" type="button" role="tab">
          Service Details
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="creator-tab" data-bs-toggle="tab" data-bs-target="#creator-content" type="button" role="tab">
          Creator Info
        </button>
      </li>
    </ul>
    
    <div class="tab-content" id="orderDetailTabContent">
      <!-- Enhanced Service Details Tab -->
      <div class="tab-pane fade show active" id="service-content" role="tabpanel">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <!-- Service Header -->
            <div class="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
              <div class="service-image rounded-3 overflow-hidden" style="width: 100px; height: 100px;">
                <img src="${details.service.image}" 
                     class="w-100 h-100 object-fit-cover" 
                     alt="${details.service.name}">
              </div>
              <div>
                <h5 class="mb-1 fw-bold">${details.service.name}</h5>
                <p class="mb-0 text-muted">
                  <i class="bi bi-tag-fill me-1"></i>
                  ${details.service.serviceType}
                </p>
              </div>
            </div>

            <!-- Description Section -->
            <div class="mb-4">
              <h6 class="text-primary mb-3 fw-bold">
                <i class="bi bi-info-circle me-2"></i>Description
              </h6>
              <p class="mb-0 text-secondary">
                ${details.service.description}
              </p>
            </div>

            <!-- Order Information Section -->
            <div>
              <h6 class="text-primary mb-3 fw-bold">
                <i class="bi bi-receipt me-2"></i>Order Information
              </h6>
              <div class="list-group list-group-flush">
                <div class="list-group-item border-0 px-0 py-2">
                  <div class="d-flex align-items-center">
                    <div class="profile-icon-info bg-primary bg-opacity-10 p-2 me-3">
                      <i class="bi bi-calendar text-primary"></i>
                    </div>
                    <div>
                      <small class="text-muted d-block">Order Date</small>
                      <span class="fw-medium">
                        ${new Date(
    details.order.orderDate
  ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div class="list-group-item border-0 px-0 py-2">
                  <div class="d-flex align-items-center">
                    <div class="profile-icon-info bg-primary bg-opacity-10 p-2 me-3">
                      <i class="bi bi-box text-primary"></i>
                    </div>
                    <div>
                      <small class="text-muted d-block">Quantity</small>
                      <span class="fw-medium">${details.order.qty} items</span>
                    </div>
                  </div>
                </div>

                <div class="list-group-item border-0 px-0 py-2">
                  <div class="d-flex align-items-center">
                    <div class="profile-icon-info bg-primary bg-opacity-10 p-2 me-3">
                      <i class="bi bi-check-circle text-primary"></i>
                    </div>
                    <div>
                      <small class="text-muted d-block">Payment Status</small>
                      <span class="badge bg-${getStatusColor(
    details.order.status
  )} rounded-pill">
                        ${details.order.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="list-group-item border-0 px-0 py-2">
                  <div class="d-flex align-items-center">
                    <div class="profile-icon-info bg-primary text-primary bg-opacity-10 p-2 me-3">
                      ៛
                    </div>
                    <div>
                      <small class="text-muted d-block">Total Amount</small>
                      <span class="fw-medium">${details.order.total}៛</span>
                    </div>
                  </div>
                </div>

                <div class="list-group-item border-0 px-0 py-2">
                  <div class="d-flex align-items-center">
                    <div class="profile-icon-info bg-primary bg-opacity-10 p-2 me-3">
                      <i class="bi bi-clock-history text-primary"></i>
                    </div>
                    <div>
                      <small class="text-muted d-block">Service Status</small>
                      <span class="badge bg-${getServiceStatusColor(details.service.status)} rounded-pill">
                        ${getServiceStatusText(details.service.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Creator Info Tab (unchanged) -->
      <div class="tab-pane fade" id="creator-content" role="tabpanel">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <!-- Creator Header -->
            <div class="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
              <div class="position-relative">
                <img src="${details.creator.avatar}" 
                     class="rounded-circle border border-2 border-white shadow-sm" 
                     width="80" 
                     height="80" 
                     alt="Creator Avatar"
                     style="object-fit: cover;">
                <span class="position-absolute bottom-0 end-0 bg-success profile-icon-info p-1 border border-2 border-white"
                      style="width: 16px; height: 16px;"></span>
              </div>
              <div>
                <h5 class="mb-1 fw-bold">${details.creator.name}</h5>
                <p class="mb-0 text-muted">
                  <i class="bi bi-patch-check-fill text-primary me-1"></i>
                  Verified Service Provider
                </p>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="mb-4">
              <h6 class="text-primary mb-3 fw-bold">
                <i class="bi bi-info-circle me-2"></i>Contact Information
              </h6>
              <div class="list-group list-group-flush">
                <div class="list-group-item border-0 px-0 py-2">
                  <div class="d-flex align-items-center">
                    <div class="profile-icon-info bg-primary bg-opacity-10 p-2 me-3">
                      <i class="bi bi-envelope text-primary"></i>
                    </div>
                    <div>
                      <small class="text-muted d-block">Email Address</small>
                      <span class="fw-medium">${details.creator.email}</span>
                    </div>
                  </div>
                </div>
                <div class="list-group-item border-0 px-0 py-2">
                  <div class="d-flex align-items-center">
                    <div class="profile-icon-info bg-primary bg-opacity-10 p-2 me-3">
                      <i class="bi bi-telephone text-primary"></i>
                    </div>
                    <div>
                      <small class="text-muted d-block">Phone Number</small>
                      <span class="fw-medium">${details.creator.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Location Section -->
            <div>
              <h6 class="text-primary mb-3 fw-bold">
                <i class="bi bi-geo-alt me-2"></i>Location
              </h6>
              <div class="d-grid">
                <a href="${details.creator.google_map_url}" 
                   target="_blank" 
                   class="btn btn-outline-primary">
                  <i class="bi bi-map me-2"></i>View on Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Helper function to get status color
function getStatusColor(status) {
  switch (status.toLowerCase()) {
    case "pending":
      return "warning";
    case "approved":
      return "success";
    case "rejected":
      return "danger";
    default:
      return "secondary";
  }
}

// Add these helper functions
function getServiceStatusColor(status) {
  if (!status) return "secondary"; // Handle null/undefined case first

  switch (parseInt(status)) {
    case 1: return "info";      // placed order
    case 2: return "primary";   // laundry pick up
    case 3: return "warning";   // in process
    case 4: return "warning";   // process to iron
    case 5: return "warning";   // ironing
    case 6: return "success";   // ready for delivery
    case 7: return "info";      // out for delivery
    case 8: return "success";   // delivered
    default: return "secondary";
  }
}

function getServiceStatusText(status) {
  if (!status) return "Unknown Status"; // Handle null/undefined case first

  switch (parseInt(status)) {
    case 1: return "Placed Order";
    case 2: return "Laundry Pick Up";
    case 3: return "In Process";
    case 4: return "Process to Iron";
    case 5: return "Ironing";
    case 6: return "Ready for Delivery";
    case 7: return "Out for Delivery";
    case 8: return "Delivered";
    default: return "Unknown Status";
  }
}

// Make showOrderDetails available globally
window.showOrderDetails = showOrderDetails;

fetchPurchased();

// ============================ end of change avatar =========================

// First, update the HTML tabs
document.querySelector("#filterTabs").innerHTML = `
  <li class="nav-item">
    <a class="nav-link active" data-filter="all" href="#">All Orders</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" data-filter="1" href="#">Pending</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" data-filter="2" href="#">Approved</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" data-filter="3" href="#">Rejected</a>
  </li>
`;

// Add click event listeners for the filter tabs
document.addEventListener("DOMContentLoaded", function () {
  const filterTabs = document.querySelectorAll("#filterTabs .nav-link");

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", function (e) {
      e.preventDefault();

      // Remove active class from all tabs
      filterTabs.forEach((t) => t.classList.remove("active"));
      // Add active class to clicked tab
      this.classList.add("active");

      // Get status from data-filter attribute
      const status = this.getAttribute("data-filter");
      console.log("Clicked status:", status); // Debug log
      fetchPurchased(status);
    });
  });

  // Initial fetch with "all" status
  fetchPurchased("all");
});

// Add this helper function for status badge colors
function getStatusClass(status) {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-warning text-dark";
    case "approved":
      return "bg-success text-white";
    case "rejected":
      return "bg-danger text-white";
    default:
      return "bg-secondary text-white";
  }
}



const sidebarItems = document.querySelectorAll(".sidebar-item");
const contentSections = document.querySelectorAll(".content-section");

sidebarItems.forEach((item) => {
  item.addEventListener("click", function () {
    const sectionId = this.getAttribute("data-section");

    sidebarItems.forEach((si) => si.classList.remove("active"));
    this.classList.add("active");

    contentSections.forEach((section) => {
      if (section.id === sectionId) {
        section.classList.remove("d-none");
      } else {
        section.classList.add("d-none");
      }
    });
  });
});

document
  .getElementById("cardNumber")
  .addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "").substring(0, 16);
    let formattedValue = "";
    for (let i = 0; i < value.length; i += 4) {
      formattedValue += value.substring(i, i + 4) + " ";
    }
    e.target.value = formattedValue.trim();
  });

document
  .getElementById("expiryDate")
  .addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "").substring(0, 4);
    let formattedValue = "";
    if (value.length > 2) {
      formattedValue =
        value.substring(0, 2) + "/" + value.substring(2, 4);
    } else {
      formattedValue = value;
    }
    e.target.value = formattedValue;
  });

document.getElementById("cvv").addEventListener("input", function (e) {
  this.value = this.value.replace(/\D/g, "").substring(0, 3);
});

document
  .getElementById("add-payment-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const paymentType = document.getElementById("paymentType").value;
    const cardNumber = document
      .getElementById("cardNumber")
      .value.replace(/\s/g, "");
    const lastFourDigits = cardNumber.slice(-4);
    const paymentMethodsList = document.getElementById(
      "payment-methods-list"
    );

    const newCard = document.createElement("div");
    newCard.className = "card mb-2";
    newCard.innerHTML = `
      <div class="card-body d-flex justify-content-between align-items-center">
        <div>
          <i class="fab fa-cc-${paymentType} me-2"></i>
          <span>${paymentType.charAt(0).toUpperCase() + paymentType.slice(1)
      } បញ្ចប់ដោយលេខ ${lastFourDigits}</span>
        </div>
        <button class="btn btn-sm btn-outline-danger remove-payment">លុប</button>
      </div>
    `;
    paymentMethodsList.appendChild(newCard);

    const modal = bootstrap.Modal.getInstance(
      document.getElementById("addPaymentModal")
    );
    modal.hide();
    document.getElementById("add-payment-form").reset();

    newCard
      .querySelector(".remove-payment")
      .addEventListener("click", function () {
        paymentMethodsList.removeChild(newCard);
      });
  });

document
  .getElementById("payment-methods-list")
  .addEventListener("click", function (e) {
    if (e.target.classList.contains("remove-payment")) {
      const card = e.target.closest(".card");
      paymentMethodsList.removeChild(card);
    }
  });

// Add this function to toggle password visibility
function togglePasswordVisibility(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);
  if (input.type === "password") {
    input.type = "text"; // Change to text to show password
    icon.classList.remove("fa-eye"); // Change icon to 'eye' open
    icon.classList.add("fa-eye-slash"); // Change icon to 'eye' closed
  } else {
    input.type = "password"; // Change back to password
    icon.classList.remove("fa-eye-slash"); // Change icon to 'eye' closed
    icon.classList.add("fa-eye"); // Change icon to 'eye' open
  }
}

// Add event listeners for the eye icons
document
  .getElementById("toggleCurrentPassword")
  .addEventListener("click", function () {
    togglePasswordVisibility("currentPassword", "toggleCurrentPassword");
  });

document
  .getElementById("toggleNewPassword")
  .addEventListener("click", function () {
    togglePasswordVisibility("newPassword", "toggleNewPassword");
  });

document
  .getElementById("toggleConfirmPassword")
  .addEventListener("click", function () {
    togglePasswordVisibility("confirmPassword", "toggleConfirmPassword");
  });



// render to cart
// ---------------- summary cart -------------------------------




