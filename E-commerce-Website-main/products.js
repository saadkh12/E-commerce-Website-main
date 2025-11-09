let productsGrid = document.querySelector(".products-grid");
let productCard = document.querySelector("product-card");
let productImage = document.getElementsByClassName("product-image");
let productInfo = document.getElementsByClassName("product-badge");
let productCategory = document.getElementsByClassName("product-category");
let productRating = document.getElementsByClassName("product-rating");
let productPrice = document.getElementsByClassName("product-price");
let addToCartBtn = document.querySelectorAll(".add-to-cart-btn");

fetchingProductDataFromJson();


// FETCHING PRODUCTS FROM PRODUCTS.JSON
function fetchingProductDataFromJson() {
  fetch("./products.json")
    .then((res) => res.json())
    .then((data) => {
      console.log("data", data);
      // let limitedData = data.slice(0,2)
      data.forEach((product) => {
        console.log("post", product);
        let card = `
        <div class="product-card" data-id="${product.id}">
          <div class="product-image">
            <img src="${product.image}" alt="${product.title}">
            <span class="product-badge">-20%</span>
          </div>
          <div class="product-info">
            <div class="product-category">${product.category}</div>
            <div class="product-name">${product.title}</div>
            <div class="product-rating">⭐ ${product.rating.rate} (${
          product.rating.count
        })</div>
            <div class="product-price">
              <span class="price-current">$${product.price}</span>
              <span class="price-original">$${(product.price * 1.2).toFixed(
                2
              )}</span>
            </div>
            <button class="add-to-cart-btn">Add to Cart</button>
          </div>
        </div>
      `;
        //   productsGrid = card
        productsGrid.insertAdjacentHTML("beforeend", card);
      });
      addToCartBtnClicked();
    })
    .catch((err) => console.error("Error fetching products:", err));
}


// ADD TO CART FUNCTIONALITY 
function addToCartBtnClicked() {
//   addToCartBtn.forEach((btn) => {
//     btn.addEventListener("click", function () {
//     });
//   });
  productsGrid.addEventListener("click", function (event) {
    if (event.target.classList.contains("add-to-cart-btn")) {
      let productCard = event.target.closest(".product-card");
      let productName = productCard.querySelector(".product-name").textContent;
      let productPrice =
        productCard.querySelector(".price-current").textContent;
      let productImage = productCard
        .querySelector(".product-image img")
        .getAttribute("src");
      let productId = productCard.dataset.id;
      let productDetails = {
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
      };
      console.log("productDetails", productDetails);

      // store in localStorage
      localStorage.setItem("addedToCart", JSON.stringify(productDetails));
      let getItem = JSON.parse(localStorage.getItem("addedToCart"));
      console.log("getItem", getItem);

      event.target.textContent = "Added to Cart";
      setTimeout(() => {
        event.target.textContent = "Add To Cart";
      }, 2000);
    }
  });
}
