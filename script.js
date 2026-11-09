// Lightweight Script for Mobile Menu Toggle

const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');

    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });


// SECTION 4: 5-by-5 LOAD MORE PAGINATION
document.addEventListener('DOMContentLoaded', () => {
  const allProducts = Array.from(document.querySelectorAll('#bestsellersGrid .product-card'));
  const btnViewMore = document.getElementById('btnViewMore');
  const countBadge = document.getElementById('productCountBadge');
  
  let visibleCount = 5;
  const totalProducts = allProducts.length;

  btnViewMore.addEventListener('click', () => {
    // Show next 5 products
    const nextCount = Math.min(visibleCount + 5, totalProducts);
    
    for (let i = visibleCount; i < nextCount; i++) {
      allProducts[i].classList.remove('is-hidden');
      allProducts[i].classList.add('fade-in');
    }

    visibleCount = nextCount;
    countBadge.textContent = `(${visibleCount} of ${totalProducts})`;

    // If all 20 products are visible, change text or hide button
    if (visibleCount >= totalProducts) {
      btnViewMore.querySelector('span:first-child').textContent = 'All Jewellery Displayed';
      btnViewMore.style.opacity = '0.7';
      btnViewMore.style.cursor = 'default';
    }
  });
});



// FAQS ACCORDION TOGGLE
document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other active items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      // Toggle current clicked item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
});



// ================= ORDER NOW FUNCTION =================

window.orderNow = function (productId, productName) {

    // Find the selected product card
    const allCards = document.querySelectorAll(
        '.product-card, .fs-product-card'
    );

    let productPrice = 0;
    let productImage = "";

    allCards.forEach(card => {

        const titleElement = card.querySelector(
            '.product-title, .fs-product-title'
        );

        if (
            titleElement &&
            titleElement.textContent.trim() === productName
        ) {
            const priceElement = card.querySelector(
                '.product-price, .fs-product-price'
            );

            const imageElement = card.querySelector('img');

            if (priceElement) {
                productPrice = Number(
                    priceElement.textContent.replace(/[^\d.]/g, '')
                );
            }

            if (imageElement) {
                productImage = imageElement.getAttribute('src');
            }
        }
    });

    // Get existing orders from localStorage
    let orders = JSON.parse(localStorage.getItem('orders')) || [];

    // Create new order
    const newOrder = {
        orderId: "ORD-" + Date.now(),
        productId: productId,
        productName: productName,
        price: productPrice,
        image: productImage,
        quantity: 1,
        status: "Pending",
        orderDate: new Date().toLocaleString()
    };

    // Save order
    orders.push(newOrder);

    localStorage.setItem('orders', JSON.stringify(orders));

    // Confirmation message
    alert(
        "Order placed successfully!\n\n" +
        "Product: " + productName + "\n" +
        "Price: Rs. " + productPrice + "\n" +
        "Order ID: " + newOrder.orderId
    );

    console.log("Saved Orders:", orders);
};