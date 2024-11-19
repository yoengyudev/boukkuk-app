import { baseUrl } from './baseUrl.js';
import { UserToken } from './tokens.js'
document.addEventListener("DOMContentLoaded", function () {
  const serviceCards = document.querySelectorAll(".service-card");
  const cartItemsDiv = document.getElementById("cart-items");
  const totalPriceDiv = document.getElementById("total-price");
  const checkoutButton = document.getElementById("checkout-button");
  const tabs = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".service-section");
  let cart = [];
  let total = 0;

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

  // Initialize all service cards with their category
  serviceCards.forEach((card) => {
    const category = card
      .closest(".service-section")
      .getAttribute("data-category");
    const serviceName = card.getAttribute("data-service");
    // Add category as data attribute to the card
    card.setAttribute("data-category", category);

    // Create unique ID combining category and service name
    const uniqueId = `${category}-${serviceName}`;
    card.setAttribute("data-unique-id", uniqueId);

    // Add click handlers to the buttons
    const decreaseBtn = card.querySelector(".decrease");
    const increaseBtn = card.querySelector(".increase");
    const quantitySpan = card.querySelector(".quantity");

    decreaseBtn.addEventListener("click", () => {
      const currentQty = parseInt(quantitySpan.textContent);
      if (currentQty > 0) {
        updateCart(card, currentQty - 1);
      }
    });

    increaseBtn.addEventListener("click", () => {
      const currentQty = parseInt(quantitySpan.textContent);
      updateCart(card, currentQty + 1);
    });
  });

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

  function updateCart(card) {
    const serviceId = parseInt(card.dataset.serviceId);
    const serviceName = card.dataset.service;
    const servicePrice = parseFloat(card.dataset.price);
    const serviceImage = card.querySelector('img')?.src || '';

    const existingItem = cart.find(item => item.id === serviceId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: serviceId,
        name: serviceName,
        price: servicePrice,
        quantity: 1,
        image: serviceImage
      });
    }

    sessionStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
  }

  function calculateTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  function renderCart() {
    cartItemsDiv.innerHTML = "";
    if (cart.length === 0) {
      cartItemsDiv.innerHTML = `
        <div class="text-center d-flex flex-column justify-content-center h-100 p-4">
          <img src="https://thumbs.dreamstime.com/b/laundry-wash-cleaning-icons-black-white-laundry-wash-cleaning-dirty-clothes-basket-washing-machine-icon-152344297.jpg" alt="Empty Cart" class="img-fluid mx-auto" style="width: 150px; height:auto;">
          <div class="text-center">
            <i class="bi bi-cart text-muted me-2" style="font-size: 1.5rem;"></i>
            <p class="mt-2">សូមបន្ថែមសេវាកម្មទៅកាន់កន្ត្រាក់របស់អ្នក!</p>
          </div>
        </div>`;
      totalPriceDiv.textContent = "Total: $0.00";
      checkoutButton.disabled = true;
    } else {
      cart.forEach((item) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "cart-item mb-3 border-bottom pb-2";
        itemDiv.setAttribute("data-unique-id", item.uniqueId);

        itemDiv.innerHTML = `
          <div class="d-flex justify-content-between w-100 align-items-center gap-2">
            <div class="cart-item-image" style="width: 50px; height: 50px; min-width: 50px;">
              <img src="${item.image}" alt="${item.name
          }" class="rounded w-100 h-100 object-fit-cover">
            </div>
            <div class="d-flex flex-column flex-grow-1">
              <div class="d-flex justify-content-between align-items-center w-100">
                <div class="text-truncate d-flex flex-column align-items-center pe-2 ps-3" style="max-width: 150px;">
                <div>
                ${item.name} 
                </div>
                <div>
$${item.price.toFixed(2)}              
                </div>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <button class="decrease-cart btn btn-sm btn-primary rounded-circle decrease-btn" 
                    >-</button>
                  <span class="quantity cart-quantity" >${item.quantity
          }</span>
                  <button class="increase-cart btn btn-sm btn-outline-primary rounded-circle increase-btn" 
                    >+</button>
                  <button class="btn btn-link text-danger ps-2 fs-5 p-0 delete-btn" >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;

        // Add event listeners for the buttons
        const deleteBtn = itemDiv.querySelector(".delete-btn");
        const decreaseBtn = itemDiv.querySelector(".decrease-btn");
        const increaseBtn = itemDiv.querySelector(".increase-btn");

        deleteBtn.addEventListener('click', () => {
          // Remove from cart array
          cart = cart.filter(cartItem => cartItem.id !== item.id);

          // Update localStorage
          sessionStorage.setItem('cart', JSON.stringify(cart));

          // Remove from DOM
          itemDiv.remove();

          // Update total
          total = calculateTotal();
          totalPriceDiv.textContent = `Total: $${total.toFixed(2)}`;

          // Check if cart is empty
          if (cart.length === 0) {
            renderCart();
          }
        });

        decreaseBtn.addEventListener("click", () => {
          const cartItem = cart.find(cartItem => cartItem.id === item.id);
          if (cartItem && cartItem.quantity > 1) {
            cartItem.quantity--;
            // Update sessionStorage
            sessionStorage.setItem('cart', JSON.stringify(cart));
            total = calculateTotal();
            renderCart();
          } else if (cartItem && cartItem.quantity === 1) {
            cart = cart.filter(cartItem => cartItem.id !== item.id);
            // Update sessionStorage
            sessionStorage.setItem('cart', JSON.stringify(cart));
            total = calculateTotal();
            renderCart();
          }
        });

        increaseBtn.addEventListener("click", () => {
          const cartItem = cart.find(cartItem => cartItem.id === item.id);
          if (cartItem) {
            cartItem.quantity++;
            // Update sessionStorage
            sessionStorage.setItem('cart', JSON.stringify(cart));
            total = calculateTotal();
            renderCart();
          }
        });

        cartItemsDiv.appendChild(itemDiv);
      });

      total = calculateTotal();
      totalPriceDiv.textContent = `Total: $${total.toFixed(2)}`;
      checkoutButton.disabled = false;
    }
  }

  function createButton(text, isDecrease, onClick) {
    const button = document.createElement("button");
    button.textContent = text;
    button.className = isDecrease
      ? "btn btn-circle decrease btn-primary"
      : "btn btn-circle increase btn-outline-primary";
    button.style.width = "30px";
    button.style.height = "30px";
    button.style.padding = "0";
    button.style.borderRadius = "50%";
    button.style.display = "flex";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";
    button.addEventListener("click", onClick);
    return button;
  }

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

  function setLoadingState(button, isLoading) {
    if (isLoading) {
      button.disabled = true;
      button.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        កំពុងដំណើរការ...
      `;
    } else {
      button.disabled = false;
      button.innerHTML = "ទូទាត់ទឹកប្រាក់";
    }
  }

  checkoutButton.addEventListener("click", function (event) {
    event.preventDefault();
    if (this.disabled || cart.length === 0) {
      alert("សូមបន្ថែមសេវាកម្មទៅកាន់កន្ត្រក់របស់អ្នក!");
      return;
    }

    setLoadingState(this, true);

    if (!UserToken) {
      alert('សូមធ្វើការ Login ជាមុនសិន!');
      window.location.href = 'login.html';
      return;
    }
    const requestData = {
      service_id: cart[0].id,  // Send the first item's service ID
      qty: cart[0].quantity    // Send the first item's quantity
    };

    fetch(`${baseUrl}/api/carts`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${UserToken}`
      },
      body: JSON.stringify(requestData)
    })
      .then(async response => {
        const data = await response.json();
        console.log('Server response:', data);

        if (!response.ok) {
          if (response.status === 422) {
            const errorMessage = data.message ||
              Object.values(data.data || {}).flat().join(', ') ||
              'Validation error occurred';
            throw new Error(errorMessage);
          }
          throw new Error('Network response was not ok');
        }

        return data;
      })
      .then(data => {
        console.log('Checkout successful:', data);
        cart = [];
        sessionStorage.removeItem('cart');
        renderCart();
        // Redirect to payment.html after successful checkout
        window.location.href = 'payment.html';
      })
      .catch(error => {
        console.error('Error during checkout:', error);
        alert(`មានបញ្ហាក្នុងការបញ្ជាទិញ: ${error.message}`);
      })
      .finally(() => {
        setLoadingState(checkoutButton, false);
      });
  });

  renderCart();

  // Add event listener for Add to Cart buttons
  document.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("add-to-cart-btn") ||
      e.target.closest(".add-to-cart-btn")
    ) {
      const card = e.target.closest(".service-card");
      if (card) {
        updateCart(card);
      }
    }
  });

  // Load cart from localStorage and calculate total
  const savedCart = sessionStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    total = calculateTotal(); // Calculate initial total
    renderCart();
  }
});

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
let firstId = ' ';
function getCategory(value = 0, search = '') {
  console.log("Selected Category:", value);
  console.log("Search Term:", search);
  let getCreatorId = localStorage.getItem("creator_id");
  let start_pri = document.querySelector(".input-min").value;
  let end_pri = document.querySelector(".input-max").value;

  const url = `${baseUrl}/api/services?page=1&per_page=20&search=${search}&category=${value !== 0 ? value : ""
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

      data.data.forEach(element => {
        if (element.category && !categories.has(element.category.id)) {
          categories.set(element.category.id, element.category.name);
        }


        if (element.price >= start_pri && element.price <= end_pri) {
          card_service += `
              <div class="col-12 col-sm-6 col-md-4 col-lg-3 service-item" data-category="${element.category ? element.category.id : ""
            }">
                  <div class="card service-card" 
                    data-service-id="${element.id}" 
                    data-service="${element.name}" 
                    data-price="${element.price}"
                    data-category-name="${element.category ? element.category.name : ""
            }"
                  >
                    <div class="card-img-container">
                      <img src="${element.image}" alt="" class="card-img" />
                    </div>
                    <div class="card-content">
                      <h5 class="card-title">${element.name}</h5>
                      <p class="card-price">$${element.price}</p>
                      <p class="card-description">
                        ${element.description ||
            "Description of the dish goes here."
            }
                      </p>
                      <button class="add-to-cart-btn">
                        <i class="bi bi-cart-plus"></i> បន្ថែម
                      </button>
                    </div>
                </div>
              </div>`;
        }
      });
      document.querySelector('#all').innerHTML = card_service;
      document.getElementById('animation-overlay').style.display = 'none';

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
        document.getElementById('storeInfo').innerHTML = storeInfo;
        document.querySelector('.bg-store').style.backgroundImage = `url('${localStorage.getItem('store_profile')}')`;

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

// When clearing the cart (after successful checkout)
function clearCart() {
  cart = [];
  sessionStorage.removeItem('cart');
  renderCart();
}

