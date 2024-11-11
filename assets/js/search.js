function handleKeyDown(event) {
  if (event.key === "Enter") {
    searchAndRedirect();
  }
}

function searchAndRedirect() {
  let search_by_name = document.querySelector(".get_vlue_by_search").value;
  console.log(search_by_name);

  if (search_by_name === "") {
    alert("please input text to search");
  } else {
    sessionStorage.setItem("searchQuery", search_by_name);
    const currentPath = window.location.href;
    const basePath = currentPath.substring(0, currentPath.indexOf("/src/") + 1);
    location.href = `${basePath}src/views/page/search.html`;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  let querySearch = sessionStorage.getItem("searchQuery");

  if (querySearch) {
    fetch(
      `https://mps10.chandalen.dev/api/services?page=1&per_page=20&search=${querySearch}&category=&price_start=&price_end=&creator=`
    )
      .then((res) => res.json())
      .then((json) => {
        let col_3 = "";

        if (json.data.length === 0) {
          document.querySelector(
            "#search_not_found"
          ).innerHTML = `<h3 class='text-primary'>No results found for "${querySearch}".</h3>`;
        } else {
          document.querySelector(
            "#Is-search-found"
          ).innerHTML = `<h3 class='text-primary mb-5'>Search found "${querySearch}".</h3>`;
          json.data.forEach((element) => {
            col_3 += `
                <div class="col-3">
                  <div class="card bg-transparent overflow-hidden border-0 h-100 bg-black">
                    <p class='id' style="display: none;">${element.id}</p>
                    <div class="mb-3 overflow-hidden position-relative card-img-wrapper border overflow-hidden">
                      <button type="submit" onclick="wishlistCard()" 
                              class="btn heart bg-instead heart-btn position-absolute end-0 mt-2 me-2 z-1">
                        <i class="bi bi-heart"></i>
                      </button>
                      <a href="" onclick='store(event)' class="overflow-hidden d-block">
                        <img src="${element.image}" 
                            class="card-img img-store w-100" 
                            alt="${element.name}">
                      </a>
                    </div>
                    <div class="card-body p-0">
                      <div class="d-flex justify-content-between align-items-start mb-2">
                        <a href="" onclick='store(event)' 
                            class="text-decoration-none text-store h5 mb-0 text-truncate me-2">
                            ${element.name}
                        </a>
                        <span class="d-flex align-items-center">
                          <i class="bi bi-star-fill text-warning me-1"></i>
                          <span>4.5</span>
                        </span>
                      </div>
                      <div class="d-flex align-items-center gap-2">
                        <span class="metter">1000m</span>
                        <span class="text-muted">•</span>
                        <span>20វិនាទី</span>
                      </div>
                    </div>
                  </div>
                </div>`;
          });
        }

        document.querySelector("#store-card").innerHTML = col_3;
      })
      .catch((error) => console.error("Error fetching data:", error));
  }
});

function store(event) {
  event.preventDefault();
  location.href = `${window.location.origin}/src/views/page/store.html`;
}
