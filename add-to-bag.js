// CART STATE MANAGEMENT
let cartState = [];

document.addEventListener('DOMContentLoaded', () => {
  const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
  const cartDrawerCloseBtn = document.getElementById('cartDrawerCloseBtn');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartEmptyState = document.getElementById('cartEmptyState');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartItemCountTitle = document.getElementById('cartItemCountTitle');
  const cartCountBadges = document.querySelectorAll('.cart-count');
  const btnContinueShopping = document.getElementById('btnContinueShopping');

  // Trigger Cart Button in Navbar
  const navCartBtn = document.querySelector('.cart-btn');

  if (navCartBtn) {
    navCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  }

  const openCartDrawer = () => {
    cartDrawerOverlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  };

  const closeCartDrawer = () => {
    cartDrawerOverlay.classList.remove('is-active');
    document.body.style.overflow = '';
  };

  if (cartDrawerCloseBtn) cartDrawerCloseBtn.addEventListener('click', closeCartDrawer);
  if (btnContinueShopping) btnContinueShopping.addEventListener('click', closeCartDrawer);

  cartDrawerOverlay.addEventListener('click', (e) => {
    if (e.target === cartDrawerOverlay) closeCartDrawer();
  });

  // Render Cart Function
  window.updateCartUI = () => {
    // 1. Calculate Total Items Count
    const totalItems = cartState.reduce((sum, item) => sum + item.quantity, 0);

    // Update Header Badges & Title Count
    cartCountBadges.forEach(badge => badge.textContent = totalItems);
    if (cartItemCountTitle) cartItemCountTitle.textContent = totalItems;

    // 2. Empty State Toggle
    if (cartState.length === 0) {
      cartEmptyState.style.display = 'flex';
      cartItemsList.innerHTML = '';
      if (cartSubtotal) cartSubtotal.textContent = 'Rs. 0';
      return;
    }

    cartEmptyState.style.display = 'none';

    // 3. Render Cart List & Subtotal Calculation
    let totalPrice = 0;

    cartItemsList.innerHTML = cartState.map(item => {
      const numericPrice = parseInt(item.price.replace(/[^0-9]/g, '')) || 0;
      totalPrice += numericPrice * item.quantity;

      return `
        <div class="cart-item-card">
          <img src="${item.image}" alt="${item.title}" class="cart-item-img" onerror="this.src='https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=200'">
          <div class="cart-item-details">
            <div class="cart-item-head">
              <h4 class="cart-item-title">${item.title}</h4>
              <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">&times;</button>
            </div>
            <div class="cart-item-price">${item.price}</div>
            <div class="cart-item-actions">
              <div class="qty-control">
                <button class="qty-btn" onclick="changeQuantity('${item.id}', -1)">-</button>
                <span class="qty-val">${item.quantity}</span>
                <button class="qty-btn" onclick="changeQuantity('${item.id}', 1)">+</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Format Subtotal Price
    if (cartSubtotal) {
      cartSubtotal.textContent = `Rs. ${totalPrice.toLocaleString()}`;
    }
  };

  // GLOBAL ADD TO CART FUNCTION
  window.addToCart = (id, title) => {
    // Find item details from page elements or datasets
    const productCard = event ? event.target.closest('.product-card, .search-result-card, .fs-product-card') : null;
    let price = "Rs. 1,850";
    let image = "assets/earings/earing-14.jpeg";

    if (productCard) {
      const priceElem = productCard.querySelector('.product-price, .search-result-price, .fs-product-price');
      const imgElem = productCard.querySelector('img');
      if (priceElem) price = priceElem.textContent.trim();
      if (imgElem) image = imgElem.getAttribute('src');
    }

    const existingIndex = cartState.findIndex(item => item.id === id);
    if (existingIndex > -1) {
      cartState[existingIndex].quantity += 1;
    } else {
      cartState.push({ id, title, price, image, quantity: 1 });
    }

    window.updateCartUI();
    openCartDrawer();
  };

  // QUANTITY & REMOVE HANDLERS
  window.changeQuantity = (id, delta) => {
    const item = cartState.find(item => item.id === id);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        window.removeFromCart(id);
      } else {
        window.updateCartUI();
      }
    }
  };

  window.removeFromCart = (id) => {
    cartState = cartState.filter(item => item.id !== id);
    window.updateCartUI();
  };
});


// CART TO CHECKOUT HANDLER
window.proceedCartToCheckout = () => {
  // 1. Check if cart is empty
  if (cartState.length === 0) {
    alert("Your shopping bag is empty. Please add items first.");
    return;
  }

  // 2. Check if user is logged in
  if (!currentUser) {
    alert("Please sign in or create an account first to place your order.");
    // Close cart drawer and open login modal
    document.getElementById('cartDrawerOverlay').classList.remove('is-active');
    document.body.style.overflow = '';
    
    const userModalOverlay = document.getElementById('userModalOverlay');
    if (userModalOverlay) userModalOverlay.classList.add('is-active');
    return;
  }

  // 3. Close Cart Drawer
  const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
  if (cartDrawerOverlay) cartDrawerOverlay.classList.remove('is-active');

  // 4. Calculate total amount & prepare items summary
  let totalCalculated = 0;
  const itemsSummaryHTML = cartState.map(item => {
    const numericPrice = parseInt(item.price.replace(/[^0-9]/g, '')) || 0;
    totalCalculated += numericPrice * item.quantity;

    return `
      <div class="checkout-product-item" style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem;">
        <img src="${item.image}" alt="${item.title}" class="summary-img" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px;">
        <div class="summary-details" style="flex: 1;">
          <h4 style="font-size: 0.95rem; margin: 0;">${item.title} (x${item.quantity})</h4>
          <span style="font-size: 0.85rem; font-weight: 700;">${item.price}</span>
        </div>
      </div>
    `;
  }).join('');

  // 5. Update Checkout Summary UI
  const summaryContainer = document.getElementById('checkoutProductSummary');
  if (summaryContainer) {
    summaryContainer.innerHTML = `
      <div style="width: 100%;">
        <div class="checkout-items-wrapper" style="max-height: 150px; overflow-y: auto; padding-right: 5px;">
          ${itemsSummaryHTML}
        </div>
        <div style="border-top: 1px solid rgba(167, 123, 98, 0.2); margin-top: 0.5rem; padding-top: 0.5rem; display: flex; justify-content: space-between; font-weight: 700;">
          <span>Total Payable Amount:</span>
          <span style="color: var(--accent-color, #A77B62);">Rs. ${totalCalculated.toLocaleString()}</span>
        </div>
      </div>
    `;
  }

  // 6. Set active order object for processFinalOrder
  currentOrderProduct = {
    id: 'cart-multi-items',
    title: `${cartState.length} Items from Cart`,
    price: `Rs. ${totalCalculated.toLocaleString()}`,
    image: cartState[0].image
  };

  // Auto-fill shipping name
  document.getElementById('shipName').value = currentUser.name;

  // 7. Open Checkout Modal
  const checkoutModalOverlay = document.getElementById('checkoutModalOverlay');
  if (checkoutModalOverlay) {
    checkoutModalOverlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }
};


// Add this line inside processFinalOrder before opening user profile modal:
if (currentOrderProduct && currentOrderProduct.id === 'cart-multi-items') {
  cartState = []; // Clear Cart state
  if (window.updateCartUI) window.updateCartUI(); // Reset badge count & drawer
}