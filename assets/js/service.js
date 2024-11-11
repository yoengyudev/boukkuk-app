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

function addService(event) {
  event.preventDefault();
  // let setId = localStorage.setItem('getId',categoryId);
  // console.log(setId);
  
  const form = document.getElementById("addServiceForm"); // Get the form element
  const formData = new FormData(form); // Create FormData from the form

  const categoryId = parseInt(formData.get("category_id"), 10);
  if (!categoryId || isNaN(categoryId)) {
    alert("Please enter a valid Category ID.");
    return;
  }
  localStorage.setItem('category_id', categoryId);
  formData.set("category_id", categoryId); // Set the validated category ID back to formData

  fetch("https://mps10.chandalen.dev/api/services", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token, // Include the token for authorization
      Accept: "application/json",
    },
    body: formData, // Send the form data
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((errorData) => {
          throw new Error(JSON.stringify(errorData)); // Throw an error if the response is not ok
        });
      }
      return res.json(); // Parse the response as JSON
    })
    .then((data) => {
      console.log(data); // Log the entire response data
      localStorage.setItem('getID', data.categoryId);
      console.log(data.categoryId);
      
      console.log("New Service Details:", {
        name: formData.get("name"),
        description: formData.get("description"),
        price: formData.get("price"),
        discount: formData.get("discount"),
        categoryId: formData.get("category_id"),
        image: formData.get("image")
          ? formData.get("image").name
          : "No image uploaded",
      }); // Log specific details from the form

      DisplayServices(); // Refresh the service list

      form.reset(); // Clear the form fields
      const imagePreview = document.getElementById("addImagePreview");
      imagePreview.style.display = "none"; // Hide the image preview
      imagePreview.src = ""; // Clear the image source
      document.getElementById("addFileName").textContent = "No file chosen"; // Reset file name display
      bootstrap.Modal.getInstance(
        document.getElementById("addServiceModal")
      ).hide();
    })
    .catch((error) => {
      console.error("Error adding service:", error); // Log the error
      let errorMessage = "Failed to add service."; // Default error message
      try {
        const errorData = JSON.parse(error.message); // Attempt to parse the error message
        if (errorData.data && errorData.data.category_id) {
          errorMessage = `Category ID Error: ${errorData.data.category_id[0]}`; // Specific error message for category ID
        }
      } catch (e) {
        errorMessage = error.message; // Use the original error message if parsing fails
      }
      alert(errorMessage); // Notify the user of the error
    });
}

// Add event listener for form submission
document
  .getElementById("addServiceForm")
  .addEventListener("submit", addService);

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
