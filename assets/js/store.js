import { baseUrl } from "./baseUrl.js";
import { UserToken } from "./tokens.js";
const cartItemsDiv = document.getElementById("cart-items");
const serviceCards = document.querySelectorAll(".service-card");
const totalPriceDiv = document.getElementById("total-price");
const checkoutButton = document.getElementById("checkout-button");
const tabs = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".service-section");
let getCreatorId = sessionStorage.getItem("creator_id");
let localCart = [];

if (!getCreatorId) {
  console.log("Hello world");
  const currentPath = window.location.href;
  const basePath = currentPath.substring(0, currentPath.indexOf("/src/") + 1);
  location.href = `${basePath}index.html`;
  throw new Error("Redirecting to index.html");
}

// Improved Intersection Observer options
const observerOptions = {
  root: null,
  rootMargin: "-150% 0px -82% 0px",
  threshold: 0.1,
};

let currentActiveSection = null;
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute("id");
      if (id !== currentActiveSection) {
        currentActiveSection = id;
        updateActiveTab(id);
      }
    }
  });
}, observerOptions);

// Observe all sections
sections.forEach((section) => {
  observer.observe(section);
});

function updateActiveTab(sectionId) {
  tabs.forEach((tab) => {
    const href = tab.getAttribute("href");
    if (href === `#${sectionId}`) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });
}

// Add scroll event listener for more responsive tab updates
window.addEventListener(
  "scroll",
  debounce(() => {
    let closestSection = null;
    let closestDistance = Infinity;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const distance = Math.abs(rect.top);
      if (distance < closestDistance) {
        closestSection = section;
        closestDistance = distance;
      }
    });

    if (closestSection) {
      const id = closestSection.getAttribute("id");
      updateActiveTab(id);
    }
  }, 10)
);

// Smooth scroll with offset correction
tabs.forEach((tab) => {
  tab.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href").substring(1);
    const targetSection = document.getElementById(targetId);
    const offset = 100;
    const targetPosition =
      targetSection.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });

    updateActiveTab(targetId);
  });
});

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// price range ui code

const rangeInput = document.querySelectorAll(".range-input input"),
  priceInput = document.querySelectorAll(".price-input input"),
  range = document.querySelector(".slider .progress");
let priceGap = 1000;

priceInput.forEach((input) => {
  input.addEventListener("input", (e) => {
    let minPrice = parseInt(priceInput[0].value),
      maxPrice = parseInt(priceInput[1].value);

    if (maxPrice - minPrice >= priceGap && maxPrice <= rangeInput[1].max) {
      if (e.target.className === "input-min") {
        rangeInput[0].value = minPrice;
        range.style.left = (minPrice / rangeInput[0].max) * 100 + "%";
      } else {
        rangeInput[1].value = maxPrice;
        range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
      }
    }
  });
});

rangeInput.forEach((input) => {
  input.addEventListener("input", (e) => {
    let minVal = parseInt(rangeInput[0].value),
      maxVal = parseInt(rangeInput[1].value);

    if (maxVal - minVal < priceGap) {
      if (e.target.className === "range-min") {
        rangeInput[0].value = maxVal - priceGap;
      } else {
        rangeInput[1].value = minVal + priceGap;
      }
    } else {
      priceInput[0].value = minVal;
      priceInput[1].value = maxVal;
      range.style.left = (minVal / rangeInput[0].max) * 100 + "%";
      range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
    }
  });
});

// ================get profile_picture==============
let getProfile = localStorage.getItem("store_profile");
document.getElementById("profile_img").src = getProfile;

