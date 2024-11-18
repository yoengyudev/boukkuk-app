import { AdminToken, UserToken } from './tokens.js';
import { baseUrl } from './baseUrl.js';

function fetchAndDisplayData() {
    const apiUrl = `${baseUrl}/api/profile/payment-check?page=1&per_page=20&payment_status=2`;

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${AdminToken}`
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            const purchases = data.data || [];

            // Count unique buyers
            const uniqueBuyers = new Set(purchases.map(item => item.buyer.id));
            const buyerCount = uniqueBuyers.size;

            // Calculate booking count
            const bookingCount = purchases.length;

            // Calculate total amount
            const totalAmount = purchases.reduce(
                (sum, item) => sum + parseFloat(item.price || 0),
                0
            );

            console.log(`Booking Count: ${bookingCount}`);
            console.log(`Total Amount: $${totalAmount.toFixed(2)}`);
            console.log(`Buyer Count: ${buyerCount}`);

            // Update the DOM with calculated values
            document.getElementById('customers').innerHTML = buyerCount;
            document.getElementById('booking').innerHTML = bookingCount;
            document.getElementById('total').innerHTML = `$${totalAmount.toLocaleString()}`;
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

fetchAndDisplayData();




// get Recent order
console.log(localStorage.getItem('creator_id'));
let creatorID = localStorage.getItem('creator_id');
function displayService() {
    const apiUrl = `${baseUrl}/api/services?page=1&per_page=20&search=&category=&price_start=0&price_end=99999&creator=${creatorID}`;

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${AdminToken}`
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const serviceCount = data.data.length;
            document.getElementById('all_service').innerHTML = serviceCount;
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            document.getElementById('all_service').innerText = "Error";
        });
}
displayService();


// get recent order



function fetchOrders() {
    const url = `${baseUrl}/api/profile/payment-check?page=1&per_page=20&payment_status=`;

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
            if (data.result && Array.isArray(data.data) && data.data.length > 0) {
                let tr = ' ';
                const statusMapping = {
                    1: { text: 'Pending', class: 'text-warning' },
                    2: { text: 'Approved', class: 'text-success' },
                    3: { text: 'Rejected', class: 'text-danger' },
                };

                const statusServiceMapping = {
                    1: { text: 'Placed Order', class: 'text-primary' },
                    2: { text: 'Laundry Pick-Up', class: 'text-info' },
                    3: { text: 'In Process', class: 'text-warning' },
                    4: { text: 'Process to Iron', class: 'text-secondary' },
                    5: { text: 'Ironing', class: 'text-dark' },
                    6: { text: 'Ready for Delivery', class: 'text-success' },
                    7: { text: 'Out for Delivery', class: 'text-info' },
                    8: { text: 'Delivered', class: 'text-success' },
                };

                data.data.forEach((order) => {
                    const status = statusMapping[order.payment_status] || { text: 'Unknown', class: 'text-secondary' };
                    const statusSer = statusServiceMapping[order.service_status] || { text: 'Unknown', class: 'text-secondary' };
                    tr += `
                            <tr>
                                <td>${order.service.name}</td>
                                <td class="text-start">$${order.price * order.qty}</td>
                                <td class="text-start">
                                    <span class="${status.class}">${status.text}</span>
                                </td>
                                <td class="text-end">
                                    <span class="${statusSer.class}">${statusSer.text}</span>
                                </td>
                            </tr>
                    `;
                    document.getElementById('recentOrder').innerHTML = tr;
                });

            } else {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center">No data available in table</td>
                    </tr>
                `;
            }
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

fetchOrders();


// get recently customers

function getRecentUser() {
    const url = `${baseUrl}/api/profile/payment-check?page=1&per_page=20&payment_status=`;

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
            let tr = '';
            let seenEmails = new Set();
            data.data.forEach((order) => {
                if (!seenEmails.has(order.buyer.email)) {
                    seenEmails.add(order.buyer.email);
                    tr += `
                        <tr>
                            <td>
                                <div class="d-flex align-items-center gap-2">
                                    <div class="imgBx">
                                        <img src="${order.buyer.avatar}" alt="User Avatar" class="avatar-img">
                                    </div>
                                    <div>
                                        <h6 class="mb-0">${order.buyer.name}</h6>
                                        <span class="fs-13">${order.buyer.email}</span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    `;
                }
            });

            document.getElementById('getRecentUser').innerHTML = tr;
        })
        .catch((error) => {
            console.error('Error fetching orders:', error);
        });
}
getRecentUser();

