import { baseUrl } from "./baseUrl.js";
import { AdminToken, UserToken } from "./tokens.js";



let isclick = false;

function wishlistCard(serviceId, heartButton) {
  if (!UserToken) {
    const currentPath = window.location.href;
    const basePath = currentPath.substring(0, currentPath.indexOf("/src/") + 1);
    location.href = `${basePath}src/views/auth/login.html`;
    return;
  }

  fetch(`${baseUrl}/api/wishlists`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${UserToken}`,
    },
    body: JSON.stringify({
      service_id: serviceId,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update wishlist");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);

      // Toggle heart icon
      const heartIcon = heartButton.querySelector("i");
      if (heartIcon.classList.contains("bi-heart")) {
        heartIcon.classList.remove("bi-heart");
        heartIcon.classList.add("bi-heart-fill");
      } else {
        heartIcon.classList.remove("bi-heart-fill");
        heartIcon.classList.add("bi-heart");
      }
      // Update the wishlist counter
      updateWishlistCounter();
    })
    .catch((error) => {
      console.error("Error updating wishlist:", error);
      alert("Failed to update wishlist. Please try again.");
    });
}

window.wishlistCard = wishlistCard;

// ============ show store card ==========

function getCategory(value = 0) {
  console.log("Selected Category:", value);
  console.log(typeof value);
  // Update the URL based on the selected category; if "All" is selected, omit the category filter
  const url =
    value === 0
      ? `${baseUrl}/api/services?page=1&per_page=20&search=&price_start=0&price_end=99999&creator=`
      : `${baseUrl}/api/services?page=1&per_page=20&search=&category=${value}&price_start=0&price_end=99999&creator=`;

  fetch(url)
    .then((res) => res.json())
    .then((json) => {
      let col_3 = "";
      json.data.forEach((element) => {
        col_3 += `
          <div class="col-12 col-sm-6 col-md-4 col-lg-3">
            <div class="card bg-transparent border-0 h-100">
              <p class='id' style="display: none;">${element.id}</p>
              <div class="mb-3 position-relative card-img-wrapper border rounded-2">
                <button type="submit" 
                        onclick="wishlistCard(${element.id}, this)" 
                        class="btn heart bg-instead heart-btn position-absolute end-0 mt-2 me-2 z-1">
                  <i class="bi bi-heart"></i>
                </button>
                <a href="#" onclick="getStore(${element.creator.id}, '${element.creator.avatar}')" class="d-block p-5">
                     <img src="${element.image}" class="card-img img-store w-100" alt="${element.name}">
                </a>
              </div>
              <div class="card-body p-0">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <a href="#" onclick='store(event)' 
                     class="text-decoration-none text-store h5 mb-0 text-truncate me-2">
                     ${element.name}
                  </a>
                  <span class="d-flex align-items-center">
                    <i class="bi bi-star-fill text-warning me-1"></i>
                    <span>4.5</span>
                  </span>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <span class="metter">1000m</span>
                  <span class="text-muted">•</span>
                  <span>20វិនាទី</span>
                </div>
              </div>
            </div>
          </div>`;
      });

      document.querySelector("#store-card").innerHTML = col_3;
      document.getElementById("animation-overlay").style.display = "none";
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function getStore(creatorID, creatorAvatar) {
  let creator_ID = sessionStorage.setItem("creator_id", creatorID);
  let profile_img = sessionStorage.setItem("store_profile", creatorAvatar);
  const currentPath = window.location.href;
  const basePath = currentPath.substring(0, currentPath.indexOf("/src/") + 1);
  location.href = `${basePath}src/views/page/store.html`;
}

window.getStore = getStore;

function fetchCategories() {
  fetch(`${baseUrl}/api/categories`)
    .then((res) => res.json())
    .then((data) => {
      const categorySelectAdd = document.getElementById("addCategoryId");
      categorySelectAdd.innerHTML = "";

      // Add "All" option at the beginning
      const allOption = document.createElement("option");
      allOption.value = 0; // Set to 0 or any value that represents "All"
      allOption.textContent = "All";
      categorySelectAdd.appendChild(allOption);

      // Populate the dropdown with categories from the API
      data.data.forEach((category) => {
        const optionAdd = document.createElement("option");
        optionAdd.value = category.id;
        optionAdd.textContent = category.name;
        categorySelectAdd.appendChild(optionAdd);
      });
    })
    .catch((error) => console.error("Error fetching categories:", error));
}

let addCategoryId = document.getElementById("addCategoryId");

addCategoryId.addEventListener("change", () => {
  console.log(addCategoryId.value);
  getCategory(Number(addCategoryId.value));
});

// Initialize categories and fetch all items initially
fetchCategories();
getCategory(); 


