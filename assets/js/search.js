import { baseUrl } from "./baseUrl.js";
import { UserToken } from "./tokens.js";

function handleKeyDown(event) {
  if (event.key === "Enter") {
    searchAndRedirect();
  }
}

window.handleKeyDown = handleKeyDown;

function searchAndRedirect() {
  let search_by_name = document.querySelector(".get_vlue_by_search").value;
  console.log(search_by_name);

  if (search_by_name === "") {
    alert("please input text to search");
  } else {
    sessionStorage.setItem("searchQuery", search_by_name);
    const currentPath = window.location.href;
    const basePath = currentPath.substring(0, currentPath.indexOf("/src/") + 1);
    location.href = `${basePath}src/views/page/search.html`;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  let querySearch = sessionStorage.getItem("searchQuery");

  if (querySearch) {
    document.getElementById("animation-overlay").style.display = "block";

    fetch(
      `${baseUrl}/api/services?page=1&per_page=20&search=${querySearch}&category=&price_start=&price_end=&creator=`
    )
      .then((res) => res.json())
      .then((json) => {
        let col_3 = "";

        if (json.data.length === 0) {
          document.querySelector(
            "#search_not_found"
          ).innerHTML = `<h3 class='text-primary'>No results found for "${querySearch}".</h3>`;
        } else {
          document.querySelector(
            "#Is-search-found"
          ).innerHTML = `<h3 class='text-primary mb-5'>Search found "${querySearch}".</h3>`;
          json.data.forEach((element) => {
            col_3 += `
                <div class="col-3">
                  <div class="card bg-transparent overflow-hidden border-0 h-100 bg-black">
                    <p class='id' style="display: none;">${element.id}</p>
                    <div class="mb-3 overflow-hidden position-relative card-img-wrapper border overflow-hidden">
                      <button type="submit" 
                              onclick="wishlistCard(${element.id}, this)" 
                              class="btn heart bg-instead heart-btn position-absolute end-0 mt-2 me-2 z-1">
                        <i class="bi bi-heart"></i>
                      </button>
                      <a href="#" onclick="getStore(${element.creator.id}, '${element.creator.avatar}')" class="overflow-hidden d-block">
                        <img src="${element.image}" 
                            class="card-img img-store w-100" 
                            alt="${element.name}">
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
        }

        document.querySelector("#store-card").innerHTML = col_3;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        document.querySelector(
          "#search_not_found"
        ).innerHTML = `<h3 class='text-danger'>Failed to load data. Please try again later.</h3>`;
      })
      .finally(() => {
        document.getElementById("animation-overlay").style.display = "none";
      });
  }
});

function store(event) {
  event.preventDefault();
  const currentPath = window.location.href;
  const basePath = currentPath.substring(0, currentPath.indexOf("/src/") + 1);
  location.href = `${basePath}/src/views/page/store.html`;
}

window.store = store;

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
      // Toggle heart icon
      const heartIcon = heartButton.querySelector("i");
      if (heartIcon.classList.contains("bi-heart")) {
        heartIcon.classList.remove("bi-heart");
        heartIcon.classList.add("bi-heart-fill");
      } else {
        heartIcon.classList.remove("bi-heart-fill");
        heartIcon.classList.add("bi-heart");
      }
      // Update the wishlist counter if you have that functionality
      if (typeof updateWishlistCounter === "function") {
        updateWishlistCounter();
      }
    })
    .catch((error) => {
      console.error("Error updating wishlist:", error);
      alert("Failed to update wishlist. Please try again.");
    });
}

window.wishlistCard = wishlistCard;

function getStore(creatorID, creatorAvatar) {
  sessionStorage.setItem("creator_id", creatorID);
  localStorage.setItem("store_profile", creatorAvatar);
  const currentPath = window.location.href;
  const basePath = currentPath.substring(0, currentPath.indexOf("/src/") + 1);
  location.href = `${basePath}src/views/page/store.html`;
}

window.getStore = getStore;
