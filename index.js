
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
