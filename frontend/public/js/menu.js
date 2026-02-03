// Global variables
let allMenuItems = [];
let currentCategory = 'all';
let searchQuery = '';

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    await loadMenuItems();
    setupEventListeners();
    updateCartDisplay();
    checkUrlParams();
});

// Check URL parameters (for category filtering from home page)
function checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');

    if (category) {
        currentCategory = category;

        // Update active category button
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            }
        });

        filterMenuItems();
    }
}

// Load menu items from API
async function loadMenuItems() {
    const container = document.getElementById('menuItems');

    try {
        const response = await api.getMenuItems();

        if (response.success) {
            allMenuItems = response.data;
            filterMenuItems();
        } else {
            container.innerHTML = '<p style="text-align: center; color: var(--text-light);">Failed to load menu items</p>';
        }
    } catch (error) {
        console.error('Error loading menu:', error);
        container.innerHTML = '<p style="text-align: center; color: var(--danger);">Error loading menu. Please try again later.</p>';
    }
}

// Filter and display menu items
function filterMenuItems() {
    let filtered = allMenuItems;

    // Filter by category
    if (currentCategory !== 'all') {
        filtered = filtered.filter(item => item.category === currentCategory);
    }

    // Filter by search query
    if (searchQuery) {
        filtered = filtered.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    displayMenuItems(filtered);
}

// Display menu items
function displayMenuItems(items) {
    const container = document.getElementById('menuItems');

    if (items.length === 0) {
        container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <i class="fas fa-search" style="font-size: 4rem; color: var(--light-bg); margin-bottom: 1rem;"></i>
        <p style="color: var(--text-light); font-size: 1.1rem;">No items found</p>
      </div>
    `;
        return;
    }

    container.innerHTML = items.map(item => `
    <div class="card fade-in">
      <img src="${item.image}" alt="${item.name}" class="card-img">
      <div class="card-body">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
          <h3 class="card-title">${item.name}</h3>
          ${item.featured ? '<span style="background: var(--secondary-color); color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">FEATURED</span>' : ''}
        </div>
        <p class="card-text">${item.description}</p>
        <div class="card-price">$${item.price.toFixed(2)}</div>
        ${item.isAvailable ?
            `<button class="btn btn-primary" style="width: 100%;" onclick="addToCart('${item._id}', '${item.name.replace(/'/g, "\\'")}', ${item.price}, '${item.image.replace(/'/g, "\\'")}')">
            <i class="fas fa-shopping-cart"></i> Add to Cart
          </button>` :
            `<button class="btn" style="width: 100%; background: var(--light-bg); color: var(--text-light); cursor: not-allowed;" disabled>
            Out of Stock
          </button>`
        }
      </div>
    </div>
  `).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Category filter buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentCategory = btn.dataset.category;

            // Update active button
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            filterMenuItems();
        });
    });

    // Search input
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        filterMenuItems();
    });

    // Cart icon
    document.getElementById('cartIcon').addEventListener('click', (e) => {
        e.preventDefault();
        openCartModal();
    });

    // Close cart modal
    document.getElementById('closeCart').addEventListener('click', closeCartModal);

    // Close checkout modal
    document.getElementById('closeCheckout').addEventListener('click', closeCheckoutModal);

    // Checkout button
    document.getElementById('checkoutBtn').addEventListener('click', () => {
        if (!api.isAuthenticated()) {
            alert('Please login to checkout');
            window.location.href = 'auth.html';
            return;
        }

        closeCartModal();
        openCheckoutModal();
    });

    // Checkout form
    document.getElementById('checkoutForm').addEventListener('submit', handleCheckout);

    // Mobile menu toggle
    document.getElementById('mobileMenuToggle')?.addEventListener('click', () => {
        document.getElementById('navMenu').classList.toggle('active');
    });

    // Close modals on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// Add item to cart
function addToCart(menuItemId, name, price, image) {
    cart.addItem({
        menuItem: menuItemId,
        name,
        price,
        image,
        quantity: 1
    });

    updateCartDisplay();

    // Show feedback
    showNotification('Item added to cart!');
}

// Update cart display
function updateCartDisplay() {
    const cartItems = cart.getCart();
    const cartItemsContainer = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    const emptyCart = document.getElementById('emptyCart');
    const cartTotal = document.getElementById('cartTotal');

    if (cartItems.length === 0) {
        cartItemsContainer.style.display = 'none';
        cartSummary.style.display = 'none';
        emptyCart.style.display = 'block';
        return;
    }

    cartItemsContainer.style.display = 'block';
    cartSummary.style.display = 'block';
    emptyCart.style.display = 'none';

    cartItemsContainer.innerHTML = cartItems.map(item => `
    <div style="display: flex; gap: 1rem; padding: 1rem; border-bottom: 1px solid var(--light-bg);">
      <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: var(--radius-sm);">
      <div style="flex: 1;">
        <h4 style="font-weight: 600; margin-bottom: 0.5rem;">${item.name}</h4>
        <p style="color: var(--primary-color); font-weight: 700;">$${item.price.toFixed(2)}</p>
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem;">
          <button onclick="updateCartQuantity('${item.menuItem}', ${item.quantity - 1})" class="btn" style="padding: 4px 8px; background: var(--light-bg);">
            <i class="fas fa-minus"></i>
          </button>
          <span style="font-weight: 600; min-width: 30px; text-align: center;">${item.quantity}</span>
          <button onclick="updateCartQuantity('${item.menuItem}', ${item.quantity + 1})" class="btn" style="padding: 4px 8px; background: var(--light-bg);">
            <i class="fas fa-plus"></i>
          </button>
          <button onclick="removeFromCart('${item.menuItem}')" class="btn" style="padding: 4px 8px; background: var(--danger); color: white; margin-left: auto;">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');

    cartTotal.textContent = `$${cart.getTotal().toFixed(2)}`;
}

// Update cart quantity
function updateCartQuantity(menuItemId, quantity) {
    cart.updateQuantity(menuItemId, quantity);
    updateCartDisplay();
}

// Remove from cart
function removeFromCart(menuItemId) {
    cart.removeItem(menuItemId);
    updateCartDisplay();
    showNotification('Item removed from cart');
}

// Modal functions
function openCartModal() {
    document.getElementById('cartModal').classList.add('active');
    updateCartDisplay();
}

function closeCartModal() {
    document.getElementById('cartModal').classList.remove('active');
}

function openCheckoutModal() {
    document.getElementById('checkoutModal').classList.add('active');
}

function closeCheckoutModal() {
    document.getElementById('checkoutModal').classList.remove('active');
}

// Handle checkout
async function handleCheckout(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const cartItems = cart.getCart();

    if (cartItems.length === 0) {
        alert('Your cart is empty');
        return;
    }

    const orderData = {
        items: cartItems,
        deliveryAddress: {
            street: formData.get('street'),
            city: formData.get('city'),
            state: formData.get('state'),
            zipCode: formData.get('zipCode')
        },
        contactPhone: formData.get('phone'),
        orderNotes: formData.get('notes') || '',
        paymentMethod: 'COD' // Explicitly setting it, though backend defaults to it.
    };

    try {
        const response = await api.createOrder(orderData);

        if (response.success) {
            cart.clear();
            closeCheckoutModal();

            // Show success message
            alert(`Order placed successfully!\n\nOrder Number: ${response.data.orderNumber || 'pending'}\nEstimated Delivery: ${response.data.estimatedDeliveryTime ? new Date(response.data.estimatedDeliveryTime).toLocaleTimeString() : '45 minutes'}\n\nPayment Method: Cash on Delivery\nPlease have cash ready upon arrival.`);

            // Redirect to profile to see orders
            window.location.href = 'profile.html';
        }
    } catch (error) {
        alert('Failed to place order: ' + (error.message || 'Please try again'));
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'alert alert-success';
    notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    z-index: 3000;
    min-width: 250px;
    animation: fadeInUp 0.3s ease;
  `;
    notification.innerHTML = `
    <i class="fas fa-check-circle"></i>
    ${message}
  `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeInUp 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}
