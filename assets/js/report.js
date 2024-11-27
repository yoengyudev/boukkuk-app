import { AdminToken } from "./tokens.js";
import { baseUrl } from "./baseUrl.js";

let reportTable;
let orderData = [];

function fetchOrderReports() {
  const url = `${baseUrl}/api/profile/payment-check?page=1&per_page=1000`;
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
      if (data && data.data) {
        orderData = data.data.filter((order) => order.payment_status === 2);
        initializeTable(orderData);
      } else {
        orderData = [];
        initializeTable([]);
      }
    })
    .catch((error) => {
      console.error("Error fetching orders:", error);
      orderData = [];
      initializeTable([]);
    });
}

function updateTotals(data) {
  const totalOrders = data.length;
  const totalRevenue = data.reduce(
    (sum, order) => sum + order.price * order.qty,
    0
  );

  document.getElementById("totalOrders").textContent = totalOrders;
  document.getElementById("totalRevenue").textContent = `${totalRevenue.toFixed(
    2
  )}៛`;
}

function initializeTable(data) {
  if (reportTable) {
    reportTable.destroy();
  }

  updateTotals(data);

  reportTable = $("#reportTable").DataTable({
    data: data,
    columns: [
      {
        data: "service",
        className: "align-middle",
        render: function (data) {
          return data.name;
        },
      },
      {
        data: "buyer",
        className: "align-middle",
        render: function (data) {
          return data.name;
        },
      },
      {
        data: "buyer",
        className: "align-middle text-start",
        render: function (data) {
          return data.phone;
        },
      },
      {
        data: "qty",
        className: "align-middle text-start",
        render: function (data) {
          return data;
        },
      },
      {
        data: null,
        className: "align-middle",
        render: function (data) {
          return `${(data.price * data.qty).toFixed(2)}៛`;
        },
      },
      {
        data: "created_at",
        className: "align-middle",
        render: function (data) {
          return new Date(data).toLocaleDateString();
        },
      },
    ],
    responsive: true,
    order: [[5, "desc"]], 
    dom: "Bfrtip",
    buttons: [
      {
        text: '<i class="bi bi-download"></i> Download CSV',
        className: "btn btn-primary",
        action: function () {
          exportToCsv(orderData);
        },
      },
    ],
  });
}

function exportToCsv(data) {
  const headers = [
    "Service Name",
    "Quantity",
    "Customer Name",
    "Customer Phone",
    "Total Price",
    "Order Date",
  ];

  const rows = data.map((order) => [
    order.service.name,
    order.qty,
    order.buyer.name,
    order.buyer.phone,
    `${(order.price * order.qty).toFixed(2)}៛`,
    new Date(order.created_at).toLocaleDateString(),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `order_report_${new Date().toISOString().split("T")[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function filterByDate() {
  const startDateValue = document.getElementById("startYear").value;
  const endDateValue = document.getElementById("endYear").value;

  // Check if both date fields are empty
  if (!startDateValue && !endDateValue) {
    initializeTable(orderData); // Show all data if no filters are applied
    return;
  }

  const startDate = startDateValue ? new Date(startDateValue) : null;
  const endDate = endDateValue ? new Date(endDateValue) : null;

  // Set the end date to the end of the day if it exists
  if (endDate) {
    endDate.setHours(23, 59, 59, 999);
  }

  const filteredData = orderData.filter((order) => {
    const orderDate = new Date(order.created_at);
    
    // Check conditions based on which dates are provided
    const isAfterStartDate = startDate ? orderDate >= startDate : true;
    const isBeforeEndDate = endDate ? orderDate <= endDate : true;

    return isAfterStartDate && isBeforeEndDate;
  });

  initializeTable(filteredData);
}

document.addEventListener("DOMContentLoaded", () => {
  fetchOrderReports();
  document.getElementById("filterBtn").addEventListener("click", filterByDate);
  document.getElementById("exportCsvBtn").addEventListener("click", () => {
    if (orderData.length > 0) {
      exportToCsv(orderData);
    } else {
      alert("No data available to export");
    }
  });
});
