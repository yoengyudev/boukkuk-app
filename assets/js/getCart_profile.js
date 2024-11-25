import { baseUrl } from "./baseUrl.js";
import { UserToken } from "./tokens.js";

const cartItemsDiv = document.getElementById("cart_profile");
const serviceCards = document.querySelectorAll(".service-card");
const totalPriceDiv = document.getElementById("total-price");
const checkoutButton = document.getElementById("checkout-button");
const tabs = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".service-section");
let getCreatorId = sessionStorage.getItem("creator_id");
let localCart = [];

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
        console.log("Removing item");
  
        // Save the original icon HTML
        const originalIcon = deleteBtn.innerHTML;
  
        // Replace the icon with the spinner
        deleteBtn.innerHTML =
          '<span class="spinner-grow spinner-grow-sm text-danger" role="status" aria-hidden="true"></span>';
        deleteBtn.disabled = true;
  
        try {
          // Send DELETE request to the server
          console.log('whatishsdafhasdhf',item.id);
          
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