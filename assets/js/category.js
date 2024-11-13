let list = document.querySelectorAll(".navigation li");
import { AdminToken } from './tokens.js';

//get categories
function fetchCategories() {
  fetch("https://mps10.chandalen.dev/api/categories", {
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
                      <button class="btn btn-primary btn-edit" onClick="openUpdateModal(${e.id}, '${e.name}')"><i class="bi bi-pencil-square"></i></button>
                      <button class="btn btn-danger btn-delete" onClick="deleteCategory(${e.id})" data-id="${e.id}"><i class="bi bi-trash"></i></button>
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

  fetch("https://mps10.chandalen.dev/api/categories", {
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



//update category
function openUpdateModal(id, name) {
  $("#updateCategoryModal").modal("show");

  document.getElementById("updateCategoryId").value = id;
  document.getElementById("updateCategoryName").value = name;
}

function updateCategory() {
  const categoryId = document.getElementById("updateCategoryId").value;
  const updatedName = document
    .getElementById("updateCategoryName")
    .value.trim();

  if (!updatedName) {
    return alert("Please enter a category name.");
  }

  fetch(`https://mps10.chandalen.dev/api/categories/${categoryId}`, {
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
// delete function
function deleteCategory(categoryId) {
  if (!confirm("Are you sure you want to delete this category?")) return;

  fetch(`https://mps10.chandalen.dev/api/categories/${categoryId}`, {
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

function activeLink() {
  list.forEach((item) => {
    item.classList.remove("hovered");
  });
  this.classList.add("hovered");
}

list.forEach((item) => item.addEventListener("mouseover", activeLink));

let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

toggle.onclick = function () {
  navigation.classList.toggle("active");
  main.classList.toggle("active");
};
