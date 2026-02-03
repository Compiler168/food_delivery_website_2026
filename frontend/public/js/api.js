// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// API Client
const api = {
    // Get auth token from localStorage
    getToken() {
        return localStorage.getItem('authToken');
    },

    // Set auth token
    setToken(token) {
        localStorage.setItem('authToken', token);
    },

    // Get user data
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Set user data
    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    },

    // Clear auth data
    clearAuth() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    },

    // Check if user is logged in
    isAuthenticated() {
        return !!this.getToken();
    },

    // Check if user is admin
    isAdmin() {
        const user = this.getUser();
        return user && user.role === 'admin';
    },

    // Make authenticated request
    async request(endpoint, options = {}) {
        const token = this.getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Auth endpoints
    async register(userData) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });

        if (data.token) {
            this.setToken(data.token);
            this.setUser(data.user);
        }

        return data;
    },

    async login(credentials) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });

        if (data.token) {
            this.setToken(data.token);
            this.setUser(data.user);
        }

        return data;
    },

    async getProfile() {
        return await this.request('/auth/profile');
    },

    async updateProfile(userData) {
        return await this.request('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    },

    logout() {
        this.clearAuth();
        window.location.href = 'index.html';
    },

    // Menu endpoints
    async getMenuItems(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/menu?${queryString}` : '/menu';
        return await this.request(endpoint);
    },

    async getMenuItem(id) {
        return await this.request(`/menu/${id}`);
    },

    async createMenuItem(menuData) {
        return await this.request('/menu', {
            method: 'POST',
            body: JSON.stringify(menuData),
        });
    },

    async updateMenuItem(id, menuData) {
        return await this.request(`/menu/${id}`, {
            method: 'PUT',
            body: JSON.stringify(menuData),
        });
    },

    async deleteMenuItem(id) {
        return await this.request(`/menu/${id}`, {
            method: 'DELETE',
        });
    },

    // Order endpoints
    async createOrder(orderData) {
        return await this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    },

    async getOrders() {
        return await this.request('/orders');
    },

    async getOrder(id) {
        return await this.request(`/orders/${id}`);
    },

    async getAllOrders(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/orders/all/admin?${queryString}` : '/orders/all/admin';
        return await this.request(endpoint);
    },

    async updateOrderStatus(id, status) {
        return await this.request(`/orders/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    },
};

// Cart management
const cart = {
    getCart() {
        const cartData = localStorage.getItem('cart');
        return cartData ? JSON.parse(cartData) : [];
    },

    saveCart(cartItems) {
        localStorage.setItem('cart', JSON.stringify(cartItems));
        this.updateBadge();
    },

    addItem(item) {
        const cartItems = this.getCart();
        const existingItem = cartItems.find(i => i.menuItem === item.menuItem);

        if (existingItem) {
            existingItem.quantity += item.quantity || 1;
        } else {
            cartItems.push({
                ...item,
                quantity: item.quantity || 1,
            });
        }

        this.saveCart(cartItems);
        return cartItems;
    },

    removeItem(menuItemId) {
        const cartItems = this.getCart();
        const filtered = cartItems.filter(item => item.menuItem !== menuItemId);
        this.saveCart(filtered);
        return filtered;
    },

    updateQuantity(menuItemId, quantity) {
        const cartItems = this.getCart();
        const item = cartItems.find(i => i.menuItem === menuItemId);

        if (item) {
            if (quantity <= 0) {
                return this.removeItem(menuItemId);
            }
            item.quantity = quantity;
            this.saveCart(cartItems);
        }

        return cartItems;
    },

    getTotal() {
        const cartItems = this.getCart();
        return cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    },

    getItemCount() {
        const cartItems = this.getCart();
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    },

    clear() {
        localStorage.removeItem('cart');
        this.updateBadge();
    },

    updateBadge() {
        const badge = document.getElementById('cartBadge');
        if (badge) {
            badge.textContent = this.getItemCount();
        }
    },
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    cart.updateBadge();

    // Update user icon if logged in
    const userIcon = document.getElementById('userIcon');
    if (userIcon && api.isAuthenticated()) {
        const user = api.getUser();
        userIcon.href = 'profile.html';
        userIcon.title = user.name;
    }
});
