import { AdminToken, UserToken } from "./tokens.js";
import { baseUrl } from "./baseUrl.js";
import {
  modalContent,
  togglePasswordVisibility,
  initInformationForm,
  adminModalContent,
  initAdminInformationForm,
  initPasswordForm,
} from "./updateUserInfo.js";

// Make togglePasswordVisibility available globally
window.togglePasswordVisibility = togglePasswordVisibility;
window.initInformationForm = initInformationForm;

// Menu Toggle
let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

toggle.onclick = function () {
  navigation.classList.toggle("active");
  main.classList.toggle("active");
};
// =====================================================================

let dataTable;

function DisplayServices() {
  let ProviderID = localStorage.getItem("ProviderID");
  console.log("Hello " + ProviderID);

  fetch(
<<<<<<< HEAD
    `${baseUrl}/api/services?page=1&per_page=20&search=&category=&price_start=0&price_end=99999&creator=` +
      ProviderID,
=======
    `${baseUrl}/api/services?page=1&per_page=20&search=&category=&creator=` +
      serviceId,
>>>>>>> vit
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + AdminToken,
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      const services = data.data;
      console.log("result " + data.data);

      if ($.fn.DataTable.isDataTable("#servicesTable")) {
        $("#servicesTable").DataTable().destroy();
      }

      dataTable = $("#servicesTable").DataTable({
        data: services,
        columns: [
          {
            data: "image",
            render: function (data, type, row) {
              return `<img src="${data}" alt="${row.name}" class="table-img">`;
            },
          },
          { data: "name" },
          { data: "creator.name" },
          {
            data: "price",
            render: function (data, type, row) {
              return `<div class="text-start">$${data}</div>`; // Add text-start class here
            },
          },
          {
            data: null,
            render: function (data, type, row) {
              return `
                  <div class="action-buttons">
                    <button  data-bs-toggle="modal" data-bs-target="#detailModal" class="btn btn-info btn-sm" onclick="viewDetails(${JSON.stringify(
                      row
                    ).replace(/"/g, "&quot;")})">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-warning btn-sm my-2 my-md-0" data-bs-toggle="modal" data-bs-target="#editModal" onclick="editService(this)">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button onclick="deleteService(this)" class="btn btn-danger btn-sm">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                `;
            },
          },
        ],
        responsive: true,
        autoWidth: false,
        pageLength: 10,
        lengthMenu: [
          [5, 10, 25, 50, -1],
          [5, 10, 25, 50, "All"],
        ],
        language: {
          search: "Search:",
          lengthMenu: "Show _MENU_ entries",
          info: "Showing _START_ to _END_ of _TOTAL_ entries",
          paginate: {
            first: "First",
            last: "Last",
            next: "Next",
            previous: "Previous",
          },
        },
      });
    });
}
$("#servicesTable").DataTable({
  responsive: true,
});
$(document).ready(function () {
  DisplayServices();
});

function viewDetails(service) {
  const id = service.id;
  console.log(id);
  fetch(`${baseUrl}/api/services/` + id)
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      document.getElementById("modalImage").src = service.image;
      document.getElementById("modalName").textContent = service.name;
      document.getElementById("modalCategory").textContent =
        service.category.name;
      document.getElementById("modalPrice").textContent = service.price;
      document.getElementById("modalDiscount").textContent = service.discount;
      document.getElementById("modalCreated").textContent = new Date(
        service.created_at
      ).toLocaleDateString();
      document.getElementById("modalDescription").textContent =
        service.description;

      document.getElementById("modalProviderAvatar").src =
        service.creator.avatar;
      document.getElementById("modalProviderName").textContent =
        service.creator.name;
      document.getElementById("modalProviderEmail").textContent =
        service.creator.email;
      document.getElementById("modalProviderPhone").textContent =
        service.creator.phone;
      document.getElementById("modalProviderJoined").textContent = new Date(
        service.creator.created_at
      ).toLocaleDateString();
      document.getElementById("modalProviderLocation").textContent =
        service.creator.google_map_url;
    });
}
<<<<<<< HEAD

window.viewDetails = viewDetails;

=======
window.viewDetails = viewDetails;
>>>>>>> vit
// ===============================

// Validation functions using regex
const validators = {
  name: {
    regex: /^.{3,50}$/,
    message:
      "Name must be 3-50 characters long and contain only letters, numbers and spaces",
  },
  description: {
    regex: /^.{5,500}$/,
    message: "Description must be between 10-500 characters long",
  },
  price: {
    regex: /^\d*\.?\d{0,2}$/,
    message: "Please enter a valid price (e.g., 99.99)",
  },
  discount: {
    regex: /^(?:100|[0-9]{1,2})$/,
    message: "Discount must be between 0-100",
  },
  category_id: {
    regex: /^[1-9]\d*$/,
    message: "Please select a valid category",
  },
};

// Function to validate a single field
const validateField = (name, value) => {
  if (!validators[name]) return true;

  // Handle empty required fields
  if (!value && name !== "discount") {
    return false;
  }

  return validators[name].regex.test(value);
};

