// Check authentication and admin access
if (!api.isAuthenticated() || !api.isAdmin()) {
  alert('Unauthorized access. Admin privileges required.');
  window.location.href = '../auth.html';
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async () => {
  const user = api.getUser();
  document.getElementById('adminName').textContent = user.name;

  await loadDashboardData();
});

// Load dashboard data
async function loadDashboardData() {
  try {
    // Load orders and menu items in parallel
    const [ordersResponse, menuResponse] = await Promise.all([
      api.getAllOrders(),
      api.getMenuItems()
    ]);

    if (ordersResponse.success) {
      const orders = ordersResponse.data;

      // Update stats
      document.getElementById('totalOrders').textContent = orders.length;

      const totalRevenue = orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, order) => sum + order.totalAmount, 0);
      document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;

      const pendingCount = orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length;
      document.getElementById('pendingOrders').textContent = pendingCount;

      // Display recent orders
      displayRecentOrders(orders.slice(0, 5));
    }

    if (menuResponse.success) {
      const menuItems = menuResponse.data;
      document.getElementById('totalMenuItems').textContent = menuItems.length;

      // Display menu overview
      displayMenuOverview(menuItems);
    }
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
}

// Display recent orders
function displayRecentOrders(orders) {
  const container = document.getElementById('recentOrders');

  if (orders.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 2rem;">No orders yet</p>';
    return;
  }

  container.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Customer</th>
          <th>Items</th>
          <th>Total</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        ${orders.map(order => `
          <tr>
            <td>#${order._id.slice(-8).toUpperCase()}</td>
            <td>${order.user?.name || 'N/A'}</td>
            <td>${order.items.length} items</td>
            <td style="font-weight: 600;">$${order.totalAmount.toFixed(2)}</td>
            <td><span class="status-badge status-${order.status.replace(/ /g, '-')}">${order.status}</span></td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// Display menu overview
function displayMenuOverview(menuItems) {
  const container = document.getElementById('menuOverview');

  // Group by category
  const categories = {};
  menuItems.forEach(item => {
    if (!categories[item.category]) {
      categories[item.category] = [];
    }
    categories[item.category].push(item);
  });

  container.innerHTML = `
    <div class="grid grid-4" style="gap: 1rem;">
      ${Object.entries(categories).map(([category, items]) => `
        <div style="padding: 1.5rem; background: var(--light-bg); border-radius: var(--radius-md); text-align: center;">
          <h3 style="font-weight: 700; margin-bottom: 0.5rem;">${category}</h3>
          <p style="font-size: 2rem; font-weight: 700; color: var(--primary-color);">${items.length}</p>
          <p style="color: var(--text-light); font-size: 0.9rem;">items</p>
        </div>
      `).join('')}
    </div>
  `;
}

// Logout function
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    api.logout();
  }
}
