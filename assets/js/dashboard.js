import { AdminToken, UserToken } from './tokens.js';
import { baseUrl } from './baseUrl.js';
let Provider = localStorage.getItem('ProviderID');

if(Provider){
    document.getElementById('link_in').href= "page/getorder.html";  
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
                document.getElementById('total').innerHTML = `៛${totalAmount.toLocaleString()}`;
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }
    
    fetchAndDisplayData();
    
    
    
    
    // get Recent order
    console.log(localStorage.getItem('ProviderID'));
    let ProviderID = localStorage.getItem('ProviderID');
    function displayService() {
        const apiUrl = `${baseUrl}/api/services?page=1&per_page=20&search=&category=&price_start=0&price_end=99999&creator=${ProviderID}`;
    
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
                                    <td class="text-start">៛${order.price * order.qty}</td>
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
}else {

    document.querySelector('#admin_Provider').textContent = "Service Provider";
    document.querySelector('#admin_user').textContent = "All Users";
    document.querySelector('#adminCategory').textContent = "Categories";
    document.querySelector('#adminUserTitle').innerHTML = "All Users";
    document.querySelector('#adminProvider').innerHTML = "Service Provider";
    document.querySelector('#adminService').innerHTML = "All Services";
    document.querySelector('#admin_email').innerHTML = "Email";
    document.querySelector('#admin_phone').innerHTML = "Phone Number";
    document.getElementById('admin_payment').style.display = "none";
    document.getElementById('link_in').href= "page/user.html";  
    function countServiceProviceder() {
        const apiUrl = `${baseUrl}/api/users/providers?page=1&per_page=20&search=`;
    
        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${AdminToken}`
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data && data.data) {
                    const totalServiceProviders = data.data.length;
                    document.getElementById('all_service').textContent = totalServiceProviders;
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }
    countServiceProviceder();

    function countUser() {
        const apiUrl = `${baseUrl}/api/users?page=1&per_page=20`;
        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${AdminToken}`
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data && data.data) {
                    const totalUser = data.data.length;
                    document.getElementById('booking').textContent = totalUser;
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }
    countUser();

    function countCategory() {
        const apiUrl = `${baseUrl}/api/categories`;
        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${AdminToken}`
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data && data.data) {
                    const totalCategory = data.data.length;
                    document.getElementById('customers').textContent = totalCategory;
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }
    countCategory();

    function getAllServices() {
        const apiUrl = `${baseUrl}/api/services?page=1&per_page=20&search=&category=&price_start=0&price_end=99999&creator=`;
    
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
                document.getElementById('total').innerHTML = serviceCount;
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }
    getAllServices();
    

    fetch(`${baseUrl}/api/users`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${AdminToken}`,
        },
      })
        .then((res) => res.json())
        .then((json) => {
          let tr = "";
          const users = json.data;
          users.forEach((e) => {
            tr += `<tr>
                        <td>${e.name}</td>
                        <td class="text-start text-primary">${e.email}</td>
                        <td class="text-end">${e.phone}</td>
                  </tr>`;
          });
          document.getElementById("recentOrder").innerHTML = tr;
        })
        .catch((error) => console.error("Error fetching data:", error));


        fetch(`${baseUrl}/api/users/providers?page=1&per_page=20&search=`, {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${AdminToken}`,
            },
          })
            .then((res) => res.json())
            .then((json) => {
              if (json.result) { // Check if API call is successful
                let tr = "";
                json.data.forEach((e) => { // Iterate over 'data' array in response
                  tr += `
                    <tr>
                      <td class="rounded-3">
                        <div class="d-flex align-items-center gap-2">
                          <div class="imgBx">
                            <img src="${e.avatar}" alt="${e.name}" class="avatar-img">
                          </div>
                          <div>
                            <h6 class="mb-0">${e.name}</h6>
                            <span class="fs-13">${e.email}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  `;
                });
                document.getElementById("getRecentUser").innerHTML = tr;
              } else {
                console.error("Error fetching providers:", json.message);
              }
            })
            .catch((error) => {
              console.error("Error:", error);
            });
}

