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

  function updateCart(card, newQuantity) {
    const serviceName = card.dataset.service;
    const serviceCategory = card.dataset.category;
    const servicePrice = parseFloat(card.dataset.price);
    const uniqueId = `${serviceCategory}-${serviceName}`;
    const serviceImage = card.querySelector(".card-img").src;

    // Update card quantity
    const quantitySpan = card.querySelector(".quantity");
    quantitySpan.textContent = newQuantity;
    const decreaseButton = card.querySelector(".decrease");
    decreaseButton.disabled = newQuantity === 0;

    // Find existing item using uniqueId
    const existingItem = cart.find((item) => item.uniqueId === uniqueId);

    if (existingItem) {
      existingItem.quantity = newQuantity;
      if (newQuantity === 0) {
        cart = cart.filter((item) => item.uniqueId !== uniqueId);
      }
    } else if (newQuantity > 0) {
      cart.push({
        name: serviceName,
        category: serviceCategory,
        price: servicePrice,
        quantity: newQuantity,
        image: serviceImage,
        uniqueId: uniqueId,
      });
    }

    total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    renderCart();
  }

  function renderCart() {
    cartItemsDiv.innerHTML = "";
    if (cart.length === 0) {
      cartItemsDiv.innerHTML = `
              <div class="text- d-flex flex-column justify-content-center h-100 p-4">
              <img src="https://thumbs.dreamstime.com/b/laundry-wash-cleaning-icons-black-white-laundry-wash-cleaning-dirty-clothes-basket-washing-machine-icon-152344297.jpg" alt="Empty Cart" class="img-fluid" style="width: 150px; height:auto;">
                 <div class="text-center">
                  <i class="bi bi-cart text-muted me-2" style="font-size: 1.5rem;"></i>
                  <p class="mt-2">សូមបន្ថែមសេវាកម្មទៅកាន់កន្ត្រាក់របស់អ្នក!</p>                 </div>
              </div>`;
      totalPriceDiv.textContent = "Total: $0.00";
      setLoadingState(checkoutButton, false);
      checkoutButton.disabled = true;
    } else {
      cart.forEach((item) => {
        const itemDiv = document.createElement("div");
        itemDiv.className =
          "cart-item d-flex align-items-start justify-content-between mb-3";
        itemDiv.setAttribute("data-unique-id", item.uniqueId);

        const itemInfo = document.createElement("div");
        itemInfo.className = "d-flex justify-content-between align-items-center w-100 mt-3";
        itemInfo.textContent = `${item.category}: ${item.name
          } - $${item.price.toFixed(2)} x `;

        const controlsContainer = document.createElement("div");
        controlsContainer.className = "d-flex align-items-center gap-2";

        const quantityControl = document.createElement("div");
        quantityControl.className = "d-flex align-items-center";

        const decreaseButton = createButton("-", true, () => {
          if (item.quantity > 0) {
            const card = document.querySelector(
              `.service-card[data-unique-id="${item.uniqueId}"]`
            );
            if (card) {
              updateCart(card, item.quantity - 1);
            }
          }
        });

        const quantitySpan = document.createElement("span");
        quantitySpan.className = "quantity mx-2";
        quantitySpan.textContent = item.quantity;

        const increaseButton = createButton("+", false, () => {
          const card = document.querySelector(
            `.service-card[data-unique-id="${item.uniqueId}"]`
          );
          if (card) {
            updateCart(card, item.quantity + 1);
          }
        });

        // Create delete button
        const deleteButton = document.createElement("button");
        deleteButton.className = "btn btn-link text-danger p-0";
        deleteButton.innerHTML = '<i class="trash-icon-store bi bi-trash"></i>';
        deleteButton.style.fontSize = "1rem";
        deleteButton.addEventListener("click", () => {
          const card = document.querySelector(
            `.service-card[data-unique-id="${item.uniqueId}"]`
          );
          if (card) {
            updateCart(card, 0);
          }
        });

        quantityControl.appendChild(decreaseButton);
        quantityControl.appendChild(quantitySpan);
        quantityControl.appendChild(increaseButton);

        // Add both quantity controls and delete button to the container
        controlsContainer.appendChild(quantityControl);
        controlsContainer.appendChild(deleteButton);

        itemInfo.appendChild(controlsContainer);
        itemDiv.appendChild(itemInfo);
        cartItemsDiv.appendChild(itemDiv);
      });
      totalPriceDiv.textContent = `Total: $${total.toFixed(2)}`;
      setLoadingState(checkoutButton, false);
      checkoutButton.disabled = false;
    }
  }

  function createButton(text, isDecrease, onClick) {
    const button = document.createElement("button");
    button.textContent = text;
    button.className = isDecrease ? "btn btn-circle decrease btn-primary" : "btn btn-circle increase btn-outline-primary";
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
      button.innerHTML = 'ទូទាត់ទឹកប្រាក់';
    }
  }

  checkoutButton.addEventListener("click", function (event) {
    if (this.disabled) {
      event.preventDefault();
      alert("Please add items to your cart before checking out.");
    } else {
      event.preventDefault();
      setLoadingState(this, true);

      // Simulate loading time (you can remove setTimeout when integrating with real API)
      setTimeout(() => {
        window.location.href = "payment.html";
      }, 1000); // 1 second delay for demo
    }
  });

  renderCart();
});



