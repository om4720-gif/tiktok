/* ============================================================
   LUXE COVERS — theme.js
   Cart AJAX · Customizer · Mobile Nav · Misc
   ============================================================ */

/* ── Cart state ── */
let cartCount = 0;

function updateCartCount(count) {
  cartCount = count;
  const badge = document.querySelector('.cart-count');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

function openCart() {
  document.getElementById('cart-drawer').classList.add('is-open');
  document.getElementById('cart-overlay').classList.add('is-open');
  document.body.style.overflow = 'hidden';
  fetchCart();
}

function closeCart() {
  document.getElementById('cart-drawer').classList.remove('is-open');
  document.getElementById('cart-overlay').classList.remove('is-open');
  document.body.style.overflow = '';
}

async function fetchCart() {
  try {
    const res = await fetch('/cart.js');
    const cart = await res.json();
    renderCartItems(cart);
    updateCartCount(cart.item_count);
    document.getElementById('cart-total').textContent = formatMoney(cart.total_price);
  } catch (e) {
    console.warn('Cart fetch failed', e);
  }
}

function formatMoney(cents) {
  return (cents / 100).toLocaleString('en-EG', { style: 'currency', currency: 'EGP' });
}

function renderCartItems(cart) {
  const container = document.getElementById('cart-drawer__items');
  if (!container) return;
  if (cart.item_count === 0) {
    container.innerHTML = '<div class="cart-empty"><p>Your cart is empty.</p><a href="/collections" class="button button-secondary" style="margin-top:16px;display:inline-flex;">Shop Now</a></div>';
    return;
  }
  container.innerHTML = cart.items.map(item => `
    <div class="cart-item">
      <img class="cart-item__img" src="${item.image || ''}" alt="${item.title}" />
      <div class="cart-item__info">
        <div class="cart-item__name">${item.product_title}</div>
        <div class="cart-item__meta">
          ${item.variant_title && item.variant_title !== 'Default Title' ? item.variant_title + '<br>' : ''}
          ${Object.entries(item.properties || {}).filter(([k,v]) => v).map(([k,v]) => `<span>${k}: ${v}</span>`).join('<br>')}
        </div>
        <div class="cart-item__price">${formatMoney(item.final_line_price)} <span style="color:var(--neutral-400);font-weight:400">× ${item.quantity}</span></div>
        <button class="cart-item__remove" onclick="removeCartItem('${item.key}')">Remove</button>
      </div>
    </div>
  `).join('');
}

async function removeCartItem(key) {
  await fetch('/cart/change.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: key, quantity: 0 })
  });
  fetchCart();
}

async function addToCart(variantId, quantity, properties) {
  const res = await fetch('/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: variantId, quantity: quantity || 1, properties: properties || {} })
  });
  const data = await res.json();
  if (data.id) {
    await fetchCart();
    openCart();
  }
  return data;
}

/* ── Mobile nav ── */
function toggleMobileNav() {
  document.getElementById('mobile-nav').classList.toggle('is-open');
}

/* ── Customizer ── */
const ENGRAVING_COST_EGP = 30;
let customizerState = {
  deviceId: null,
  deviceName: '',
  deviceType: 'macbook',
  basePrice: 500,
  colorId: 'burgundy',
  colorName: 'Burgundy Crocodile',
  engravingEnabled: true,
  engravingText: '',
  engravingFont: 'Dancing Script, cursive',
  engravingFontName: 'Elegant Script',
  engravingColor: '#D4AF37',
  engravingColorName: 'Gold',
  quantity: 1,
  variantId: null,
};

