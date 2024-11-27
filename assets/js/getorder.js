import { AdminToken, UserToken } from "./tokens.js";
import { baseUrl } from "./baseUrl.js";
import {
  modalContent,
  togglePasswordVisibility,
  initInformationForm,
  adminModalContent,
  initAdminInformationForm,
  initPasswordForm,
} from "./updateUserInfo.js";

// Make functions available globally
window.togglePasswordVisibility = togglePasswordVisibility;
window.initInformationForm = initInformationForm;

// Add these export functions
function exportToCsv(data) {
  // Define CSV headers
  const headers = [
    "Service Name",
    "Quantity",
    "Customer Name",
    "Customer Email",
    "Customer Phone",
    "Status",
    "Total Price",
    "Order Date",
  ];

  // Convert data to CSV rows
  const rows = data.map((order) => [
    `"${order.service.name}"`, // Wrap in quotes to handle commas
    order.qty,
    `"${order.buyer.name}"`,
    `"${order.buyer.email}"`,
    `"${order.buyer.phone}"`,
    `"${getStatusText(order.payment_status)}"`,
    `"${order.price ? order.price.toFixed(2) : "0.00"}៛"`,
    `"${new Date(order.created_at).toLocaleString()}"`,
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  // Create a Blob with UTF-8 BOM
  const blob = new Blob([`\uFEFF${csvContent}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `orders_${new Date().toISOString().split("T")[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function exportToExcel(data) {
  // Create workbook data with phone number
  const workbookData = [
    [
      "Service Name",
      "Quantity",
      "Customer Name",
      "Customer Email",
      "Customer Phone",
      "Status",
      "Total Price",
      "Order Date",
    ],
    ...data.map((order) => [
      order.service.name,
      order.qty,
      order.buyer.name,
      order.buyer.email,
      order.buyer.phone,
      getStatusText(order.payment_status),
      `${order.price ? order.price.toFixed(2) : "0.00"}៛`,
      new Date(order.created_at).toLocaleString(),
    ]),
  ];

  // Convert to worksheet format
  const ws = XLSX.utils.aoa_to_sheet(workbookData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Orders");

  // Generate and download file
  XLSX.writeFile(wb, `orders_${new Date().toISOString().split("T")[0]}.xlsx`);
}

// Add event listeners for export buttons
document.addEventListener("DOMContentLoaded", () => {
  fetchOrders();

  document.getElementById("exportCsvBtn").addEventListener("click", () => {
    if (orderData.length > 0) {
      exportToCsv(orderData);
    } else {
      alert("No data available to export");
    }
  });

  document.getElementById("exportExcelBtn").addEventListener("click", () => {
    if (orderData.length > 0) {
      exportToExcel(orderData);
    } else {
      alert("No data available to export");
    }
  });
});

// Helper function to get status text
function getStatusText(status) {
  const statusMapping = {
    1: "Pending",
    2: "Approved",
    3: "Rejected",
  };
  return statusMapping[status] || "Unknown";
}

// Modify fetchOrders to store the data globally
let orderData = []; // Add this at the top of your file

document.addEventListener("DOMContentLoaded", fetchOrders);

function fetchOrders() {
  const url = `${baseUrl}/api/profile/payment-check?page=1&per_page=20&payment_status=`;

  fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${AdminToken}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Store the data globally
      orderData = data.data;

      console.log("API Response:", data);

      const tableBody = document.getElementById("order_table");
      tableBody.innerHTML = "";

      if ($.fn.DataTable.isDataTable("#getorder_table")) {
        $("#getorder_table").DataTable().destroy();
      }

      const statusMapping = {
        1: { text: "Pending", class: "text-warning" },
        2: { text: "Approved", class: "text-success" },
        3: { text: "Rejected", class: "text-danger" },
      };

      data.data.forEach((order) => {
        const tr = document.createElement("tr");
        const status = statusMapping[order.payment_status] || {
          text: "Unknown",
          class: "text-secondary",
        };

        tr.innerHTML = `
                    <td class="text-start">
                        <div class="d-flex align-items-center gap-2">
                            <div class="service_img shadow">
                                <img src="${
                                  order.service.image
                                }" width="50" alt="Service">
                            </div>
                            <div class="d-flex flex-column">
                                <span class="fw-medium text-start">${
                                  order.service.name
                                }</span>
                                <span class="text-dark-emphasis">Qty : ${
                                  order.qty
                                }</span>
                            </div>
                        </div>
                    </td>
                    <td class="text-start">
                        <div class="d-flex align-items-center gap-2">
                            <div class="profile_cus">
                                <img src="${
                                  order.buyer.avatar
                                }" width="50" alt="Customer">
                            </div>
                            <div class="d-flex flex-column">
                                <span class="fw-medium text-start">${
                                  order.buyer.name
                                }</span>
                                <span class="text-dark-emphasis">${
                                  order.buyer.email
                                }</span>
                            </div>
                        </div>
                    </td>
                    <td class="text-start">
                        <span class="${status.class}">${status.text}</span>
                    </td>
                    <td class="text-start">${
                      order.price ? order.price.toFixed(2) : "0.00"
                    }៛</td>
                    <td class="text-end">
                        <button class="btn btn-primary btn-sm px-3 py-1 payment-details-btn" onclick="PaymentDetails(${
                          order.id
                        })" data-bs-toggle="modal" data-bs-target="#detailPayment">
                            <i class="bi bi-eye"></i>
                        </button>
                    </td>
                `;

        tableBody.appendChild(tr);
      });

      $("#getorder_table").DataTable({
        responsive: true,
      });
    })
    .catch((error) => {
      console.error("Error fetching orders:", error);
    });
}

// get detail

function PaymentDetails(orderId) {
  const approveBtn = document.getElementById("approveBtn");
  const rejectBtn = document.getElementById("rejectBtn");
  const upStateBtn = document.getElementById("upStateBtn");
  const updPickupBtn = document.getElementById("updPickupBtn");

  approveBtn.setAttribute("data-order-id", orderId);
  rejectBtn.setAttribute("data-order-id", orderId);
  upStateBtn.setAttribute("data-order-id", orderId);
  updPickupBtn.setAttribute("data-order-id", orderId);

  const modalContent = document.getElementById("modalContent");
  const loader = document.getElementById("loader");
  let pedding = document.getElementById("pedding");
  let approve = document.getElementById("approve");
  let reject = document.getElementById("reject");
  const placed_order = document.getElementById("placedOrder");
  const laundry_pickup = document.getElementById("laundryPickUp");
  const in_process = document.getElementById("inProcess");
  const pro_iron = document.getElementById("processToIron");
  const ironing = document.getElementById("ironing");
  const ready_delivery = document.getElementById("readyForDelivery");
  const outForDelivery = document.getElementById("outForDelivery");
  const delivered = document.getElementById("delivered");
  let buyer_name = document.getElementById("buyer_name");
  let buyer_email = document.getElementById("buyer_email");
  let buyer_phone = document.getElementById("buyer_phone");
  let buyer_loc = document.getElementById("buyer_loc");
  let buyer_add = document.getElementById("buyer_add");
  let ser_img = document.getElementById("ser_img");
  let ser_dec = document.getElementById("ser_dec");
  let ser_name = document.getElementById("ser_name");
  let ser_categ = document.getElementById("ser_categ");
  let ser_price = document.getElementById("ser_pri");
  let ser_dis = document.getElementById("ser_dis");

  const url = `${baseUrl}/api/payments/${orderId}`;
  console.log(orderId, url);

  loader.style.display = "block";
  modalContent.style.display = "none";

  fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${AdminToken}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Payment Details:", data);
      document
        .querySelectorAll("input[name='paymentStatus']")
        .forEach((input) => {
          input.checked = parseInt(input.value) === data.data.payment_status;
        });

      document
        .querySelectorAll("input[name='serviceStatus']")
        .forEach((input) => {
          input.checked = parseInt(input.value) === data.data.service_status;
        });

      if (data.data.payment_status === 1) {
        pedding.checked = true;
      } else if (data.data.payment_status === 2) {
        approve.checked = true;
      } else if (data.data.payment_status === 3) {
        reject.checked = true;
      }

      if (data.data.service_status === 1) {
        placed_order.checked = true;
      } else if (data.data.service_status === 2) {
        laundry_pickup.checked = true;
      } else if (data.data.service_status === 3) {
        in_process.checked = true;
      } else if (data.data.service_status === 4) {
        pro_iron.checked = true;
      } else if (data.data.service_status === 5) {
        ironing.checked = true;
      } else if (data.data.service_status === 6) {
        ready_delivery.checked = true;
      } else if (data.data.service_status === 7) {
        out_for_delivery.checked = true;
      } else if (data.data.service_status === 8) {
        delivered.checked = true;
      }

      document.getElementById("datePickup").value = data.data.pickup_schedule;

      buyer_img.src = data.data.buyer.avatar;
      buyer_name.innerHTML = data.data.buyer.name;
      buyer_email.innerHTML = data.data.buyer.email;
      buyer_phone.innerHTML = data.data.buyer.phone;
      buyer_loc.innerHTML =
        data.data.buyer.latitude + "," + data.data.buyer.longitude;
      buyer_add.href = data.data.buyer.google_map_url;

      ser_img.src = data.data.service.image;
      ser_dec.innerHTML = data.data.service.description;
      ser_name.innerHTML = data.data.service.name;
      ser_categ.innerHTML = data.data.service.category.name;
      ser_price.innerHTML = data.data.service.price + "៛";
      ser_dis.innerHTML = data.data.service.discount
        ? `$${data.data.service.discount}`
        : "No Discount";

      document.getElementById("order_id").innerHTML = data.data.id;
      document.getElementById("order_Qty").innerHTML = data.data.qty;
      document.getElementById("total_price").innerHTML =
        data.data.qty * data.data.price + "៛";
      document.getElementById("order_date").innerHTML = new Date(
        data.data.created_at
      ).toLocaleString();

      document.getElementById("tran_img").src = data.data.transaction_file;
      document.getElementById("tran_imgBlank").href =
        data.data.transaction_file;
    })
    .catch((error) => {
      console.error("Error fetching payment details:", error);
      modalContent.innerHTML = `<p class="text-danger">Failed to fetch payment details. Please try again later.</p>`;
    })
    .finally(() => {
      loader.style.display = "none";
      modalContent.style.display = "block";
    });
}

window.PaymentDetails = PaymentDetails;

// approve================
document.getElementById("approveBtn").addEventListener("click", function () {
  const approveSpinner = document.getElementById("approveSpinner");
  const approveText = document.getElementById("approveText");
  const approveBtn = document.getElementById("approveBtn");

  approveSpinner.style.display = "inline-block";
  approveText.textContent = "Saving...";
  approveBtn.disabled = true;

  const orderId = approveBtn.getAttribute("data-order-id");

  function approve(orderId) {
    const url = `${baseUrl}/api/payments/approve/${orderId}`;
    console.log(orderId, url);

    fetch(url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${AdminToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Payment Approved:", data);
        alert("Payment has been successfully approved!");
        $("#detailPayment").modal("hide");
      })
      .catch((error) => {
        console.error("Error approving payment:", error);
        alert("Failed to approve payment. Please try again later.");
      })
      .finally(() => {
        // Reset button state
        approveText.textContent = "Save";
        approveSpinner.style.display = "none";
        approveBtn.disabled = false;
      });
  }
  approve(orderId);
});

// Reject ===================================
document.getElementById("rejectBtn").addEventListener("click", function () {
  const approveSpinner = document.getElementById("rejectSpinner");
  const approveText = document.getElementById("rejectText");
  const approveBtn = document.getElementById("rejectBtn");

  approveSpinner.style.display = "inline-block";
  approveText.textContent = "Rejecting...";
  approveBtn.disabled = true;

  const orderId = rejectBtn.getAttribute("data-order-id");

  function reject(orderId) {
    const url = `${baseUrl}/api/payments/reject/${orderId}`;
    console.log(orderId, url);

    fetch(url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${AdminToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Payment Reject:", data);
        alert("Payment has been successfully approved!");
        $("#detailPayment").modal("hide");
      })
      .catch((error) => {
        console.error("Error approving payment:", error);
        alert("Failed to approve payment. Please try again later.");
      })
      .finally(() => {
        // Reset button state
        approveText.textContent = "Reject";
        approveSpinner.style.display = "none";
        approveBtn.disabled = false;
      });
  }
  reject(orderId);
});

// update service status
document.getElementById("upStateBtn").addEventListener("click", function () {
  const approveSpinner = document.getElementById("upStateSpinner");
  const approveText = document.getElementById("upStateText");
  const approveBtn = document.getElementById("upStateBtn");

  const selectedStatus = document.querySelector(
    "input[name='serviceStatus']:checked"
  );

  if (!selectedStatus) {
    alert("Please select a service status before saving.");
    return;
  }

  const statusValue = selectedStatus.value;

  approveSpinner.style.display = "inline-block";
  approveText.textContent = "Updating...";
  approveBtn.disabled = true;

  const orderId = approveBtn.getAttribute("data-order-id");
  console.log("Updating service status for Order ID:", orderId);

  function updSttService(orderId) {
    const url = `${baseUrl}/api/payments/set-status/${orderId}`;
    console.log("PUT request to URL:", url);

    fetch(url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${AdminToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ service_status: statusValue }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Service Status Updated:", data);
        if (data.result) {
          alert(`Service status updated successfully for Order ID: ${orderId}`);
          $("#detailPayment").modal("hide"); // Close the modal
        } else {
          alert(data.message || "Failed to update service status.");
        }
      })
      .catch((error) => {
        console.error("Error updating service status:", error);
        alert("Failed to update service status. Please try again later.");
      })
      .finally(() => {
        // Reset button state
        approveText.textContent = "Update service status";
        approveSpinner.style.display = "none";
        approveBtn.disabled = false;
      });
  }
  updSttService(orderId);
});

// update pickup schedule

document.getElementById("updPickupBtn").addEventListener("click", function () {
  const approveSpinner = document.getElementById("upPickupSpinner");
  const approveText = document.getElementById("upPickupText");
  const approveBtn = document.getElementById("updPickupBtn");

  // Fetch the selected date and time from the input
  const pickupDateInput = document.getElementById("datePickup").value;

  if (!pickupDateInput) {
    alert("Please select a valid date and time for the pickup schedule.");
    return;
  }

  // Custom function to format date as "YYYY-MM-DD HH:MM:SS"
  function formatDateToApi(inputDate) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  const pickupDate = formatDateToApi(pickupDateInput);
  console.log("Formatted pickup date:", pickupDate);

  approveSpinner.style.display = "inline-block";
  approveText.textContent = "Updating...";
  approveBtn.disabled = true;

  const orderId = approveBtn.getAttribute("data-order-id");
  console.log("Updating pickup schedule for Order ID:", orderId);

  function upPickUpShe(orderId) {
    const url = `${baseUrl}/api/payments/set-pickup-schedule/${orderId}`;
    console.log("PUT request to URL:", url);

    fetch(url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${AdminToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pickup_schedule: pickupDate }),
    })
      .then((response) => {
        if (!response.ok) {
          // Attempt to read the response to get more details
          return response.json().then((errData) => {
            throw new Error(
              `HTTP error! status: ${response.status} - ${
                errData.message || "Unknown error"
              }`
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Pickup status updated:", data);
        if (data.result) {
          alert(
            `Pickup schedule updated successfully for Order ID: ${orderId}`
          );
          $("#detailPayment").modal("hide");
        } else {
          alert(data.message || "Failed to update pickup schedule.");
        }
      })
      .catch((error) => {
        console.error("Error updating pickup schedule:", error);
        alert("Failed to update pickup schedule. Please try again later.");
      })
      .finally(() => {
        approveText.textContent = "Update Pickup Schedule";
        approveSpinner.style.display = "none";
        approveBtn.disabled = false;
      });
  }
  upPickUpShe(orderId);
});
