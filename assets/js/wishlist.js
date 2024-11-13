let currentPage = 1;
const perPage = 12;
let paginationData = {};

function fetchWishlistItems(page = 1) {
    document.getElementById("wishlist-items").innerHTML = `
<div class="col-12 text-center">
<div class="spinner-border" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
</div>
`;

    fetch(
        `https://mps10.chandalen.dev/api/profile/wishlists?page=${page}&per_page=${perPage}`,
        {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + UserToken,
            },
        }
    )
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch wishlist items");
            }
            return response.json();
        })
        .then((response) => {
            console.log("API Response:", response); // Debug: Log the entire response
            console.log("First item:", response.data[0]); // Debug: Log the first item
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
      <div class="wishlist-item h-100" onclick="window.location.href='../../../src/views/page/store.html?id=${item.service.creator.id}'">
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

    // Hide pagination if total items is 0
    if (paginationData.total === 0) {
        paginationControls.style.display = "none";
        return;
    }

    // Show pagination controls
    paginationControls.style.display = "block";

    const totalPages = paginationData.last_page;
    currentPage = paginationData.current_page;

    let paginationHTML = "";

    // Previous button
    paginationHTML += `
    <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
      <a class="page-link" href="#" onclick="changePage(${currentPage - 1
        })" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
  `;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
      <li class="page-item ${currentPage === i ? "active" : ""}">
        <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
      </li>
    `;
    }

    // Next button
    paginationHTML += `
    <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
      <a class="page-link" href="#" onclick="changePage(${currentPage + 1
        })" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  `;

    paginationElement.innerHTML = paginationHTML;
}
function changePage(page) {
    if (page < 1 || page > paginationData.last_page) {
        return;
    }
    currentPage = page;
    fetchWishlistItems(page);
}

function removeItem(id) {
    console.log("Removing wishlist item with ID:", id);

    if (
        !confirm("Are you sure you want to remove this item from your wishlist?")
    ) {
        return;
    }

    fetch(`https://mps10.chandalen.dev/api/wishlists/${id}`, {
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

// Add this function to ensure updateWishlistCounter is available in this context
function updateWishlistCounter() {
    if (!UserToken) return;

    fetch(
        "https://mps10.chandalen.dev/api/profile/wishlists?page=1&per_page=100",
        {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + UserToken,
            },
        }
    )
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

// Initial load
document.addEventListener("DOMContentLoaded", () => fetchWishlistItems(1));
