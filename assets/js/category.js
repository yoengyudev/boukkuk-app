import { AdminToken, UserToken } from './tokens.js';
import { baseUrl } from './baseUrl.js';
import { 
    modalContent, 
    togglePasswordVisibility, 
    initInformationForm, 
    adminModalContent, 
    initAdminInformationForm, 
    initPasswordForm 
} from './updateUserInfo.js';

let list = document.querySelectorAll(".navigation li");

// Add these lines near the top of your category.js file, after the imports
window.togglePasswordVisibility = togglePasswordVisibility;
window.previewImage = function(input) {
    const preview = document.getElementById('avatarPreview');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    }
};

//get categories
function fetchCategories() {
  fetch(`${baseUrl}/api/categories`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${AdminToken}`,
    },
  })
    .then((res) => res.json())
    .then((json) => {
      let tr = "";
      console.log(json);
      
      json.data.forEach((e) => {
        tr += `<tr>
                <td class='text-start'>${e.id}</td>
                <td>${e.name}</td>
                <td> 
                      <button class="btn p-0 text-white px-2 bg-primary btn-edit" onClick="openUpdateModal(${e.id}, '${e.name}')"><i class="bi bi-pencil-square"></i></button>
                      <button class="btn p-0 btn-delete bg-danger px-2 text-white ms-3" onClick="deleteCategory(${e.id})" data-id="${e.id}"><i class="bi bi-trash"></i></button>
                </td>

            </tr>`;
      });
      document.getElementById("table_body").innerHTML = tr;
      $("#categoriesTable").DataTable({
        destroy: true,
        responsive: true,
      });
    })
    .catch((error) => console.error("Error fetching data:", error));
}


fetchCategories();

// add category



function addCategory() {
  const categoryName = document.getElementById("categoryName").value.trim();
  const errorMessage = document.getElementById("error-message");

  errorMessage.textContent = "";

  if (!categoryName) {
    errorMessage.textContent = "Category name cannot be empty.";
    return;
  }

  fetch(`${baseUrl}/api/categories`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${AdminToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: categoryName }),
  })
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      fetchCategories();

      // Close the modal
      bootstrap.Modal.getInstance(document.getElementById("addCategoryModal")).hide();

      // Refresh the page after closing the modal
      setTimeout(() => {
        window.location.reload();
      }, 500); // Optional delay to ensure the modal closes smoothly
    })
    .catch((error) => console.error("Error adding category:", error));
}

window.addCategory = addCategory;



//update category
function openUpdateModal(id, name) {
  $("#updateCategoryModal").modal("show");

  document.getElementById("updateCategoryId").value = id;
  document.getElementById("updateCategoryName").value = name;
}

window.openUpdateModal = openUpdateModal;

function updateCategory() {
  const categoryId = document.getElementById("updateCategoryId").value;
  const updatedName = document
    .getElementById("updateCategoryName")
    .value.trim();

  if (!updatedName) {
    return alert("Please enter a category name.");
  }

  fetch(`${baseUrl}/api/categories/${categoryId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${AdminToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: updatedName }),
  })
    .then((res) => res.json())
    .then((json) => {
        // Close the modal
        bootstrap.Modal.getInstance(document.getElementById("updateCategoryModal")).hide();

        // Refresh the page after closing the modal
        setTimeout(() => {
          window.location.reload();
        }, 500);
    })
    .catch((error) => console.error("Error updating category:", error));
}

window.updateCategory = updateCategory;

// delete function
function deleteCategory(categoryId) {
  if (!confirm("Are you sure you want to delete this category?")) return;

  fetch(`${baseUrl}/api/categories/${categoryId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${AdminToken}`,
    },
  })
    .then((res) => res.json())
    .then((json) => {
      console.log(json)
      if (json.message) {
        const categoryElement = document.getElementById(
          `category-${categoryId}`
        );
        setTimeout(() => {
          window.location.reload();
        }, 500);
        if (categoryElement) {
          categoryElement.remove();
        }
      }
    })
    .catch((error) => console.error("Error deleting category:", error));
}

window.deleteCategory = deleteCategory;

function activeLink() {
  list.forEach((item) => {
    item.classList.remove("hovered");
  });
  this.classList.add("hovered");
}

list.forEach((item) => item.addEventListener("mouseover", activeLink));

document.addEventListener("DOMContentLoaded", function() {
    console.log("Category page loaded");
    const profile = document.querySelector(".global-profile-menu");
    const menu = profile?.querySelector(".dropdown-menu");
    console.log("Profile element:", profile);
    console.log("Menu element:", menu);
});