// =================Get all service =================

// Function to fetch and display services based on category and search
function getCategory(value = 0, search = '') {
  console.log("Selected Category:", value);
  console.log("Search Term:", search);

  // Base URL and default parameters
  const baseUrl = 'https://mps10.chandalen.dev/api/services?page=1&per_page=20&search=&category=&price_start=5&price_end=20&creator=';
  const defaultParams = {
    page: 1,
    per_page: 20,
    search: search,
    price_start: 0,
    price_end: 99999,
    creator: ''
  };

  if (value !== 0) {
    defaultParams.category = value;
  }

  const queryString = new URLSearchParams(defaultParams).toString();
  const url = `${baseUrl}?${queryString}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      let card_service = '';
      if (data.data.length === 0) {
        card_service = `<div class="col-12 vh-100 d-flex align-items-center justify-content-center">
                          <h3>
                              សេវាកម្មនេះមិនមានទេ
                          </h3>
                        </div>`;
      } else {
        data.data.forEach(element => {
          card_service += `
            <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                <div class="card service-card" data-service="${element.name}" data-price="${element.price}">
                  <div class="card-img-container">
                    <img src="${element.image}" alt="" class="card-img" />
                  </div>
                  <div class="card-content">
                    <h5 class="card-title">${element.name}</h5>
                    <p class="card-price">$${element.price}</p>
                    <p class="card-description">
                      ${element.description || 'Description of the dish goes here.'}
                    </p>
                    <div class="quantity-control" style="display: flex; align-items: center; justify-content: center; margin-top: 10px;">
                      <button class="btn btn-circle decrease btn-primary">-</button>
                      <span class="quantity" style="width: 40px; text-align: center; margin: 0 5px">0</span>
                      <button class="btn btn-circle increase btn-outline-primary">+</button>
                    </div>
                  </div>
                </div>
            </div>
          `;
        });
      }
      document.querySelector('#all').innerHTML = card_service;
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
}
getCategory();

function searchServices() {
  const searchTerm = document.getElementById('searchInput').value;
  getCategory(0, searchTerm);
}
document.getElementById('searchInput').addEventListener('keyup', searchServices);


// all any categories 
const categories = [
  { id: 0, name: "ទាំងអស់" },
  { id: 1, name: "បោកសម្អាត" },
  { id: 2, name: "សម្ងួត" },
  { id: 3, name: "អ៊ុត" },
  { id: 4, name: "បត់និង​រៀបចំ" },
  { id: 5, name: "បោកស្ងួត" }
];

const serviceTabs = document.getElementById("serviceTabs");
serviceTabs.innerHTML = categories.map((category, index) => `
  <li class="nav-item" role="presentation">
    <a class="nav-link ${index === 0 ? 'active' : ''}" href="#${category.id}" data-id="${category.id}">
      ${category.name}
    </a>
  </li>
`).join("");

document.querySelectorAll("#serviceTabs .nav-link").forEach(tab => {
  tab.addEventListener("click", function (event) {
    event.preventDefault();
    document.querySelectorAll("#serviceTabs .nav-link").forEach(t => t.classList.remove("active"));

    this.classList.add("active");

    const categoryId = parseInt(this.getAttribute("data-id"), 10);
    getCategory(categoryId);
  });
});

getCategory(0); 
