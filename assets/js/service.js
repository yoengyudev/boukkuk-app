// add hovered class to selected list item
let list = document.querySelectorAll(".navigation li");

function activeLink() {
  list.forEach((item) => {
    item.classList.remove("hovered");
  });
  this.classList.add("hovered");
}

list.forEach((item) => item.addEventListener("mouseover", activeLink));

// Menu Toggle
let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

toggle.onclick = function () {
  navigation.classList.toggle("active");
  main.classList.toggle("active");
};
// =====================================================================
let token = localStorage.getItem("token");
console.log(token);
let dataTable;

function DisplayServices() {
  fetch(`https://mps10.chandalen.dev/api/services`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const services = data.data;

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
              return `$${data}`;
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
                    <button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#editModal" onclick="editService(this)">
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

$(document).ready(function () {
  DisplayServices();
});

function viewDetails(service) {
  const id = service.id;
  console.log(id);
  fetch("https://mps10.chandalen.dev/api/services/" + id)
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

// ===============================

// Validation functions using regex
const validators = {
  name: {
    regex: /^.{3,50}$/,
    message: "Name must be 3-50 characters long and contain only letters, numbers and spaces"
  },
  description: {
    regex: /^.{5,500}$/,
    message: "Description must be between 10-500 characters long"
  },
  price: {
    regex: /^\d*\.?\d{0,2}$/,
    message: "Please enter a valid price (e.g., 99.99)"
  },
  discount: {
    regex: /^(?:100|[0-9]{1,2})$/,
    message: "Discount must be between 0-100"
  },
  category_id: {
    regex: /^[1-9]\d*$/,
    message: "Please select a valid category"
  }
};

// Function to validate a single field
const validateField = (name, value) => {
  if (!validators[name]) return true;
  
  // Handle empty required fields
  if (!value && name !== 'discount') {
    return false;
  }
  
  return validators[name].regex.test(value);
};

// Main form validation and submission handler
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('addServiceForm');
  const inputs = form.querySelectorAll('input, textarea, select');
  
  // Real-time validation
  inputs.forEach(input => {
    input.addEventListener('input', function() {
      const isValid = validateField(this.name, this.value);
      
      if (!isValid) {
        this.classList.add('is-invalid');
        this.classList.remove('is-valid');
        
        // Show error message
        const feedbackDiv = this.nextElementSibling;
        if (feedbackDiv && feedbackDiv.classList.contains('invalid-feedback')) {
          feedbackDiv.textContent = validators[this.name]?.message || 'This field is required';
        }
      } else {
        this.classList.remove('is-invalid');
        this.classList.add('is-valid');
      }
    });
  });

  // Form submission handler
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    let isValid = true;
    const formData = new FormData(form);
    
    // Validate all fields before submission
    inputs.forEach(input => {
      const value = formData.get(input.name);
      if (!validateField(input.name, value)) {
        isValid = false;
        input.classList.add('is-invalid');
        
        // Show error message
        const feedbackDiv = input.nextElementSibling;
        if (feedbackDiv && feedbackDiv.classList.contains('invalid-feedback')) {
          feedbackDiv.textContent = validators[input.name]?.message || 'This field is required';
        }
      }
    });

    // File validation
    const imageInput = document.getElementById('addImage');
    if (imageInput.files.length > 0) {
      const file = imageInput.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        isValid = false;
        imageInput.classList.add('is-invalid');
        const feedbackDiv = imageInput.nextElementSibling;
        if (feedbackDiv && feedbackDiv.classList.contains('invalid-feedback')) {
          feedbackDiv.textContent = 'Please upload a valid image file (JPEG, PNG, or GIF)';
        }
      } else if (file.size > maxSize) {
        isValid = false;
        imageInput.classList.add('is-invalid');
        const feedbackDiv = imageInput.nextElementSibling;
        if (feedbackDiv && feedbackDiv.classList.contains('invalid-feedback')) {
          feedbackDiv.textContent = 'Image size should be less than 5MB';
        }
      }
    }

    if (isValid) {
      // If all validations pass, proceed with your existing addService logic
      const formData = new FormData(form);
      const categoryId = parseInt(formData.get("category_id"), 10);
      
      if (!categoryId || isNaN(categoryId)) {
        alert("Please enter a valid Category ID.");
        return;
      }
      
      localStorage.setItem('category_id', categoryId);
      formData.set("category_id", categoryId);

      // Your existing fetch logic here
      fetch("https://mps10.chandalen.dev/api/services", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json",
        },
        body: formData,
      })
      .then(res => {
        if (!res.ok) {
          return res.json().then(errorData => {
            throw new Error(JSON.stringify(errorData));
          });
        }
        // Refresh the page after closing the modal
        setTimeout(() => {
          window.location.reload();
        }, 500);
        return res.json();
      })
      .then(data => {
        // Your existing success handling code
        DisplayServices();
        form.reset();
        bootstrap.Modal.getInstance(document.getElementById("addServiceModal")).hide();
      })
      .catch(error => {
        console.error("Error adding service:", error);
        alert("Failed to add service. Please try again.");
      });
    }
  });
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
    document.getElementById("fileName").textContent = data.image
      .split("/")
      .pop();
  } else {
    document.getElementById("imagePreview").src = "";
    document.getElementById("imagePreview").style.display = "none";
    document.getElementById("fileName").textContent = "No file chosen";
  }
}

document.getElementById("editForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const id = formData.get("id");

  fetch(`https://mps10.chandalen.dev/api/services/${id}`, {
    method: "Post",
    headers: {
      Authorization: "Bearer " + token,
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
    fetch(`https://mps10.chandalen.dev/api/services/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
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
        alert("Service deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting service:", error);
        alert("Failed to delete service. Please try again.");
      });
  }
}

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

function displayFileName(event) {
  const fileName = event.target.files[0]
    ? event.target.files[0].name
    : "No file chosen";
  document.getElementById("addFileName").textContent = fileName; // Update to new ID
}

function displayFileName(event) {
  const fileName = event.target.files[0]
    ? event.target.files[0].name
    : "No file chosen";
  document.getElementById("fileName").textContent = fileName;
}

function fetchCategories() {
  fetch("https://mps10.chandalen.dev/api/categories")
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
  fetchCategories(); // Fetch categories on page load
  DisplayServices();
});
