import { AdminToken, UserToken } from './tokens.js';
import { baseUrl } from './baseUrl.js';

document.addEventListener('DOMContentLoaded', fetchOrders);

function fetchOrders() {
    const url = `${baseUrl}/api/profile/purchased?page=1&per_page=20&payment_status=`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${AdminToken}`,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('API Response:', data);

            const tableBody = document.getElementById('order_table');
            tableBody.innerHTML = '';

            if ($.fn.DataTable.isDataTable('#getorder_table')) {
                $('#getorder_table').DataTable().destroy();
            }

            if (data.result && Array.isArray(data.data) && data.data.length > 0) {
                const statusMapping = {
                    1: { text: 'Pending', class: 'text-warning' },
                    2: { text: 'Approved', class: 'text-success' },
                    3: { text: 'Rejected', class: 'text-danger' },
                };

                data.data.forEach((order) => {
                    const tr = document.createElement('tr');
                    const status = statusMapping[order.payment_status] || { text: 'Unknown', class: 'text-secondary' };

                    tr.innerHTML = `
                        <td class="text-start">
                            <div class="d-flex align-items-center gap-2">
                                <div class="service_img shadow">
                                    <img src="${order.service.image}" width="50" alt="Service">
                                </div>
                                <div class="d-flex flex-column">
                                    <span class="fw-medium text-start">${order.service.name}</span>
                                    <span class="text-dark-emphasis">Qty : ${order.qty}</span>
                                </div>
                            </div>
                        </td>
                        <td class="text-start">
                            <div class="d-flex align-items-center gap-2">
                                <div class="profile_cus">
                                    <img src="${order.buyer.avatar}" width="50" alt="Customer">
                                </div>
                                <div class="d-flex flex-column">
                                    <span class="fw-medium text-start">${order.buyer.name}</span>
                                    <span class="text-dark-emphasis">${order.buyer.email}</span>
                                </div>
                            </div>
                        </td>
                        <td class="text-start">
                            <span class="${status.class}">${status.text}</span>
                        </td>
                        <td class="text-start">$${order.price ? order.price.toFixed(2) : '0.00'}</td>
                        <td class="text-end">
                            <button class="btn btn-success btn-sm px-3 py-1 payment-details-btn" onclick="PaymentDetails(${order.id})" data-bs-toggle="modal" data-bs-target="#detailPayment">
                                <i class="bi bi-eye"></i>
                            </button>
                        </td>

                    `;

                    tableBody.appendChild(tr);
                });

            } else {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center">No data available in table</td>
                    </tr>
                `;
            }

            $('#getorder_table').DataTable({
                responsive: true,
            });
        })
        .catch((error) => {
            console.error('Error fetching orders:', error);
            const tableBody = document.getElementById('order_table');
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-danger">
                        Error loading orders: ${error.message}
                    </td>
                </tr>
            `;
        });
}



// get detail 

function PaymentDetails(orderId) {
    const pending = document.getElementById('pending');
    const approve = document.getElementById('approve');
    const reject = document.getElementById('reject');
    const modalContent = document.getElementById('modalContent');
    const loader = document.getElementById('loader');

    const url = `${baseUrl}/api/payments/${orderId}`;
    console.log(orderId, url);
    

    loader.style.display = 'block';
    modalContent.style.display = 'none';

    fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${AdminToken}`,
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log('Payment Details:', data);

            if (data.data.payment_status === 1) {
                pending.checked = true;
            } else if (data.data.payment_status === 2) {
                approve.checked = true;
            } else if (data.data.payment_status === 3) {
                reject.checked = true;
            }

            modalContent.innerHTML = `
                        <div class="row g-5 mb-5 mt-3 px-4 pb-5">
                        <!-- Payment Status Section -->
                        <div class="col-12">
                            <div class="card h-100 border-0">
                                <div>
                                    <h5 class="mb-4">Payment Status</h5>
                                    <form action="" method="post">
                                        <div class="d-flex gap-3">
                                            <div class="form-check">
                                                <input class="form-check-input" type="radio" name="paymentStatus" id="pending" value="1">
                                                <label class="form-check-label" for="pending">Pending</label>
                                            </div>
                                            <div class="form-check">
                                                <input class="form-check-input" type="radio" name="paymentStatus" id="approve" value="2">
                                                <label class="form-check-label" for="approve">Approved</label>
                                            </div>
                                            <div class="form-check">
                                                <input class="form-check-input" type="radio" name="paymentStatus" id="reject" value="3">
                                                <label class="form-check-label" for="reject">Rejected</label>
                                            </div>
                                        </div>
                                        <button type="button" class="btn btn-primary mt-3 px-5">Save</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    
                        <!-- Service Status Section -->
                        <div class="col-12">
                            <div class="card h-100 border-0">
                                <div>
                                    <h5 class="mb-4">Service Status</h5>
                                    <form action="" method="post">
                                        <div class="d-flex gap-3 flex-wrap">
                                            <!-- Dynamically generated service status options -->
                                            ${generateServiceStatusOptions(data.service_status)}
                                        </div>
                                        <button type="button" class="btn btn-primary mt-3 px-5">Save</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    
                        <!-- Schedule Pickup Section -->
                        <div class="col-6">
                            <div class="card h-100 border-0">
                                <h5 class="mb-4">Schedule Pickup</h5>
                                <form action="" method="post">
                                    <div>
                                        <label for="datetime" class="form-label">Select Date and Time</label>
                                        <input type="datetime-local" class="form-control" id="datetime" name="datetime" value="${data.pickup_schedule || ''}">
                                    </div>
                                    <button type="button" class="btn btn-primary mt-3 px-5">Save</button>
                                </form>
                            </div>
                        </div>
                    
                        <!-- Buyer Information Section -->
                        <div class="col-12 col-xl-6">
                            <div class="card border-0">
                                <h5 class="card-title">Buyer Information</h5>
                                <hr style="color: #ddd;">
                                <div class="d-flex align-items-center mb-3">
                                    <img src="${data.buyer.avatar}" alt="Buyer Avatar" class="avatar-img me-3">
                                    <div>
                                        <h6 class="mb-0">${data.buyer.name}</h6>
                                        <small class="text-muted">${data.buyer.email}</small>
                                    </div>
                                </div>
                                <p class="mb-1">Phone: ${data.buyer.phone}</p>
                                <p class="mb-1">Location: ${data.buyer.latitude}, ${data.buyer.longitude}</p>
                                <a href="${data.buyer.google_map_url}" target="_blank" class="btn btn-sm p-0 text-primary">
                                    <i class="bi bi-geo-alt"></i> View on Google Maps
                                </a>
                            </div>
                        </div>
                    
                        <!-- Service Information Section -->
                        <div class="col-12 col-xl-6">
                            <div class="card border-0">
                                <h5 class="card-title">Service Information</h5>
                                <hr style="color: #ddd;">
                                <div class="d-flex align-items-center mb-3">
                                    <img src="${data.service.image}" alt="Service Image" class="card-img me-3">
                                    <div>
                                        <h6 class="mb-0">${data.service.name}</h6>
                                        <p class="text-muted small">${data.service.description}</p>
                                    </div>
                                </div>
                                <p class="mb-1">Category: ${data.service.category.name}</p>
                                <p class="mb-1">Price: $${data.service.price}</p>
                                <p class="mb-1">Discount: ${data.service.discount}%</p>
                            </div>
                        </div>
                    </div>

            `;
        })
        .catch((error) => {
            console.error('Error fetching payment details:', error);
        })
        .finally(() => {
            loader.style.display = 'none';
            modalContent.style.display = 'block';
        });
}

window.PaymentDetails = PaymentDetails;
