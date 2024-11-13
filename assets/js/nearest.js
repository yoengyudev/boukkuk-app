import { baseUrl } from "./baseUrl.js";
const maxDistance = 5;
const apiUrl = `${baseUrl}/api/users/providers?page=1&per_page=20&search=`;

function findNearbyLocations() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error, { enableHighAccuracy: true });
    } else {
        displayResult("Geolocation is not supported by this browser.");
        document.getElementById('animation-overlay').style.display = 'none';
    }
}

window.findNearbyLocations = findNearbyLocations;

async function success(position) {
    const userLatitude = position.coords.latitude;
    const userLongitude = position.coords.longitude;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const providers = data.data.filter(provider => provider.latitude && provider.longitude);

        const nearbyProviders = providers.filter(provider => {
            const distance = calculateDistance(userLatitude, userLongitude, provider.latitude, provider.longitude);
            if (distance < maxDistance) {
                provider.distance = formatDistance(distance);
                provider.estimatedTime = calculateDeliveryTime(distance);
                return true;
            }
            return false;
        });

        displayResult(nearbyProviders.length ? nearbyProviders : "No locations found within 5km.");
    } catch (error) {
        console.error("Error fetching providers:", error);
        displayResult("Failed to load laundry locations.");
    } finally {
        document.getElementById('animation-overlay').style.display = 'none';
    }
}

// Helper function to format distance in meters or kilometers
function formatDistance(distanceInKm) {
    if (distanceInKm < 1) {
        const distanceInMeters = Math.round(distanceInKm * 1000); 
        return `${distanceInMeters}m`; 
    } else {
        return `${distanceInKm.toFixed(2)}km`; 
    }
}

// Calculate estimated delivery time based on distance and an average speed of 40 km/h
function calculateDeliveryTime(distanceInKm) {
  const averageSpeed = 40; 
  const timeInHours = distanceInKm / averageSpeed; 
  const totalSeconds = Math.round(timeInHours * 3600);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Format hours, minutes, and seconds into a string
  if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
  } else {
      return `${seconds}s`;
  }
}


// On error retrieving user's location
function error(err) {
    console.error("Error occurred:", err.message);
    displayResult("Unable to retrieve your location. " + err.message);
}

// Haversine formula to calculate the distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Convert degrees to radians
function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function displayResult(message) {
    const resultElement = document.getElementById('result');

    if (resultElement) {
        resultElement.innerHTML = '';

        if (typeof message === 'string') {
            resultElement.innerHTML = `<p>${message}</p>`;
        } else {
            message.forEach(provider => {
                const cardHtml = `
                    <div class="col-3">
                        <div class="card bg-transparent overflow-hidden border-0 h-100 bg-black">
                            <p class='id' style="display: none;">${provider.id}</p>
                            <div class="mb-3 overflow-hidden position-relative card-img-wrapper border overflow-hidden">
                                <button type="submit" onclick="wishlistCard()" 
                                        class="btn heart bg-instead heart-btn position-absolute end-0 mt-2 me-2 z-1">
                                    <i class="bi bi-heart"></i>
                                </button>
                                <a href="" onclick='store(event)' class="overflow-hidden d-block">
                                    <img src="${provider.avatar}" 
                                        class="card-img img-store w-100" 
                                        alt="${provider.name}">
                                </a>
                            </div>
                            <div class="card-body p-0">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <a href="" onclick='store(event)' 
                                        class="text-decoration-none text-store h5 mb-0 text-truncate me-2">
                                        ${provider.name}
                                    </a>
                                    <span class="d-flex align-items-center">
                                        <i class="bi bi-star-fill text-warning me-1"></i>
                                        <span>4.5</span>
                                    </span>
                                </div>
                                <div class="d-flex align-items-center gap-2 w-100">
                                    <span class="metter">${provider.distance}</span>
                                    <span class="text-muted">•</span>
                                    <span>${provider.estimatedTime} </span>
                                    <img class='delivery-icon' src="../../../assets/image/icon/delivery-icon.svg" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                resultElement.insertAdjacentHTML('beforeend', cardHtml);
            });
        }
    } else {
        const currentPath = window.location.href;
        const basePath = currentPath.substring(0, currentPath.indexOf("/src/") + 1);
        const encodedResult = encodeURIComponent(JSON.stringify(message));
        location.href = `${basePath}src/views/page/nearest.html?result=${encodedResult}`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const result = params.get('result');

    if (result) {
        try {
            const parsedResult = JSON.parse(decodeURIComponent(result));
            displayResult(parsedResult);
        } catch (error) {
            console.error("Error parsing result data:", error);
            displayResult("Invalid data format.");
        }
    }
});
