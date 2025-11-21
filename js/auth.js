// auth.js - Frontend authentication handler with PHP backend integration

// API Configuration
const API_BASE_URL = '/api'; // Adjust this to your PHP files location
const USE_LOCAL_STORAGE = true; // Set to false when PHP backend is ready

// API Helper Functions
async function apiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        }
    };

    if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'API request failed');
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Authentication Functions
async function signup(userData) {
    if (USE_LOCAL_STORAGE) {
        // Fallback to localStorage for demo purposes
        return signupLocalStorage(userData);
    }
    
    try {
        const response = await apiCall('/signup.php', 'POST', userData);
        if (response.success) {
            // Store user session
            sessionStorage.setItem('mindspace_user', JSON.stringify(response.user));
            return response;
        }
        throw new Error(response.message);
    } catch (error) {
        throw error;
    }
}

async function login(credentials) {
    if (USE_LOCAL_STORAGE) {
        // Fallback to localStorage for demo purposes
        return loginLocalStorage(credentials);
    }
    
    try {
        const response = await apiCall('/login.php', 'POST', credentials);
        if (response.success) {
            // Store user session
            sessionStorage.setItem('mindspace_user', JSON.stringify(response.user));
            return response;
        }
        throw new Error(response.message);
    } catch (error) {
        throw error;
    }
}

async function logout() {
    if (USE_LOCAL_STORAGE) {
        localStorage.removeItem('mindspace_user');
        sessionStorage.removeItem('mindspace_user');
        window.location.href = 'index.html';
        return;
    }
    
    try {
        await apiCall('/logout.php', 'POST');
        sessionStorage.removeItem('mindspace_user');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
        sessionStorage.removeItem('mindspace_user');
        window.location.href = 'index.html';
    }
}

function getCurrentUser() {
    const userStr = sessionStorage.getItem('mindspace_user') || localStorage.getItem('mindspace_user');
    return userStr ? JSON.parse(userStr) : null;
}

function requireAuth() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// LocalStorage Fallback Functions (for demo without backend)
function signupLocalStorage(userData) {
    return new Promise((resolve, reject) => {
        let users = JSON.parse(localStorage.getItem('mindspace_users') || '[]');
        
        // Check if user exists
        if (users.some(u => u.email === userData.email || u.phone === userData.phone)) {
            reject(new Error('An account with this email or phone already exists'));
            return;
        }
        
        const newUser = {
            id: Date.now(),
            ...userData,
            password_hash: userData.password, // In real app, this would be hashed server-side
            created_at: new Date().toISOString()
        };
        
        delete newUser.password; // Remove plain password
        
        users.push(newUser);
        localStorage.setItem('mindspace_users', JSON.stringify(users));
        
        const userSession = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone
        };
        
        localStorage.setItem('mindspace_user', JSON.stringify(userSession));
        
        resolve({
            success: true,
            message: 'Account created successfully',
            user: userSession
        });
    });
}

function loginLocalStorage(credentials) {
    return new Promise((resolve, reject) => {
        const users = JSON.parse(localStorage.getItem('mindspace_users') || '[]');
        
        const user = users.find(u => {
            const emailMatch = u.email.toLowerCase() === credentials.email.toLowerCase();
            const phoneMatch = u.phone === credentials.email;
            return (emailMatch || phoneMatch) && u.password_hash === credentials.password;
        });
        
        if (user) {
            const userSession = {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone
            };
            
            localStorage.setItem('mindspace_user', JSON.stringify(userSession));
            
            resolve({
                success: true,
                message: 'Login successful',
                user: userSession
            });
        } else {
            reject(new Error('Invalid credentials'));
        }
    });
}

// Form Validation Helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateKenyanPhone(phone) {
    const re = /^07\d{8}$/;
    return re.test(phone);
}

function validatePassword(password) {
    return password.length >= 6;
}

// Export functions for use in HTML pages
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        signup,
        login,
        logout,
        getCurrentUser,
        requireAuth,
        validateEmail,
        validateKenyanPhone,
        validatePassword
    };
}
