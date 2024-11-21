import { AdminToken, UserToken } from "./tokens.js";
import { baseUrl } from "./baseUrl.js";
import {
  modalContent,
  adminModalContent,
  togglePasswordVisibility,
  initPasswordForm,
  initAdminInformationForm,
} from "./updateUserInfo.js";

window.togglePasswordVisibility = togglePasswordVisibility;
function displayProvider() {
  fetch(`${baseUrl}/api/users/providers?page=1&per_page=20&search=`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      let tr = "";
      json.data.forEach((provider) => {
        tr += `<tr>
                      <td class='align-middle text-start'>${provider.id}</td>
                      <td class='align-middle'>
                        <img src="${provider.avatar}" alt="" class="rounded-circle" style="width: 50px; height: 50px;">
                      </td>
                      <td class='align-middle'>${provider.name}</td>
                      <td class='align-middle'>${provider.email}</td>
                      <td class='align-middle text-start'>${provider.phone}</td>
                      <td class='align-middle '>
                        <button class="btn btn-primary py-1 px-3" onclick="viewProviderDetails(${provider.id})" data-bs-toggle="modal" data-bs-target="#providerDetailModal">
                          <i class="bi bi-eye"></i>
                        </button>
                      </td>
                  </tr>`;
      });
      document.getElementById("table_body").innerHTML = tr;

      $("#providerTabel").DataTable({
        responsive: true,
      });
    })
    .catch((error) => console.error("Error fetching data:", error));
}

displayProvider();

window.viewProviderDetails = function (providerId) {
  // Show loading state
  document.getElementById("providerDetailContent").innerHTML = `
    <div class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `;

  // First fetch services and categories
  fetch(`${baseUrl}/api/services?creator=${providerId}&per_page=100`)
    .then((res) => res.json())
    .then((servicesData) => {
      // Create a map of categories and their services
      const categoryMap = new Map();
      servicesData.data.forEach((service) => {
        if (service.category) {
          if (!categoryMap.has(service.category.id)) {
            categoryMap.set(service.category.id, {
              name: service.category.name,
              services: [],
            });
          }
          categoryMap.get(service.category.id).services.push(service);
        }
      });

      // Create the categories and services HTML
      let categoriesHtml = "";
      categoryMap.forEach((category) => {
        categoriesHtml += `
          <div class="mb-3">
            <h6 class="fw-bold mb-2">${category.name}</h6>
            <div class="ms-2">
              ${category.services
                .map(
                  (service) => `
                <div class="d-flex justify-content-between align-items-center py-1 border-bottom">
                  <span class="text-muted">${service.name}</span>
                  <span class="badge bg-primary">$${service.price}</span>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        `;
      });

      // Then fetch provider details
      return fetch(`${baseUrl}/api/users/providers/${providerId}`)
        .then((res) => res.json())
        .then((provider) => {
          const detailContent = `
            <div class="row">
              <div class="col-md-4 text-center mb-3">
                <img src="${provider.data.avatar}" alt="" class="rounded-circle" style="width: 120px; height: 120px;">
              </div>
              <div class="col-md-8">
                <div class="mb-2">
                  <i class="bi bi-person text-primary"></i>
                  <strong class="ms-2">${provider.data.name}</strong>
                </div>
                <div class="mb-2">
                  <i class="bi bi-envelope text-primary"></i>
                  <span class="ms-2">${provider.data.email}</span>
                </div>
                <div class="mb-2">
                  <i class="bi bi-telephone text-primary"></i>
                  <span class="ms-2">${provider.data.phone}</span>
                </div>
                ${provider.data.google_map_url ? `
                  <div>
                    <i class="bi bi-geo-alt text-primary"></i>
                    <a href="${provider.data.google_map_url}" target="_blank" class="ms-2 text-decoration-none">View on Google Maps</a>
                  </div>
                ` : ''}
              </div>
            </div>
            <hr class="my-3">
            <h6 class="fw-bold mb-3">Services & Categories</h6>
            <div class="services-container" style="max-height: 300px; overflow-y: auto;">
              ${categoriesHtml || '<p class="text-muted">No services available</p>'}
            </div>
          `;
          
          document.getElementById("providerDetailContent").innerHTML = detailContent;
        });
    })
    .catch((error) => {
      console.error("Error fetching provider details:", error);
      document.getElementById("providerDetailContent").innerHTML = `
        <div class="alert alert-danger">
          Error loading provider details. Please try again later.
        </div>
      `;
    });
};
