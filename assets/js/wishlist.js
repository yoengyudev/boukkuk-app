import { baseUrl } from "./baseUrl.js";
import { UserToken } from "./tokens.js";
let currentPage = 1;
const perPage = 12;
let paginationData = {};

// Make changePage function globally accessible
window.changePage = function(page) {
  console.log("Changing to page:", page); // Debug log
  if (page < 1 || page > paginationData.last_page) {
    return;
  }
  currentPage = page;
  fetchWishlistItems(page);
}

function fetchWishlistItems(page = 1) {
  document.getElementById("wishlist-items").innerHTML = `
    <div class="col-12 text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `;

  fetch(`${baseUrl}/api/profile/wishlists?page=${page}&per_page=${perPage}`, {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + UserToken,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch wishlist items");
      }
      return response.json();
    })
    .then((response) => {
      console.log("API Response:", response); // Debug log
      paginationData = response.paginate;
      renderWishlist(response.data);
      renderPagination();
    })
    .catch((error) => {
      console.error("Error fetching wishlist:", error);
      document.getElementById("wishlist-items").innerHTML = `
        <div class="col-12 text-center">
          <p class="text-danger">Failed to load wishlist items. Please try again later.</p>
        </div>
      `;
    });
}

function renderWishlist(items) {
  console.log(items);
  const wishlistContainer = document.getElementById("wishlist-items");
  const paginationControls = document.querySelector(".pagination-controls");

  if (!items || items.length === 0) {
    wishlistContainer.innerHTML = `
      <div class="col-12 text-center">
        <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-wishlist-illustration-download-in-svg-png-gif-file-formats--online-shop-store-marketplace-states-pack-windows-interface-illustrations-9824477.png?f=webp" alt="Empty Wishlist" class="img-fluid" width="250px" height="auto">
        <p>No items in your wishlist</p>
      </div>
    `;
    // Hide pagination when no items
    paginationControls.style.display = "none";
    return;
  }

  wishlistContainer.innerHTML = "";
  items.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.className = "col-lg-3 col-md-4 col-sm-6 mb-4";
    itemElement.setAttribute("data-wishlist-id", item.id);
    itemElement.innerHTML = `
      <div class="wishlist-item h-100" onclick="getStore('${item.service.creator.id}')">
        <div class="heart-icon" onclick="removeItem(${item.id}); event.stopPropagation();">
          <i class="bi bi-heart-fill"></i>
        </div>
        <div class="shop-info mb-2">
          <h5 class="shop-name">${item.service.creator.name}</h5>
        </div>
        <div class="clickable-area" style="cursor: pointer;">
          <div class="service-image mb-3">
            <img src="${item.service.image}" alt="${item.service.name}" class="img-fluid w-100">
          </div>
          <div class="service-details">
            <h4 class="service-name">${item.service.name}</h4>
            <div class="category-name mb-2">
              <i class="bi bi-tag me-1"></i>
              <span>${item.service.category.name}</span>
            </div>
            <div class="service-rating mb-2">
              <i class="bi bi-star-fill text-warning me-1"></i>
              <span class="rating-value">4.5</span>
            </div>
            <div class="service-info d-flex align-items-center gap-2">
              <span class="metter">1000m</span>
              <span class="text-muted">•</span>
              <span>20វិនាទី</span>
            </div>
          </div>
        </div>
        <div class="service-actions mt-3">
          <button class="btn-remove w-100" onclick="removeItem(${item.id}); event.stopPropagation();">
            <i class="fas fa-trash-alt me-2"></i>Remove
          </button>
        </div>
      </div>
    `;
    wishlistContainer.appendChild(itemElement);
  });
}

function renderPagination() {
  const paginationElement = document.getElementById("pagination");
  const paginationControls = document.querySelector(".pagination-controls");

  if (!paginationData || paginationData.total === 0) {
    paginationControls.style.display = "none";
    return;
  }

  paginationControls.style.display = "block";
  const totalPages = paginationData.last_page;
  
  let paginationHTML = `
    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
      <button type="button" class="page-link" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
        «
      </button>
    </li>
  `;

  // Show ellipsis and limit visible pages
  const showPages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
  let endPage = Math.min(totalPages, startPage + showPages - 1);

  if (startPage > 1) {
    paginationHTML += `
      <li class="page-item">
        <button type="button" class="page-link" onclick="changePage(1)">1</button>
      </li>
      ${startPage > 2 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
    `;
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
      <li class="page-item ${currentPage === i ? 'active' : ''}">
        <button type="button" class="page-link" onclick="changePage(${i})">${i}</button>
      </li>
    `;
  }

  if (endPage < totalPages) {
    paginationHTML += `
      ${endPage < totalPages - 1 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
      <li class="page-item">
        <button type="button" class="page-link" onclick="changePage(${totalPages})">${totalPages}</button>
      </li>
    `;
  }

  paginationHTML += `
    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
      <button type="button" class="page-link" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
        »
      </button>
    </li>
  `;

  paginationElement.innerHTML = paginationHTML;
}

function removeItem(id) {
  console.log("Removing wishlist item with ID:", id);

  if (
    !confirm("Are you sure you want to remove this item from your wishlist?")
  ) {
    return;
  }

  fetch(`${baseUrl}/api/wishlists/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + UserToken,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to remove item");
      }
      const itemElement = document.querySelector(`[data-wishlist-id="${id}"]`);
      if (itemElement) {
        itemElement.remove();
      }

      // Update wishlist counter immediately after successful removal
      updateWishlistCounter();

      // Refresh the current page of items
      fetchWishlistItems(currentPage);
    })
    .catch((error) => {
      console.error("Error removing item:", error);
      alert("Failed to remove item from wishlist. Please try again.");
    });
}
window.removeItem = removeItem;
// Add this function to ensure updateWishlistCounter is available in this context
function updateWishlistCounter() {
  if (!UserToken) return;

  fetch(`${baseUrl}/api/profile/wishlists?page=1&per_page=100`, {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + UserToken,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const wishlistCount = data.paginate.total;
      // Update counter in all pages (including the main page if it's open)
      const counters = document.querySelectorAll(".wishlist-counter");
      counters.forEach((counter) => {
        counter.textContent = wishlistCount;
        counter.style.display = wishlistCount > 0 ? "block" : "none";
      });
    })
    .catch((error) => console.error("Error fetching wishlist count:", error));
}

// Add this function to make it globally accessible
window.getStore = function(creatorID) {
  localStorage.setItem("creator_id", creatorID);
  const currentPath = window.location.href;
  const basePath = currentPath.substring(0, currentPath.indexOf("/src/") + 1);
  location.href = `${basePath}src/views/page/store.html`;
};

// Initial load
document.addEventListener("DOMContentLoaded", () => {
  fetchWishlistItems(1);
});
