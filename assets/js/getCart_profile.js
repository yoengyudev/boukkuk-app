import { baseUrl } from "./baseUrl.js";
import { UserToken } from "./tokens.js";

const cartItemsDiv = document.getElementById("cart_profile");
const serviceCards = document.querySelectorAll(".service-card");
const totalPriceDiv = document.getElementById("total-price");
const checkoutButton = document.getElementById("checkout-button");
const checkoutSummary = totalPriceDiv?.closest(".check-out-store");
const tabs = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".service-section");
let getCreatorId = sessionStorage.getItem("creator_id");
let localCart = [];

function setCartActionsVisible(hasItems) {
  if (checkoutSummary) {
    checkoutSummary.hidden = !hasItems;
  }

  if (checkoutButton) {
    checkoutButton.disabled = !hasItems;
  }
}

setCartActionsVisible(false);

function groupCartItems(items) {
  const groupedItems = new Map();

  items.forEach((item) => {
    const serviceId = item.service.id;
    const existing = groupedItems.get(serviceId);

    if (existing) {
      existing.qty += Number(item.qty);
      existing.ids.push(item.id);
      return;
    }

    groupedItems.set(serviceId, {
      id: item.id,
      ids: [item.id],
      serviceId,
      name: item.service.name,
      price: Number(item.price),
      qty: Number(item.qty),
      image: item.service.image,
    });
  });

  return Array.from(groupedItems.values());
}

async function updateCartItemQuantity(item, qty) {
  const response = await fetch(`${baseUrl}/api/carts/${item.id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${UserToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ qty }),
  });

  if (!response.ok) {
    throw new Error("Failed to update cart item.");
  }

  await summaryCart();
}

async function removeCartItem(item) {
  const ids = item.ids || [item.id];

  for (const id of ids) {
    const response = await fetch(`${baseUrl}/api/carts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${UserToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to remove item from the server.");
    }
  }

  await summaryCart();
}

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
      localCart = groupCartItems(data.data.items || []);
  
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
      setCartActionsVisible(false);
      return;
    }
  
    localCart.forEach((item, index) => {
      total += item.price * item.qty;
  
      const itemDiv = document.createElement("div");
      itemDiv.className = "cart-item mb-3 pb-2";
      itemDiv.innerHTML = `
      <div class="row cart_pro gy-2 pb-2">
                      <div class="col-12 col-sm-5 d-flex align-items-center justify-content-center justify-content-sm-start">
                        <div class="cart-item-image" style="width: 70px; height: 70px; min-width: 0px;">
                          <img src="${item.image}" alt="${item.name}"
                            class="rounded w-100 h-100 object-fit-cover">
                        </div>
                        <div class="text-truncate d-flex flex-column align-items-start pe-2 ps-3"
                          style="max-width: 150px;">
                          <div class="fs-5">${item.name}</div>
                          <div>${item.price.toFixed(2)}៛</div>
                        </div>
                      </div>
                      <div class="col-12 col-sm-7 d-flex align-items-center justify-content-center justify-content-sm-end">
                        <button class="btn btn-cart p-0 btn-primary decrease-btn" ${item.qty === 1 ? "disabled" : ""}>-</button>
                          <span class="quantity cart-quantity">${item.qty}</span>
                          <button class="btn btn-cart p-0 increase-btn">+</button>
                          <button class="btn btn-link text-danger delete-btn">
                            <i class="bi bi-trash"></i>
                          </button>
                      </div>
                    </div>
      `;
  
      // Event listeners for buttons
      const decreaseBtn = itemDiv.querySelector(".decrease-btn");
      const increaseBtn = itemDiv.querySelector(".increase-btn");
      const deleteBtn = itemDiv.querySelector(".delete-btn");
  
      decreaseBtn.addEventListener("click", async () => {
        decreaseBtn.disabled = true;
        increaseBtn.disabled = true;

        try {
          await updateCartItemQuantity(item, item.qty - 1);
        } catch (error) {
          console.error("Error updating cart item:", error);
          await summaryCart();
        }
      });
  
      increaseBtn.addEventListener("click", async () => {
        decreaseBtn.disabled = true;
        increaseBtn.disabled = true;

        try {
          await updateCartItemQuantity(item, item.qty + 1);
        } catch (error) {
          console.error("Error updating cart item:", error);
          await summaryCart();
        }
      });
  
      deleteBtn.addEventListener("click", async () => {
        console.log("Removing item");
  
        // Save the original icon HTML
        const originalIcon = deleteBtn.innerHTML;
  
        // Replace the icon with the spinner
        deleteBtn.innerHTML =
          '<span class="spinner-grow spinner-grow-sm text-danger" role="status" aria-hidden="true"></span>';
        deleteBtn.disabled = true;
  
        try {
          await removeCartItem(item);
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
    setCartActionsVisible(true);
  }
  
  summaryCart();
  
  checkoutButton.addEventListener("click", () => {
    const currentPath = window.location.href;
    const basePath = currentPath.substring(0, currentPath.indexOf("/src/") + 1);
    location.href = `${basePath}src/views/page/payment.html`;
  });