// =================Get all service =================
let firstId = " ";
function getCategory(value = 0, search = "") {
  console.log("Selected Category:", value);
  console.log("Search Term:", search);
  let start_pri = document.querySelector(".input-min").value;
  let end_pri = document.querySelector(".input-max").value;
  console.log(getCreatorId);

  const url = `${baseUrl}/api/services?page=1&per_page=20&search=${search}&category=${
    value !== 0 ? value : ""
  }&price_start=${start_pri}&price_end=${end_pri}&creator=${getCreatorId}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      let card_service = "";
      let categories = new Map();

      if (data.data.length > 0) {
        firstId = data.data[0].id;
        console.log("First Service ID:", firstId);
      }

      data.data.forEach((element) => {
        if (element.category && !categories.has(element.category.id)) {
          categories.set(element.category.id, element.category.name);
        }

        if (element.price >= start_pri && element.price <= end_pri) {
          card_service += `
              <div class="col-12 col-sm-6 col-md-4 col-lg-3 service-item" data-category="${
                element.category ? element.category.id : ""
              }">
                  <div class="card service-card" 
                    data-service-id="${element.id}" 
                    data-service="${element.name}" 
                    data-price="${element.price}"
                    data-category-name="${
                      element.category ? element.category.name : ""
                    }"
                  >
                    <div class="card-img-container">
                      <img src="${element.image}" alt="" class="card-img" />
                    </div>
                    <div class="card-content">
                      <h5 class="card-title">${element.name}</h5>
                      <p class="card-price">${element.price}៛</p>
                      <p class="card-description text-truncate">
                        ${
                          element.description ||
                          "Description of the dish goes here."
                        }
                      </p>
                      <button onclick='AddToCart(this)' class="add-to-cart-btn">
                        <i class="bi bi-cart-plus"></i> បន្ថែម
                      </button>
                    </div>
                </div>
              </div>`;
        }
      });
      document.querySelector("#all").innerHTML = card_service;
      document.getElementById("animation-overlay").style.display = "none";

      let categoryNav = `
        <li class="nav-item" role="presentation">
          <a class="nav-link active" href="#" onclick="filterServices(0, this, event)">ទាំងអស់</a>
        </li>
      `;

      categories.forEach((name, id) => {
        categoryNav += `
          <li class="nav-item" role="presentation">
            <a class="nav-link" href="#" onclick="filterServices(${id}, this, event)">${name}</a>
          </li>
        `;
      });

      document.querySelector("#categoryNav").innerHTML = categoryNav;

      let storeInfo = ` `;
      if (data.data.length > 0 && data.data[0].creator) {
        let store = data.data[0].creator;
        let storeInfo = `
          <h1 id="store_name" class="store-title text-dark-emphasis">${store.name}</h1>
          <p id="store_des" class="fs-18">
              <i class="bi bi-shop"></i> សូមស្វាគមន៏មកកាន់ហាងរបស់យើងខ្ញុំ។
          </p>
          <a href="${store.google_map_url}" id="store_map" class="text-primary fs-18 text-decoration-none">
            <i class="bi bi-geo-alt"></i>  ទីតាំងហាងរបស់យើង
          </a>
        `;
        document.getElementById("storeInfo").innerHTML = storeInfo;
        document.querySelector(
          ".bg-store"
        ).style.backgroundImage = `url('${localStorage.getItem(
          "store_profile"
        )}')`;

        document.querySelector(
          ".bg-store"
        ).style.backgroundImage = `url('${localStorage.getItem(
          "store_profile"
        )}')`;
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

getCategory();

