// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    setupFAQ();
    setupNewsletter();
    loadFeaturedDishes();
});

// Mobile menu toggle
function setupMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const menu = document.getElementById('navMenu');

    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');

            // Change icon
            const icon = toggle.querySelector('i');
            if (menu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !menu.contains(e.target)) {
                menu.classList.remove('active');
                const icon = toggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
}

// FAQ Accordion
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const answer = item.querySelector('.faq-answer');
            const icon = item.querySelector('i');

            // Toggle answer visibility
            if (answer.style.display === 'block') {
                answer.style.display = 'none';
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            } else {
                // Close all other FAQs
                faqItems.forEach(otherItem => {
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = otherItem.querySelector('i');
                    otherAnswer.style.display = 'none';
                    otherIcon.classList.remove('fa-chevron-up');
                    otherIcon.classList.add('fa-chevron-down');
                });

                // Open clicked FAQ
                answer.style.display = 'block';
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }
        });
    });
}

// Newsletter subscription
function setupNewsletter() {
    const forms = document.querySelectorAll('.newsletter-form');

    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = form.querySelector('input[type="email"]').value;

            // Show success message (in production, this would send to backend)
            alert(`Thank you for subscribing! We'll send updates to ${email}`);
            form.reset();
        });
    });
}

// Load featured dishes on home page
async function loadFeaturedDishes() {
    const container = document.getElementById('featuredDishes');

    if (!container) return;

    try {
        const response = await api.getMenuItems({ featured: 'true' });

        if (response.success && response.data.length > 0) {
            // Show maximum 6 featured items
            const featured = response.data.slice(0, 6);

            container.innerHTML = featured.map(item => `
        <div class="card fade-in">
          <img src="${item.image}" alt="${item.name}" class="card-img">
          <div class="card-body">
            <h3 class="card-title">${item.name}</h3>
            <p class="card-text">${item.description}</p>
            <div class="card-price">$${item.price.toFixed(2)}</div>
            <a href="menu.html" class="btn btn-primary" style="width: 100%;">Order Now</a>
          </div>
        </div>
      `).join('');
        } else {
            container.innerHTML = '<p style="text-align: center; color: var(--text-light);">No featured dishes available</p>';
        }
    } catch (error) {
        console.error('Error loading featured dishes:', error);
        container.innerHTML = '<p style="text-align: center; color: var(--text-light);">Unable to load featured dishes</p>';
    }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.boxShadow = 'var(--shadow-md)';
    } else {
        header.style.boxShadow = 'var(--shadow-sm)';
    }

    lastScroll = currentScroll;
});

// Update cart badge
function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) {
        const cartItems = cart.getCart();
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalItems;
    }
}

// Call on page load
updateCartBadge();

// Update user icon based on auth status
const userIcon = document.getElementById('userIcon');
if (userIcon) {
    userIcon.addEventListener('click', (e) => {
        e.preventDefault();

        if (api.isAuthenticated()) {
            // User is logged in, redirect to profile
            window.location.href = 'profile.html';
        } else {
            // User is not logged in, redirect to auth
            window.location.href = 'auth.html';
        }
    });

    // Update icon appearance based on auth status
    if (api.isAuthenticated()) {
        const user = api.getUser();
        userIcon.title = `Logged in as ${user.name}`;
        userIcon.style.color = 'var(--primary-color)';
    } else {
        userIcon.title = 'Sign In / Login';
    }
}
