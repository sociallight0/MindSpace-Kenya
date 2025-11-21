// Configuration
const USE_LOCAL_STORAGE = true; // Set to false to use PHP backend
const API_BASE_URL = '/api';

// Login Form Handler
document.getElementById('loginForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // Clear previous errors
    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';
    
    // Validation
    if (!email) {
        document.getElementById('emailError').textContent = 'Email is required';
        return;
    }
    
    if (!password) {
        document.getElementById('passwordError').textContent = 'Password is required';
        return;
    }
    
    // Show loading
    const btn = this.querySelector('.login-btn');
    const btnText = btn.querySelector('.btn-text');
    const loadingText = btn.querySelector('.loading');
    
    btn.disabled = true;
    btnText.classList.add('hidden');
    loadingText.classList.remove('hidden');
    
    try {
        if (USE_LOCAL_STORAGE) {
            await loginWithLocalStorage(email, password);
        } else {
            await loginWithAPI(email, password);
        }
    } catch (error) {
        document.getElementById('passwordError').textContent = error.message;
        btn.disabled = false;
        btnText.classList.remove('hidden');
        loadingText.classList.add('hidden');
    }
});

// Login with LocalStorage
async function loginWithLocalStorage(email, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = JSON.parse(localStorage.getItem('mindspace_users') || '[]');
            const user = users.find(u => 
                (u.email === email || u.phone === email) && u.password === password
            );
            
            if (user) {
                // Store current user session
                localStorage.setItem('mindspace_user', JSON.stringify({
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    profilePic: user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10b981&color=fff&size=200`,
                    joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                }));
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
                resolve();
            } else {
                reject(new Error('Invalid email or password'));
            }
        }, 1000);
    });
}

// Login with API
async function loginWithAPI(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/login.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Store user session
            localStorage.setItem('mindspace_user', JSON.stringify(data.user));
            localStorage.setItem('mindspace_token', data.token);
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            throw new Error(data.message || 'Login failed');
        }
    } catch (error) {
        throw new Error('An error occurred. Please try again.');
    }
}

// Forgot Password Handler
function forgotPassword(e) {
    e.preventDefault();
    
    const email = prompt('Please enter your email address:');
    
    if (email) {
        if (!/\S+@\S+\.\S+/.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // In production, this would send a real password reset email
        alert(`Password reset instructions have been sent to ${email}`);
    }
}

// Check Authentication on Protected Pages
function checkAuth() {
    const currentPage = window.location.pathname.split('/').pop();
    const protectedPages = ['dashboard.html', 'therapy.html', 'profile.html', 'community.html'];
    
    if (protectedPages.includes(currentPage)) {
        const user = localStorage.getItem('mindspace_user');
        
        if (!user) {
            window.location.href = 'login.html';
        }
    }
}

// Logout Function
function logout() {
    if (confirm('Are you sure you want to log out?')) {
        localStorage.removeItem('mindspace_user');
        localStorage.removeItem('mindspace_token');
        window.location.href = 'index.html';
    }
}

// Auto-fill demo credentials
function fillDemoCredentials() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput && passwordInput) {
        emailInput.value = 'admin@mindspace.co.ke';
        passwordInput.value = 'admin123';
    }
}

// Initialize auth check
checkAuth();

// Add demo login button to login page
if (window.location.pathname.includes('login.html')) {
    const loginCard = document.querySelector('.login-card');
    if (loginCard && !document.getElementById('demoBtn')) {
        const demoBtn = document.createElement('button');
        demoBtn.id = 'demoBtn';
        demoBtn.type = 'button';
        demoBtn.className = 'login-btn';
        demoBtn.style.marginTop = '1rem';
        demoBtn.style.background = '#6366f1';
        demoBtn.innerHTML = '🎭 Try Demo Account';
        demoBtn.onclick = fillDemoCredentials;
        
        const form = document.getElementById('loginForm');
        form.parentNode.insertBefore(demoBtn, form.nextSibling);
    }
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { logout, checkAuth };
}