// filter service price
function filterServices(categoryId, element, event) {
  event.preventDefault();
  let start_pri = parseFloat(document.querySelector(".input-min").value) || 0;
  let end_pri = parseFloat(document.querySelector(".input-max").value) || 99999;

  document
    .querySelectorAll("#categoryNav .nav-link")
    .forEach((link) => link.classList.remove("active"));
  element.classList.add("active");

  document.querySelectorAll(".service-item").forEach((item) => {
    let itemPrice = parseFloat(
      item.querySelector(".card-price").textContent.replace("$", "")
    );
    if (
      (categoryId === 0 || item.getAttribute("data-category") == categoryId) &&
      itemPrice >= start_pri &&
      itemPrice <= end_pri
    ) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}
window.filterServices = filterServices;
// Synchronize input-min and input-max with range sliders
document.querySelector(".range-min").addEventListener("input", function () {
  document.querySelector(".input-min").value = this.value;
  getCategory();
});

document.querySelector(".range-max").addEventListener("input", function () {
  document.querySelector(".input-max").value = this.value;
  getCategory();
});

document.querySelector(".input-min").addEventListener("input", function () {
  document.querySelector(".range-min").value = this.value;
  getCategory();
});

document.querySelector(".input-max").addEventListener("input", function () {
  document.querySelector(".range-max").value = this.value;
  getCategory();
});
function searchServices() {
  const searchTerm = document.getElementById("searchInput").value;
  getCategory(0, searchTerm);
}

document
  .getElementById("searchInput")
  .addEventListener("keyup", searchServices);

// -------------- add to cart -------------
function AddToCart(button) {
  if (!UserToken) {
    const currentPath = window.location.href;
    const basePath = currentPath.substring(0, currentPath.indexOf("/src/") + 1);
    location.href = `${basePath}src/views/auth/login.html`;
    return;
  }

  const card = button.closest(".service-card");
  const serviceId = card.dataset.serviceId;
  const newCreatorId = getCreatorId;

  console.log("Adding to cart:", serviceId);

  const formData = new FormData();
  formData.append("service_id", serviceId);
  formData.append("qty", 1);

  const originalText = '<i class="bi bi-cart-plus"></i> បន្ថែម';
  button.innerHTML = "កំពុងបន្ថែម...";
  button.disabled = true;

  // Fetch the current cart to check the creator
  fetch(`${baseUrl}/api/profile/carts`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${UserToken}`,
      Accept: "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch cart.");
      }
      return response.json();
    })
    .then(async (cartData) => {
      const currentCart = cartData.data.items;

      // If the cart is not empty, check the creator ID
      if (currentCart.length > 0) {
        const existingCreatorId = currentCart[0].service.creator.id;

        if (existingCreatorId === parseInt(newCreatorId)) {
          console.log("Creator ID matches. Adding new item to cart.");
        } else {
          console.log(
            "Creator ID differs. Clearing cart before adding new item."
          );
          for (const item of currentCart) {
            await fetch(`${baseUrl}/api/carts/${item.id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${UserToken}`,
                Accept: "application/json",
              },
            });
          }
        }
      }

      // Add the new service to the cart
      return fetch(`${baseUrl}/api/carts`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${UserToken}`,
        },
        body: formData,
      });
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to add to cart.");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Add to cart successful:", data);
      summaryCart();
    })
    .catch((error) => {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart. Please try again.");
    })
    .finally(() => {
      // Restore button state
      button.innerHTML = originalText;
      button.disabled = false;
    });
}



window.AddToCart = AddToCart;

// ---------------- summary cart -------------------------------

