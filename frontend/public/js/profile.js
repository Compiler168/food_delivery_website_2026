// Check if user is logged in
if (!api.isAuthenticated()) {
  window.location.href = 'auth.html';
}

// Load user profile
async function loadProfile() {
  try {
    const response = await api.getProfile();

    if (response.success) {
      const user = response.user;

      // Update welcome text
      document.getElementById('welcomeText').textContent = `Welcome back, ${user.name}!`;

      // Fill form fields
      document.getElementById('profileName').value = user.name || '';
      document.getElementById('profileEmail').value = user.email || '';
      document.getElementById('profilePhone').value = user.phone || '';

      // Fill address fields
      if (user.address) {
        document.getElementById('addressStreet').value = user.address.street || '';
        document.getElementById('addressCity').value = user.address.city || '';
        document.getElementById('addressState').value = user.address.state || '';
        document.getElementById('addressZipCode').value = user.address.zipCode || '';
      }

      // Load orders
      await loadOrders();
    }
  } catch (error) {
    console.error('Error loading profile:', error);
    showMessage('Error loading profile. Please try again.', 'error');
  }
}

// Load order history
async function loadOrders() {
  const container = document.getElementById('ordersContainer');

  try {
    const response = await api.getOrders();

    if (response.success) {
      const orders = response.data;

      if (orders.length === 0) {
        container.innerHTML = `
          <div style="text-align: center; padding: 2rem; background: white; border-radius: var(--radius-md);">
            <i class="fas fa-shopping-bag" style="font-size: 4rem; color: var(--light-bg); margin-bottom: 1rem;"></i>
            <p style="color: var(--text-light); margin-bottom: 1rem;">No orders yet</p>
            <a href="/menu" class="btn btn-primary">Start Ordering</a>
          </div>
        `;
        return;
      }

      container.innerHTML = orders.map(order => {
        const statusColors = {
          'pending': 'var(--warning)',
          'confirmed': 'var(--accent-color)',
          'preparing': 'var(--secondary-color)',
          'out for delivery': 'var(--primary-color)',
          'delivered': 'var(--success)',
          'cancelled': 'var(--danger)'
        };

        const statusColor = statusColors[order.status] || 'var(--text-light)';
        const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        return `
          <div class="card" style="margin-bottom: 1.5rem;">
            <div class="card-body">
              <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div>
                  <h3 style="font-weight: 700; margin-bottom: 0.25rem;">Order #${order._id.slice(-8).toUpperCase()}</h3>
                  <p style="color: var(--text-light); font-size: 0.9rem;">${orderDate}</p>
                </div>
                <span style="background: ${statusColor}; color: white; padding: 6px 12px; border-radius: var(--radius-full); font-size: 0.85rem; font-weight: 600; text-transform: uppercase;">
                  ${order.status}
                </span>
              </div>
              
              <div style="margin-bottom: 0.5rem; display: flex; align-items: center; justify-content: space-between;">
                 <span style="font-size: 0.9rem; color: var(--text-light);">
                    Payment: <strong>${order.paymentMethod || 'COD'}</strong>
                 </span>
                 <span style="background: ${order.paymentStatus === 'paid' ? 'var(--success)' : 'var(--warning)'}; color: white; padding: 4px 10px; border-radius: 4px; font-size: 0.75rem;">
                    ${order.paymentStatus === 'paid' ? 'PAID' : 'PAYMENT PENDING'}
                 </span>
              </div>
              
              <div style="border-top: 1px solid var(--light-bg); padding-top: 1rem; margin-top: 1rem;">
                ${order.items.map(item => `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span>${item.quantity}x ${item.name}</span>
                    <span style="font-weight: 600;">$${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                `).join('')}
              </div>
              
              <div style="border-top: 2px solid var(--light-bg); padding-top: 1rem; margin-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 700; font-size: 1.1rem;">Total:</span>
                <span style="font-weight: 700; font-size: 1.2rem; color: var(--primary-color);">$${order.totalAmount.toFixed(2)}</span>
              </div>
              
              ${order.deliveryAddress ? `
                <div style="margin-top: 1rem; padding: 0.75rem; background: var(--light-bg); border-radius: var(--radius-sm); font-size: 0.9rem;">
                  <strong>Delivery Address:</strong><br>
                  ${order.deliveryAddress.street}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state} ${order.deliveryAddress.zipCode}
                </div>
              ` : ''}
            </div>
          </div>
        `;
      }).join('');
    }
  } catch (error) {
    console.error('Error loading orders:', error);
    container.innerHTML = '<p style="text-align: center; color: var(--danger);">Error loading orders</p>';
  }
}

// Update profile form submission
document.getElementById('profileForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  const userData = {
    name: formData.get('name'),
    phone: formData.get('phone'),
    address: {
      street: formData.get('address.street'),
      city: formData.get('address.city'),
      state: formData.get('address.state'),
      zipCode: formData.get('address.zipCode')
    }
  };

  try {
    const response = await api.updateProfile(userData);

    if (response.success) {
      // Update stored user data
      const currentUser = api.getUser();
      api.setUser({ ...currentUser, ...response.user });

      showMessage('Profile updated successfully!', 'success');
    }
  } catch (error) {
    showMessage(error.message || 'Failed to update profile', 'error');
  }
});

// Logout function
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    api.logout();
  }
}

// Show message
function showMessage(message, type = 'success') {
  const messageDiv = document.getElementById('profileMessage');
  const alertClass = type === 'success' ? 'alert-success' : 'alert-error';

  messageDiv.innerHTML = `
    <div class="alert ${alertClass}">
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      ${message}
    </div>
  `;

  setTimeout(() => {
    messageDiv.innerHTML = '';
  }, 5000);
}

// Initialize page
loadProfile();

// Mobile menu toggle
document.getElementById('mobileMenuToggle')?.addEventListener('click', () => {
  document.getElementById('navMenu').classList.toggle('active');
});

// Update cart badge
cart.updateBadge();
