document.addEventListener('DOMContentLoaded', () => {
  const jewelleryType = document.getElementById('jewelleryType');
  const gemstoneStep = document.getElementById('gemstoneStep');
  const gemstoneSelect = document.getElementById('gemstoneSelect');
  const customNameInput = document.getElementById('customName');
  
  const previewImage = document.getElementById('previewImage');
  const customTextOverlay = document.getElementById('customTextOverlay');
  const gemstoneOverlay = document.getElementById('gemstoneOverlay');
  const previewBadge = document.getElementById('previewBadge');
  const metalButtons = document.querySelectorAll('.metal-btn');
  const btnOrderCustomPiece = document.getElementById('btnOrderCustomPiece');

  // Real HD Base Images for Necklace, Bracelet, Ring & Birthstone
  const baseImageMap = {
    necklace: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    bracelet: "https://images.unsplash.com/photo-1611591475169-952402967675?auto=format&fit=crop&q=80&w=800",
    ring: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800",
    birthstone: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800"
  };

  let selectedMetal = "Gold";
  let metalClass = "metal-gold";

  // 1. UPDATE LIVE NAME OVERLAY
  const updateCustomText = () => {
    const val = customNameInput.value.trim();
    customTextOverlay.textContent = val !== "" ? val : "Saba";
  };

  customNameInput.addEventListener('input', updateCustomText);

  // 2. JEWELLERY TYPE CHANGE HANDLER
  jewelleryType.addEventListener('change', (e) => {
    const type = e.target.value;

    if (type === 'birthstone') {
      gemstoneStep.classList.remove('is-hidden');
      gemstoneOverlay.classList.remove('is-hidden');
      updateGemstone();
    } else {
      gemstoneStep.classList.add('is-hidden');
      gemstoneOverlay.classList.add('is-hidden');
    }

    // Image Swap Transition
    previewImage.style.opacity = '0.3';
    setTimeout(() => {
      previewImage.src = baseImageMap[type];
      previewImage.style.opacity = '1';
      updateBadge();
    }, 200);
  });

  // 3. GEMSTONE COLOR HANDLER
  const updateGemstone = () => {
    const gem = gemstoneSelect.value;
    gemstoneOverlay.className = `custom-gemstone-overlay gem-${gem}`;
  };

  gemstoneSelect.addEventListener('change', updateGemstone);

  // 4. METAL BUTTON TOGGLE HANDLER
  metalButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      metalButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      selectedMetal = btn.dataset.color;
      
      // Update text shader class
      if (selectedMetal === 'Gold') metalClass = 'metal-gold';
      else if (selectedMetal === 'Silver') metalClass = 'metal-silver';
      else if (selectedMetal === 'Rose Gold') metalClass = 'metal-rosegold';

      customTextOverlay.className = `custom-text-overlay ${metalClass}`;
      updateBadge();
    });
  });

  // 5. UPDATE BADGE TEXT
  function updateBadge() {
    const selectedText = jewelleryType.options[jewelleryType.selectedIndex].text;
    previewBadge.textContent = `${selectedText} · ${selectedMetal}`;
  }

  // 6. CONNECT CUSTOM PIECE DIRECTLY TO ORDER CHECKOUT MODAL
  if (btnOrderCustomPiece) {
    btnOrderCustomPiece.addEventListener('click', () => {
      const customText = customNameInput.value.trim() || "Saba";
      const itemTitle = `Custom ${jewelleryType.options[jewelleryType.selectedIndex].text} ("${customText}")`;
      
      if (typeof window.orderNow === 'function') {
        window.orderNow('custom-piece-id', itemTitle);
      } else {
        alert(`Order Initiated for ${itemTitle} in ${selectedMetal}!`);
      }
    });
  }

  // Initial Sync
  updateCustomText();
});