// Function to fetch the cart from the server
async function summaryCart() {
  try {
    const response = await fetch(`${baseUrl}/api/profile/carts`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${UserToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch cart items.");
    }

    const data = await response.json();
    localCart = data.data.items.map((item) => ({
      id: item.id,
      serviceId: item.service.id,
      name: item.service.name,
      price: Number(item.price),
      qty: Number(item.qty),
      image: item.service.image,
    }));

    renderCart();
  } catch (error) {
    console.error("Error fetching cart items:", error);
  }
}

function renderCart() {
  cartItemsDiv.innerHTML = "";
  let total = 0;

  if (localCart.length === 0) {
    cartItemsDiv.innerHTML = `
      <div class="text-center d-flex flex-column justify-content-center h-100 p-4">
        <img src="https://thumbs.dreamstime.com/b/laundry-wash-cleaning-icons-black-white-laundry-wash-cleaning-dirty-clothes-basket-washing-machine-icon-152344297.jpg" alt="Empty Cart" class="img-fluid mx-auto" style="width: 150px; height:auto;">
        <div class="text-center">
          <i class="bi bi-cart text-muted me-2" style="font-size: 1.5rem;"></i>
          <p class="mt-2">សូមបន្ថែមសេវាកម្មទៅកាន់កន្ត្រាក់របស់អ្នក!</p>
        </div>
      </div>`;
    totalPriceDiv.textContent = "Total: 0.00៛";
    checkoutButton.disabled = true;
    return;
  }

  localCart.forEach((item, index) => {
    total += item.price * item.qty;

    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item mb-3 border-bottom pb-2";
    itemDiv.innerHTML = `
      <div class="d-flex justify-content-between w-100 align-items-center gap-2">
        <div class="cart-item-image" style="width: 50px; height: 50px; min-width: 50px;">
          <img src="${item.image}" alt="${
      item.name
    }" class="rounded w-100 h-100 object-fit-cover">
        </div>
        <div class="d-flex flex-column flex-grow-1">
          <div class="d-flex justify-content-between align-items-center w-100">
            <div class="text-truncate d-flex flex-column align-items-center pe-2 ps-3" style="max-width: 150px;">
              <div>${item.name}</div>
              <div>${item.price.toFixed(2)}៛</div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <button class="decrease-cart btn btn-sm btn-primary rounded-circle decrease-btn" ${
                item.qty === 1 ? "disabled" : ""
              }>-</button>
              <span class="quantity cart-quantity">${item.qty}</span>
              <button class="increase-cart btn btn-sm btn-outline-primary rounded-circle increase-btn">+</button>
              <button class="btn btn-link text-danger ps-2 fs-5 p-0 delete-btn">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Event listeners for buttons
    const decreaseBtn = itemDiv.querySelector(".decrease-btn");
    const increaseBtn = itemDiv.querySelector(".increase-btn");
    const deleteBtn = itemDiv.querySelector(".delete-btn");

    decreaseBtn.addEventListener("click", () => {
      if (item.qty > 1) {
        item.qty -= 1;
      } else {
        localCart.splice(index, 1);
      }
      renderCart();
    });

    increaseBtn.addEventListener("click", () => {
      item.qty += 1;
      renderCart();
    });

    deleteBtn.addEventListener("click", async () => {
      console.log("Removing item...");

      // Save the original icon HTML
      const originalIcon = deleteBtn.innerHTML;

      // Replace the icon with the spinner
      deleteBtn.innerHTML =
        '<span class="spinner-grow spinner-grow-sm text-danger" role="status" aria-hidden="true"></span>';
      deleteBtn.disabled = true;

      try {
        // Send DELETE request to the server
        const response = await fetch(`${baseUrl}/api/carts/${item.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${UserToken}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to remove item from the server.");
        }

        // Remove item from the localCart array
        localCart.splice(index, 1);
        renderCart();
      } catch (error) {
        console.error("Error removing item:", error);
        alert("Failed to remove item. Please try again.");
      } finally {
        deleteBtn.innerHTML = originalIcon;
        deleteBtn.disabled = false;
      }
    });

    cartItemsDiv.appendChild(itemDiv);
  });

  totalPriceDiv.textContent = `Total: ${total.toFixed(2)}៛`;
  checkoutButton.disabled = false;
}

async function updateCartOnServer() {
  const updateButton = document.getElementById("updateCartButton");
  const originalText = updateButton.textContent;

  updateButton.textContent = "កំពុងកែប្រែ...";
  updateButton.disabled = true;

  try {
    for (const item of localCart) {
      await fetch(`${baseUrl}/api/carts/${item.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${UserToken}`,
          Accept: "application/json",
        },
      });
    }

    // Re-add items with updated quantities
    for (const item of localCart) {
      const formData = new FormData();
      formData.append("service_id", item.serviceId);
      formData.append("qty", item.qty);

      await fetch(`${baseUrl}/api/carts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${UserToken}`,
          Accept: "application/json",
        },
        body: formData,
      });
    }

    await summaryCart();
  } catch (error) {
    console.error("Failed to update cart:", error);
    alert("Failed to update cart. Please try again.");
  } finally {
    // Restore original text and re-enable button
    updateButton.textContent = originalText;
    updateButton.disabled = false;
  }
}

summaryCart();

updateCartButton.addEventListener("click", updateCartOnServer);


checkoutButton.addEventListener("click", () => {
  const currentPath = window.location.href;
  const basePath = currentPath.substring(0, currentPath.indexOf("/src/") + 1);
  location.href = `${basePath}src/views/page/payment.html`;
});