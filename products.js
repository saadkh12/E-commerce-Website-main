let productsGrid = document.querySelector(".products-grid");
let productCard = document.querySelector("product-card");
let productImage = document.getElementsByClassName("product-image");
let productInfo = document.getElementsByClassName("product-badge");
let productCategory = document.getElementsByClassName("product-category");
let productRating = document.getElementsByClassName("product-rating");
let productPrice = document.getElementsByClassName("product-price");
let addToCartBtn = document.querySelectorAll(".add-to-cart-btn");
let filterOptions = document.querySelectorAll(".filter-option input[type='checkbox']");

// INITIAL FETCH
fetchProducts();
// FETCHING PRODUCTS CATEGORY WISE
function fetchProducts(selectedCategories = []) {
  productsGrid.innerHTML = "";

  fetch("https://fakestoreapi.com/products")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      let filteredData = selectedCategories.length === 0 ? data : data.filter((product) => selectedCategories.includes(product.category.toLowerCase())
      );

      fetchingProductDataFromJson(filteredData);
    })
    .catch((err) => console.error("Error fetching products:", err));
}


// RENDER PRODUCTS (DATA PASSED FROM FETCH)
function fetchingProductDataFromJson(products) {
  productsGrid.innerHTML = "";

  if (products.length === 0) {
    productsGrid.innerHTML = `<p class="no-products">No products found!</p>`;
    return;
  }

  products.forEach((product) => {
    let card = `
      <div class="product-card" data-id="${product.id}">
        <div class="product-image">
          <img src="${product.image}" alt="${product.title}">
          <span class="product-badge">-20%</span>
        </div>
        <div class="product-info">
          <div class="product-category">${product.category}</div>
          <div class="product-name">${product.title}</div>
          <div class="product-rating">⭐ ${product.rating.rate} (${product.rating.count})</div>
          <div class="product-price">
            <span class="price-current">$${product.price}</span>
            <span class="price-original">$${(product.price * 1.2).toFixed(2)}</span>
          </div>
          <button class="add-to-cart-btn">Add to Cart</button>
        </div>
      </div>
    `;
    productsGrid.insertAdjacentHTML("beforeend", card);
  });

  addToCartBtnClicked();
}

// ================== ========
// FILTER FUNCTIONALITY
// ==========================
filterOptions.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    let selectedCategories = Array.from(filterOptions)
      .filter((category) => category.checked)
      .map((category) => category.id.toLowerCase());
    fetchProducts(selectedCategories);
  });
});

// ADD TO CART FUNCTIONALITY 
function addToCartBtnClicked() {
  productsGrid.addEventListener("click", function (event) {
    if (event.target.classList.contains("add-to-cart-btn")) {
      let productCard = event.target.closest(".product-card");
      let productName = productCard.querySelector(".product-name").textContent;
      let productPrice =
        productCard.querySelector(".price-current").textContent;
      let productImage = productCard
        .querySelector(".product-image img")
        .getAttribute("src");
      let productRating = productCard.querySelector(".product-rating").textContent;
      let productCategory = productCard.querySelector(".product-category").textContent;

      let productId = productCard.dataset.id;
      let productDetails = {
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        rating: productRating,
        category: productCategory,
        quantity: 1,
      };
      console.log("productDetails", productDetails);


      let dynamicCart = JSON.parse(localStorage.getItem("addedToCart")) || [];
      let existingItem = dynamicCart.find(item => item.id === productId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        dynamicCart.push({ ...productDetails, id: productId });
      }
      localStorage.setItem("addedToCart", JSON.stringify(dynamicCart));
      console.log("Updated Cart:", dynamicCart);

      event.target.textContent = "Added to Cart";
      pulseCartIcon();
      setTimeout(() => {
        event.target.textContent = "Add To Cart";
      }, 2000);
    }
  });
}

function pulseCartIcon() {
  const ping = document.getElementById("cart-ping");
  let dynamicCart = JSON.parse(localStorage.getItem("addedToCart")) || [];
if (dynamicCart.length > 0) {
    ping.style.display = "block"; // show pulse if cart has items
  } else {
    ping.style.display = "none"; // hide if cart empty
  }
}



pulseCartIcon();
