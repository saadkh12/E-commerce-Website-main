let cartMainContainer = document.querySelector(".cart-items");
let cartItems = document.querySelector(".cart-item");
let cartImage = document.querySelector(".item-image");
let cartDetails = document.querySelector(".item-details");
let cartName = document.querySelector(".item-name");
let cartPrice = document.querySelector(".item-price");
let cartQuantity = document.querySelector(".quantity-control input");
let cartRemoveBtn = document.querySelector(".item-remove-btn");
let cartSubtotal = document.querySelector(".item-total");
let cartTotalAmount = document.querySelector(".summary-row.subtotal ");
let summaryTotalAmount = document.querySelector(".summary-row.total");
let checkoutBtn = document.querySelector(".checkout-btn");
let promoSection = document.querySelector(".promo-section");
let promoInput = document.querySelector(".promo-input" + " input");
let promoApplyBtn = document.querySelector(".promo-Apply-Btn");
// console.log("start");


// FUNCTION TO GET AND SET CART ITEMS FROM LOCAL STORAGE
function getCartItems() {
    let data = localStorage.getItem("addedToCart");
    if (!data) return [];
    try {
        return JSON.parse(data);
    } catch (err) {
        console.error("Invalid JSON in localStorage", err);
        localStorage.setItem("addedToCart", JSON.stringify([]));
        return [];
    }
}

function setCartItems(items) {
    localStorage.setItem("addedToCart", JSON.stringify(items));
}


// FUNCTION TO UPDATE CART
function updateCartTotal() {
    let selectedItems = getCartItems();
    cartMainContainer.innerHTML = "";

    if (selectedItems.length === 0) {
        cartMainContainer.innerHTML = `
            <div class="cart-item">
                <div class="item-details">
                    <h3>No Data Available</h3>
                    <p>Please add some products to your cart.</p>
                    </div>
                    </div>`;
        checkoutBtn.disabled = true;
        checkoutBtn.style.cursor = "not-allowed";
        checkoutBtn.style.backgroundColor = "#ccc";
        checkoutBtn.style.borderColor = "#ccc";
        // cartSubtotal.textContent = "$0.00";  
        return;
    }
    totalAmountOfItems();

    let total = 0;


    selectedItems.forEach((item, index) => {
        let priceValue = parseFloat(item.price.replace("$", "")) || item.price;
        let quantity = item.quantity || 1;
        let itemTotal = priceValue * quantity;

        let cartHTML = `
        <div class="cart-item"  data-index="${index}">
            <div class="item-image">
            <img src="${item.image}" alt="${item.name}" style="width:100%;height:100%;border-radius:6px;">
            </div>
            <div class="item-details">
            <h3>${item.name}</h3>
            <p>Category: ${item.category || "N/A"}</p>
            </div>
            <div class="item-price">$${priceValue.toFixed(2)}</div>
            <div class="quantity-control">
            <button class="btn-negative">−</button>
            <input type="number" value="${quantity}" min="1">
            <button class="btn-positive">+</button>
            </div>        
            <button type="button" class="item-remove-btn" style="color: red; width: 50px;">Del</button>
            <div class="item-total">$${itemTotal.toFixed(2)}</div>
        </div>
        `;

        cartMainContainer.insertAdjacentHTML("beforeend", cartHTML);
        total += itemTotal;
    });

    // total update
    // cartSubtotal.textContent = "$" + total.toFixed(2);
    attachCartListeners();
    totalAmountOfItems();

    // attach quantity listeners
}
// EVENT LISTENERS FOR QUANTITY CHANGE AND REMOVE BUTTON
function attachCartListeners() {
    let cartItems = document.querySelectorAll(".cart-item");
    let selectedItems = getCartItems();
    cartItems.forEach((item) => {
        let index = parseInt(item.dataset.index);
        let decreaseBtn = item.querySelector(".btn-negative");
        let increaseBtn = item.querySelector(".btn-positive");
        let quantityInput = item.querySelector("input");
        let removeBtn = item.querySelector(".item-remove-btn");

        decreaseBtn.addEventListener("click", () => {
            if (selectedItems[index].quantity > 1) {
                selectedItems[index].quantity -= 1;
                setCartItems(selectedItems);
                updateCartTotal();
            }
        });

        increaseBtn.addEventListener("click", () => {
            selectedItems[index].quantity += 1;
            setCartItems(selectedItems);
            updateCartTotal();
        });

        quantityInput.addEventListener("change", () => {
            if (quantityInput.value < 1) quantityInput.value = 1;
            selectedItems[index].quantity = parseInt(quantityInput.value);
            setCartItems(selectedItems);
            updateCartTotal();
        });

        removeBtn.addEventListener("click", () => {
            selectedItems.splice(index, 1);
            setCartItems(selectedItems);
            updateCartTotal();
            totalAmountOfItems();
        });
    });
}

// INITIAL CART TOTAL UPDATE
updateCartTotal();

// CHECKOUT BUTTON LISTENER (only once)
if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function () {
        alert("Checkout Completed Successfully!");
        localStorage.removeItem("addedToCart");
        pulseCartIcon();
        updateCartTotal();
        totalAmountOfItems();
        window.location.href = "index.html";
    });
}

// TOTAL UPDATE FUNCTION
function totalAmountOfItems() {
    let selectedItems = getCartItems();
    if (!selectedItems || selectedItems.length === 0) {
        if (cartTotalAmount) cartTotalAmount.innerHTML = `<span>Subtotal</span> 
    <span>$0.00</span>`;
        if (summaryTotalAmount) summaryTotalAmount.innerHTML = `<span>Total</span> 
    <span>$0.00</span>`;
        return;
    }

    // calculate total price
    let total = selectedItems.reduce((sum, item) => {
        let price = parseFloat(item.price.replace("$", "")) || 0;
        let quantity = item.quantity || 1;
        return sum + price * quantity;
    }, 0);

    // update cart total HTML
    if (cartTotalAmount) cartTotalAmount.innerHTML = `<span>Subtotal</span> 
    <span>$${total.toFixed(2)}</span>`;
    if (summaryTotalAmount) summaryTotalAmount.innerHTML = `<span>Total</span> 
    <span>$${total.toFixed(2)}</span>`;
}


promoApplyBtn.addEventListener("click", promoCodeDiscount);

// PROMO CODE DISCOUNT FUNCTION
function promoCodeDiscount() {
    let promoCode = promoInput.value;
    let selectedItems = getCartItems();

    if (!selectedItems || selectedItems.length === 0) {
        summaryTotalAmount.innerHTML = `<span>Total</span><span>$0.00</span>`;
        return;
    }

    let total = selectedItems.reduce((sum, item) => {
        let price = parseFloat(item.price.replace("$", "")) || 0;
        let quantity = item.quantity || 1;
        return sum + price * quantity;
    }, 0);

    if (promoCode === "12345") {
        let discount = total * 0.2;
        let newTotal = total - discount;

        summaryTotalAmount.innerHTML = `<span>Total after 20% discount</span><span>$${newTotal.toFixed(2)}</span>`;
        alert("Promo code applied successfully!");
        promoCode = "";
        promoInput.value = "";
    } else {
        totalAmountOfItems();
        alert("Invalid promo code!");
    }
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
