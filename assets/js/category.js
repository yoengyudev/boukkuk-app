
let list = document.querySelectorAll(".navigation li");
const getToken = localStorage.getItem("token");
console.log("Token:", getToken);

//get categories
function fetchCategories() {
    fetch("https://mps10.chandalen.dev/api/categories", {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${getToken}`,
        },
    })
        .then((res) => res.json())
        .then((json) => {
            let tr = "";
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
            $("#categoriesTable").DataTable({ responsive: true });
        })
        .catch((error) => console.error("Error fetching data:", error));
}
fetchCategories();


//add category
function addCategory() {
    const categoryName = document.getElementById("categoryName").value;

    fetch("https://mps10.chandalen.dev/api/categories", {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${getToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: categoryName }),
    })
        .then((res) => res.json())
        .then((json) => {
            console.log(json);
            if (json.success) {
                alert("Category added successfully!");
            }
            fetchCategories();
            const categoryModal = new bootstrap.Modal(document.getElementById("addUserModal"));
            categoryModal.hide();
        })
        .catch((error) => console.error("Error adding category:", error));
}



//update category
function openUpdateModal(id, name) {
    $('#updateCategoryModal').modal('show');

    document.getElementById("updateCategoryId").value = id;
    document.getElementById("updateCategoryName").value = name;
}

function updateCategory() {
    const categoryId = document.getElementById("updateCategoryId").value;
    const updatedName = document.getElementById("updateCategoryName").value.trim();

    if (!updatedName) {
        return alert("Please enter a category name.");
    }

    fetch(`https://mps10.chandalen.dev/api/categories/${categoryId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${getToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: updatedName }),
    })
        .then((res) => res.json())
        .then((json) => {
            if (json.success) {

                $('#updateCategoryModal').modal('hide');
                fetchCategories();
                alert("Category updated successfully!");
            }
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
            Authorization: `Bearer ${getToken}`,
        },
    })
        .then((res) => res.json())
        .then((json) => {
            if (json.success) {
                const categoryElement = document.getElementById(`category-${categoryId}`);
                if (categoryElement) {
                    categoryElement.remove();
                }
                alert("Category deleted successfully!");
            } else {
                alert("Failed to delete category.");
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

