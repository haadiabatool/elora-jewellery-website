document.addEventListener('DOMContentLoaded', () => {
  
  // 1. DYNAMICALLY EXTRACT ALL PRODUCTS FROM COLLECTIONS DATA
  let searchDatabase = [
    { id: "p-1", title: "Pearl Glow Earrings", desc: "A graceful combination of delicate pearls and golden details.", price: "Rs. 1,850", image: "assets/earings/earing-14.jpeg", category: "Earrings" },
    { id: "p-2", title: "Golden Heart Necklace", desc: "A meaningful little statement with a timeless heart pendant.", price: "Rs. 2,400", image: "assets/neclace/neclace.jpeg", category: "Necklaces" },
    { id: "p-3", title: "Everyday Gold Bracelet", desc: "A simple and versatile bracelet designed to bring effortless elegance.", price: "Rs. 1,600", image: "assets/braclets/braclet-1.jpeg", category: "Bracelets" },
    { id: "p-4", title: "Golden Touch Ring", desc: "A delicate handcrafted ring that proves even smallest details matter.", price: "Rs. 1,350", image: "assets/rings.jpeg", category: "Rings" }
  ];

  // Merge collectionsData into search database if exists
  if (typeof collectionsData !== 'undefined') {
    Object.keys(collectionsData).forEach(catKey => {
      const cat = collectionsData[catKey];
      cat.items.forEach(item => {
        searchDatabase.push({
          id: item.id,
          title: item.title,
          desc: item.desc,
          price: item.price,
          image: item.image,
          category: cat.title
        });
      });
    });
  }

  // DOM Elements
  const searchOverlay = document.getElementById('searchOverlay');
  const searchInput = document.getElementById('searchInput');
  const searchResultsGrid = document.getElementById('searchResultsGrid');
  const searchCloseBtn = document.getElementById('searchCloseBtn');
  const suggestionTags = document.querySelectorAll('.suggestion-tag');

  // Robust Search Icon Selection (Targets ID, Class, or aria-label)
  const navSearchBtn = document.getElementById('searchTriggerBtn') || 
                       document.querySelector('.icon-btn[aria-label="Search"]') || 
                       document.querySelector('.icon-btn[aria-label="Account"]')?.previousElementSibling ||
                       document.querySelector('.search-trigger-btn');

  // 2. OPEN SEARCH OVERLAY CLICK LISTENER
  if (navSearchBtn) {
    navSearchBtn.style.cursor = 'pointer'; // Ensure pointer cursor
    navSearchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (searchOverlay) {
        searchOverlay.classList.add('is-active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => searchInput && searchInput.focus(), 150);
      }
    });
  } else {
    console.error("ÉLORA: Search trigger button not found in DOM!");
  }

  // 3. CLOSE SEARCH OVERLAY
  const closeSearch = () => {
    if (searchOverlay) {
      searchOverlay.classList.remove('is-active');
      document.body.style.overflow = '';
      if (searchInput) searchInput.value = '';
      if (searchResultsGrid) searchResultsGrid.innerHTML = '';
    }
  };

  if (searchCloseBtn) {
    searchCloseBtn.addEventListener('click', closeSearch);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay && searchOverlay.classList.contains('is-active')) {
      closeSearch();
    }
  });

  // 4. RENDER LIVE SEARCH RESULTS WITH DUAL BUTTONS
  const renderResults = (query) => {
    if (!searchResultsGrid) return;

    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) {
      searchResultsGrid.innerHTML = '';
      return;
    }

    const filtered = searchDatabase.filter(item => 
      item.title.toLowerCase().includes(searchTerm) || 
      item.category.toLowerCase().includes(searchTerm) ||
      item.desc.toLowerCase().includes(searchTerm)
    );

    if (filtered.length === 0) {
      searchResultsGrid.innerHTML = `<div class="no-results-msg">No jewellery pieces found matching "${query}". Try searching for 'ring', 'pearl', or 'necklace'.</div>`;
      return;
    }

    searchResultsGrid.innerHTML = filtered.map(item => `
      <div class="search-result-card">
        <img src="${item.image}" alt="${item.title}" class="search-result-img" onerror="this.src='https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=200'">
        <div class="search-result-info">
          <div>
            <h4>${item.title}</h4>
            <p>${item.desc}</p>
            <div class="search-result-price">${item.price}</div>
          </div>
          <div class="search-card-actions">
            <button class="btn-search-cart" onclick="addToCart('${item.id}', '${item.title}')">Add to Bag</button>
            <button class="btn-search-order" onclick="orderNow('${item.id}', '${item.title}')">Order Now</button>
          </div>
        </div>
      </div>
    `).join('');
  };

  // Input Listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderResults(e.target.value);
    });
  }

  // Suggestion Tag Listeners
  suggestionTags.forEach(tag => {
    tag.addEventListener('click', () => {
      const query = tag.getAttribute('data-query');
      if (searchInput) {
        searchInput.value = query;
        renderResults(query);
      }
    });
  });

});

// Global Fallbacks for Action Buttons
function addToCart(id, name) {
  alert(`${name} has been added to your shopping bag!`);
}

function orderNow(id, name) {
  alert(`Proceeding to checkout for ${name}`);
}