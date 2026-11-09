// GLOBAL DATA STORES
let currentUser = JSON.parse(localStorage.getItem('elora_user')) || null;
let userOrders = JSON.parse(localStorage.getItem('elora_orders')) || [];
let currentOrderProduct = null;

document.addEventListener('DOMContentLoaded', () => {
  
  const userModalOverlay = document.getElementById('userModalOverlay');
  const checkoutModalOverlay = document.getElementById('checkoutModalOverlay');
  
  const userModalCloseBtn = document.getElementById('userModalCloseBtn');
  const checkoutCloseBtn = document.getElementById('checkoutCloseBtn');
  
  // Profile Icon Button Selector
  const navAccountBtn = document.querySelector('.icon-btn[aria-label="Account"]');

  if (navAccountBtn) {
    navAccountBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openUserProfileModal();
    });
  }

  const openUserProfileModal = () => {
    userModalOverlay.classList.add('is-active');
    renderProfileView();
  };

  const closeModals = () => {
    userModalOverlay.classList.remove('is-active');
    checkoutModalOverlay.classList.remove('is-active');
  };

  if (userModalCloseBtn) userModalCloseBtn.addEventListener('click', closeModals);
  if (checkoutCloseBtn) checkoutCloseBtn.addEventListener('click', closeModals);

  // Authentication Switch View
  const renderProfileView = () => {
    const authView = document.getElementById('authView');
    const profileView = document.getElementById('profileView');

    if (currentUser) {
      authView.style.display = 'none';
      profileView.style.display = 'block';

      document.getElementById('displayUserName').textContent = currentUser.name;
      document.getElementById('displayUserEmail').textContent = currentUser.email;
      document.getElementById('avatarInitial').textContent = currentUser.name.charAt(0).toUpperCase();

      renderUserOrdersList();
    } else {
      authView.style.display = 'block';
      profileView.style.display = 'none';
    }
  };

  // Auth Submit Handler
  window.handleUserAuth = (e) => {
    e.preventDefault();
    const name = document.getElementById('userNameInput').value;
    const email = document.getElementById('userEmailInput').value;

    currentUser = { name, email };
    localStorage.setItem('elora_user', JSON.stringify(currentUser));
    renderProfileView();
  };

  window.handleLogout = () => {
    currentUser = null;
    localStorage.removeItem('elora_user');
    renderProfileView();
  };

  // Render Orders in User Profile Dashboard
  const renderUserOrdersList = () => {
    const container = document.getElementById('ordersHistoryList');
    if (!container) return;

    if (userOrders.length === 0) {
      container.innerHTML = `<p style="font-size:0.85rem; opacity:0.7; padding:1rem 0;">No order history found yet.</p>`;
      return;
    }

    container.innerHTML = userOrders.map(order => `
      <div class="order-card">
        <div class="order-card-header">
          <span class="order-id">Order #${order.orderId}</span>
          <span class="order-status-badge">${order.status}</span>
        </div>
        <div class="order-items-detail">
          <strong>${order.productTitle}</strong> — ${order.price}<br>
          <small>Address: ${order.city}, ${order.address}</small><br>
          <small style="opacity:0.6;">Placed on: ${order.date}</small>
        </div>
      </div>
    `).join('');
  };

  // GLOBAL ORDER NOW TRIGGER FUNCTION
  window.orderNow = (id, title) => {
    // Check if user is logged in first
    if (!currentUser) {
      alert("Please sign in or create an account first to place your order.");
      openUserProfileModal();
      return;
    }

    // Determine product info
    let price = "Rs. 1,850";
    let image = "assets/earings/earing-14.jpeg";

    const productCard = event ? event.target.closest('.product-card, .search-result-card, .fs-product-card') : null;
    if (productCard) {
      const priceElem = productCard.querySelector('.product-price, .search-result-price, .fs-product-price');
      const imgElem = productCard.querySelector('img');
      if (priceElem) price = priceElem.textContent.trim();
      if (imgElem) image = imgElem.getAttribute('src');
    }

    currentOrderProduct = { id, title, price, image };

    // Fill Product Summary Box inside Checkout Modal
    document.getElementById('checkoutProductSummary').innerHTML = `
      <img src="${image}" alt="${title}" class="summary-img" onerror="this.src='https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=200'">
      <div class="summary-details">
        <h4>${title}</h4>
        <span>${price}</span>
      </div>
    `;

    // Auto-fill user name if logged in
    document.getElementById('shipName').value = currentUser.name;

    // Open Checkout Modal
    checkoutModalOverlay.classList.add('is-active');
  };

  // PROCESS & CONFIRM ORDER
  window.processFinalOrder = (e) => {
    e.preventDefault();

    const orderId = 'ELO-' + Math.floor(100000 + Math.random() * 900000);
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const newOrder = {
      orderId,
      productTitle: currentOrderProduct.title,
      price: currentOrderProduct.price,
      image: currentOrderProduct.image,
      phone: document.getElementById('shipPhone').value,
      city: document.getElementById('shipCity').value,
      address: document.getElementById('shipAddress').value,
      payment: document.getElementById('shipPayment').value,
      status: 'Processing',
      date
    };

    userOrders.unshift(newOrder);
    localStorage.setItem('elora_orders', JSON.stringify(userOrders));

    checkoutModalOverlay.classList.remove('is-active');

    alert(`✨ Thank you! Your Order #${orderId} has been placed successfully.\n\nYou can track this order inside your Profile Account.`);
    openUserProfileModal();
  };

});