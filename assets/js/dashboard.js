import { AdminToken, UserToken } from './tokens.js';
import { baseUrl } from './baseUrl.js';

function fetchAndDisplayData() {
    const apiUrl = `${baseUrl}/api/profile/purchased?page=1&per_page=20&payment_status=2`;

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
                                <td>${order.service.name}</td>
                                <td>${order.price * order.qty}</td>
                                <td class="text-start">
                                    <span class="${status.class}">${status.text}</span>
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