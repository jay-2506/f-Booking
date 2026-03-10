/**
 * Utilities and common Javascript logic for Temple Booking System Frontend
 */

// Configuration
const CONFIG = {
    // Update this to match your backend URL when testing with real API
    API_BASE_URL: 'https://booking-yav1.onrender.com/api',
    // Fallback realistic placeholder images if real ones are missing
    FALLBACK_TEMPLE_IMG: 'https://images.unsplash.com/photo-1590050860570-5b6510e16bc9?auto=format&fit=crop&q=80&w=800'
};

// State Management
const STATE = {
    token: localStorage.getItem('temple_auth_token') || null,
    user: JSON.parse(localStorage.getItem('temple_user')) || null
};

// DOM Content Loaded Handler for Global Initialization
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    updateAuthUI();
});

// Initialize Mobile Menu Toggle
function initMobileMenu() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navbar = document.querySelector('.navbar');

    if (mobileBtn && navbar) {
        mobileBtn.addEventListener('click', () => {
            navbar.classList.toggle('menu-open');
            const icon = mobileBtn.querySelector('i');
            if (navbar.classList.contains('menu-open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
}

// Update Navbar based on Auth State
function updateAuthUI() {
    const authButtonsContainer = document.getElementById('auth-buttons');
    if (!authButtonsContainer) return;

    if (STATE.token && STATE.user) {
        // User is logged in
        authButtonsContainer.innerHTML = `
      <a href="my-bookings.html" class="nav-item">My Bookings</a>
      <span class="nav-item" style="color: var(--text-muted);">Hi, ${STATE.user.name || 'User'}</span>
      <button onclick="logout()" class="btn btn-outline" style="padding: 8px 16px;">Logout</button>
    `;
    } else {
        // User is not logged in
        authButtonsContainer.innerHTML = `
      <a href="login.html" class="nav-item">Login</a>
      <a href="register.html" class="btn" style="padding: 8px 16px;">Sign Up</a>
    `;
    }
}

// Global Logout Function
function logout() {
    localStorage.removeItem('temple_auth_token');
    localStorage.removeItem('temple_user');
    STATE.token = null;
    STATE.user = null;

    window.location.href = 'index.html'; // Redirect to home
}

/**
 * Utility function for making API requests.
 */
async function apiRequest(endpoint, options = {}) {
    const url = `${CONFIG.API_BASE_URL}${endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (STATE.token) {
        headers['Authorization'] = `Bearer ${STATE.token}`;
    }

    const fetchOptions = {
        ...options,
        headers
    };

    try {
        const response = await fetch(url, fetchOptions);
        const data = await response.json().catch(() => null);

        if (response.status === 401 || response.status === 403) {
            logout();
            throw new Error('Unauthorized. Please login again.');
        }

        if (!response.ok) {
            throw new Error(data?.message || `API Error: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        throw error;
    }
}

function showToast(message, type = 'info') {
    alert(message);
}