function initCustomizer() {
  const section = document.querySelector('[data-customizer]');
  if (!section) return;

  // Device buttons
  section.querySelectorAll('.device-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      section.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      customizerState.deviceId = btn.dataset.deviceId;
      customizerState.deviceName = btn.dataset.deviceName;
      customizerState.deviceType = btn.dataset.deviceType;
      customizerState.basePrice = parseInt(btn.dataset.price, 10);
      customizerState.variantId = btn.dataset.variantId || null;
      updatePrice();
      updatePreviewImage();
    });
  });

  // Color swatches
  section.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      section.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      customizerState.colorId = swatch.dataset.colorId;
      customizerState.colorName = swatch.dataset.colorName;
      const nameEl = section.querySelector('.color-name-display');
      if (nameEl) nameEl.textContent = customizerState.colorName;
      updatePreviewImage();
    });
  });

  // Engraving toggle
  const engravingCheck = section.querySelector('#engraving-toggle');
  const engravingFields = section.querySelector('.engraving-fields');
  if (engravingCheck) {
    engravingCheck.addEventListener('change', () => {
      customizerState.engravingEnabled = engravingCheck.checked;
      engravingFields.classList.toggle('hidden', !engravingCheck.checked);
      updatePrice();
      updateEngravingPreview();
    });
  }

  // Engraving text
  const engravingInput = section.querySelector('#engraving-text');
  if (engravingInput) {
    engravingInput.addEventListener('input', () => {
      customizerState.engravingText = engravingInput.value;
      const counter = section.querySelector('.field-count');
      if (counter) counter.textContent = `${engravingInput.value.length} / 25`;
      updatePrice();
      updateEngravingPreview();
    });
  }

  // Font buttons
  section.querySelectorAll('.font-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      section.querySelectorAll('.font-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      customizerState.engravingFont = btn.dataset.font;
      customizerState.engravingFontName = btn.dataset.fontName;
      updateEngravingPreview();
    });
  });

  // Engraving color
  section.querySelectorAll('.engraving-color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      section.querySelectorAll('.engraving-color-swatch').forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      customizerState.engravingColor = swatch.dataset.color;
      customizerState.engravingColorName = swatch.dataset.colorName;
      updateEngravingPreview();
    });
  });

  // Quantity
  const qtyMinus = section.querySelector('.qty-minus');
  const qtyPlus = section.querySelector('.qty-plus');
  const qtyDisplay = section.querySelector('.qty-value');
  if (qtyMinus) {
    qtyMinus.addEventListener('click', () => {
      if (customizerState.quantity > 1) {
        customizerState.quantity--;
        qtyDisplay.textContent = customizerState.quantity;
        updatePrice();
      }
    });
  }
  if (qtyPlus) {
    qtyPlus.addEventListener('click', () => {
      customizerState.quantity++;
      qtyDisplay.textContent = customizerState.quantity;
      updatePrice();
    });
  }

  // Add to cart
  const addBtn = section.querySelector('.customizer-add-btn');
  if (addBtn) {
    addBtn.addEventListener('click', async () => {
      if (!customizerState.variantId) {
        alert('Please select a device model first.');
        return;
      }
      const props = {
        'Device': customizerState.deviceName,
        'Color': customizerState.colorName,
      };
      if (customizerState.engravingEnabled && customizerState.engravingText) {
        props['Engraving text'] = customizerState.engravingText;
        props['Engraving font'] = customizerState.engravingFontName;
        props['Engraving color'] = customizerState.engravingColorName;
      }
      addBtn.textContent = 'Adding…';
      addBtn.disabled = true;
      try {
        await addToCart(customizerState.variantId, customizerState.quantity, props);
        addBtn.textContent = 'Added! ✓';
        setTimeout(() => { addBtn.textContent = 'ADD TO CART'; addBtn.disabled = false; }, 2000);
      } catch (e) {
        addBtn.textContent = 'Error — Try Again';
        addBtn.disabled = false;
      }
    });
  }

  // Buy now
  const buyBtn = section.querySelector('.customizer-buy-btn');
  if (buyBtn) {
    buyBtn.addEventListener('click', async () => {
      if (!customizerState.variantId) { alert('Please select a device model first.'); return; }
      const props = {
        'Device': customizerState.deviceName,
        'Color': customizerState.colorName,
      };
      if (customizerState.engravingEnabled && customizerState.engravingText) {
        props['Engraving text'] = customizerState.engravingText;
        props['Engraving font'] = customizerState.engravingFontName;
        props['Engraving color'] = customizerState.engravingColorName;
      }
      await addToCart(customizerState.variantId, customizerState.quantity, props);
      window.location.href = '/checkout';
    });
  }

  updatePrice();
}

function updatePrice() {
  const engravingAdd = customizerState.engravingEnabled && customizerState.engravingText ? ENGRAVING_COST_EGP : 0;
  const unit = customizerState.basePrice + engravingAdd;
  const total = unit * customizerState.quantity;
  const priceEl = document.querySelector('.price-display');
  const breakdownEl = document.querySelector('.price-breakdown');
  if (priceEl) priceEl.textContent = `${total} EGP`;
  if (breakdownEl) {
    breakdownEl.textContent = engravingAdd
      ? `Base ${customizerState.basePrice} EGP + Engraving ${ENGRAVING_COST_EGP} EGP${customizerState.quantity > 1 ? ` × ${customizerState.quantity}` : ''}`
      : customizerState.quantity > 1 ? `${unit} EGP × ${customizerState.quantity}` : '';
  }
}

function updatePreviewImage() {
  const img = document.querySelector('.preview-panel__img');
  if (!img) return;
  const type = customizerState.deviceType;
  const colorId = customizerState.colorId;
  const extMap = { forest: 'svg', navy: 'svg', ivory: 'svg' };
  const ext = extMap[colorId] || (colorId === 'black' || colorId === 'burgundy' || colorId === 'camel' ? 'jpg' : 'png');
  img.style.opacity = '0.5';
  const newSrc = `{{ 'placeholder.png' | asset_url }}`.replace('placeholder.png', `product-${type}-${colorId}.${ext}`);
  img.onload = () => { img.style.opacity = '1'; };
  img.src = newSrc;
}

function updateEngravingPreview() {
  const overlay = document.querySelector('.preview-panel__engraving');
  if (!overlay) return;
  const show = customizerState.engravingEnabled && customizerState.engravingText;
  overlay.classList.toggle('hidden', !show);
  const textEl = overlay.querySelector('.engraving-text');
  if (textEl) {
    textEl.textContent = customizerState.engravingText;
    textEl.style.fontFamily = customizerState.engravingFont;
    textEl.style.color = customizerState.engravingColor;
  }
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  fetchCart();
  initCustomizer();
  // Activate first device btn
  const firstDevice = document.querySelector('.device-btn');
  if (firstDevice) firstDevice.click();
  // Activate first color
  const firstColor = document.querySelector('.color-swatch');
  if (firstColor) firstColor.click();
  // Activate first font
  const firstFont = document.querySelector('.font-btn');
  if (firstFont) firstFont.classList.add('active');
  // Activate first engraving color
  const firstEngColor = document.querySelector('.engraving-color-swatch');
  if (firstEngColor) firstEngColor.classList.add('active');
});
