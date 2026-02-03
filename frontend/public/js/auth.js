// Tab switching
const tabs = document.querySelectorAll('.auth-tab');
const forms = document.querySelectorAll('.auth-form');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;

        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update active form
        forms.forEach(f => f.classList.remove('active'));
        document.getElementById(`${tabName}Form`).classList.add('active');

        // Clear messages
        document.getElementById('authMessage').innerHTML = '';
    });
});

// Password strength indicator
const passwordInput = document.getElementById('signupPassword');
const strengthBar = document.getElementById('passwordStrengthBar');

if (passwordInput && strengthBar) {
    passwordInput.addEventListener('input', (e) => {
        const password = e.target.value;
        let strength = 0;

        if (password.length >= 6) strength += 25;
        if (password.length >= 10) strength += 25;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 15;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 10;

        strength = Math.min(strength, 100);

        strengthBar.style.width = `${strength}%`;

        if (strength < 40) {
            strengthBar.style.background = 'var(--danger)';
        } else if (strength < 70) {
            strengthBar.style.background = 'var(--warning)';
        } else {
            strengthBar.style.background = 'var(--success)';
        }
    });
}

// Show message helper
function showMessage(message, type = 'success') {
    const messageDiv = document.getElementById('authMessage');
    const alertClass = type === 'success' ? 'alert-success' : 'alert-error';

    messageDiv.innerHTML = `
    <div class="alert ${alertClass}">
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      ${message}
    </div>
  `;

    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageDiv.innerHTML = '';
    }, 5000);
}

// Login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const credentials = {
        email: formData.get('email'),
        password: formData.get('password'),
    };

    try {
        const data = await api.login(credentials);

        if (data.success) {
            showMessage('Login successful! Redirecting...', 'success');

            // Redirect based on role
            setTimeout(() => {
                if (data.user.role === 'admin') {
                    window.location.href = 'admin/index.html';
                } else {
                    window.location.href = 'index.html';
                }
            }, 1500);
        }
    } catch (error) {
        showMessage(error.message || 'Login failed. Please check your credentials.', 'error');
    }
});

// Signup form submission
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        phone: formData.get('phone') || undefined,
    };

    // Validate password length
    if (userData.password.length < 6) {
        showMessage('Password must be at least 6 characters long', 'error');
        return;
    }

    try {
        const data = await api.register(userData);

        if (data.success) {
            showMessage('Account created successfully! Redirecting...', 'success');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }
    } catch (error) {
        showMessage(error.message || 'Registration failed. Please try again.', 'error');
    }
});

// Check if already logged in
if (api.isAuthenticated()) {
    const user = api.getUser();

    // Show message that user is already logged in
    showMessage(`You are already logged in as ${user.name}`, 'success');

    // Redirect after 2 seconds
    setTimeout(() => {
        if (user.role === 'admin') {
            window.location.href = 'admin/index.html';
        } else {
            window.location.href = 'index.html';
        }
    }, 2000);
}