// Main form validation and submission handler
document.addEventListener("DOMContentLoaded", () => {
  DisplayServices();

  // Add profile dropdown functionality
  const profile = document.querySelector(".profile");
  const menu = document.querySelector(".menu");

  if (profile && menu) {
    // Toggle menu on profile click
    profile.addEventListener("click", function (e) {
      e.stopPropagation(); // Prevent event bubbling
      menu.classList.toggle("active");
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (e) {
      if (!profile.contains(e.target)) {
        menu.classList.remove("active");
      }
    });

    // Handle menu item clicks
    menu.addEventListener("click", function (e) {
      const link = e.target.closest("a");
      if (!link) return;

      e.preventDefault();
      const type = link.textContent.trim().toLowerCase().includes("password")
        ? "password"
        : "information";

      // Update modal content
      const modalTitle = document.getElementById("profileModalTitle");
      const modalBody = document.querySelector("#profileModal .modal-body");
      const isAdmin = localStorage.getItem("UserRole") === "2";

      // Use admin modal content for admin users
      const modalConfig = isAdmin ? adminModalContent : modalContent;

      modalTitle.textContent = modalConfig[type].title;
      modalBody.innerHTML = modalConfig[type].content;

      localStorage.setItem("category_id", categoryId);
      formData.set("category_id", categoryId);

      fetch(`${baseUrl}/api/services`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + AdminToken,
          Accept: "application/json",
        },
        body: formData,
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then((errorData) => {
              throw new Error(JSON.stringify(errorData));
            });
          }
          // Refresh the page after closing the modal
          setTimeout(() => {
            window.location.reload();
          }, 500);
          return res.json();
        })
        .then((data) => {
          // Your existing success handling code
          DisplayServices();
          form.reset();
          bootstrap.Modal.getInstance(
            document.getElementById("addServiceModal")
          ).hide();
        })
        .catch((error) => {
          console.error("Error adding service:", error);
          alert("Failed to add service. Please try again.");
        });
    });
  }
});

// ========================

function editService(button) {
  const row = $(button).closest("tr");
  const data = dataTable.row(row).data();

  if (!data) {
    console.error("No data found for the selected row.");
    return; // Exit the function if data is undefined
  }

  document.getElementById("editId").value = data.id;
  document.getElementById("name").value = data.name;
  document.getElementById("description").value = data.description;
  document.getElementById("price").value = data.price;
  document.getElementById("discount").value = data.discount;

  // Set the selected category ID in the dropdown
  document.getElementById("category_id").value = data.category.id; // Ensure this matches the category ID

  // Set the image preview if available
  if (data.image) {
    document.getElementById("imagePreview").src = data.image;
    document.getElementById("imagePreview").style.display = "block";
    document.getElementById("fileName").textContent = "";
  } else {
    document.getElementById("imagePreview").src = "";
    document.getElementById("imagePreview").style.display = "none";
    document.getElementById("fileName").textContent = "No file chosen";
  }
}
<<<<<<< HEAD

window.editService = editService;

=======
window.editService = editService;
>>>>>>> vit
document.getElementById("editForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const id = formData.get("id");

  fetch(`${baseUrl}/api/services/${id}`, {
    method: "Post",
    headers: {
      Authorization: "Bearer " + AdminToken,
      Accept: "application/json",
    },
    body: formData,
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Network response was not ok: ${res.statusText}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      DisplayServices();
      bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
    })
    .catch((error) => {
      console.error("Error updating service:", error);
      alert("Failed to update service. Please try again.");
    });
});

function deleteService(button) {
  const row = $(button).closest("tr");
  const data = dataTable.row(row).data();
  const id = data.id;

  if (confirm("Are you sure you want to delete this service?")) {
    fetch(`${baseUrl}/api/services/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + AdminToken,
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((json) => {
        dataTable.row(row).remove().draw();
      })
      .catch((error) => {
        console.error("Error deleting service:", error);
        alert("Failed to delete service. Please try again.");
      });
  }
}

window.deleteService = deleteService;

function previewImage(event) {
  const imagePreview = document.getElementById("addImagePreview"); // Update to new ID
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.src = e.target.result;
      imagePreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    imagePreview.src = "";
    imagePreview.style.display = "none";
  }
}

window.previewImage = previewImage;

function displayFileName(event) {
  const fileName = event.target.files[0]
    ? event.target.files[0].name
    : "No file chosen";
  document.getElementById("addFileName").textContent = fileName;
}

window.displayFileName = displayFileName;

function fetchCategories() {
  fetch(`${baseUrl}/api/categories`)
    .then((res) => res.json())
    .then((data) => {
      const categorySelectAdd = document.getElementById("addCategoryId");
      const categorySelectEdit = document.getElementById("category_id");
      categorySelectAdd.innerHTML = ""; // Clear existing options
      categorySelectEdit.innerHTML = ""; // Clear existing options

      data.data.forEach((category) => {
        const optionAdd = document.createElement("option");
        optionAdd.value = category.id; // Set the value to category ID
        optionAdd.textContent = category.name; // Set the display text to category name
        categorySelectAdd.appendChild(optionAdd); // Append option to select

        const optionEdit = document.createElement("option");
        optionEdit.value = category.id; // Set the value to category ID
        optionEdit.textContent = category.name; // Set the display text to category name
        categorySelectEdit.appendChild(optionEdit); // Append option to select
      });
    })
    .catch((error) => console.error("Error fetching categories:", error));
}
// Call fetchCategories when the document is ready
$(document).ready(function () {
  fetchCategories();
  DisplayServices();
});
