// API Utility Functions
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Get token from localStorage
function getAuthToken() {
    return localStorage.getItem('auth_token');
}

// Set token in localStorage
function setAuthToken(token) {
    localStorage.setItem('auth_token', token);
}

// Remove token from localStorage
function removeAuthToken() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_type');
    localStorage.removeItem('user_id');
}

// Make authenticated API request
async function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    };

    if (token) {
        defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }

    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...(options.headers || {})
        }
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, finalOptions);
        const data = await response.json();
        return { response, data };
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}

// Logout function
async function logout() {
    try {
        await apiRequest('/logout', {
            method: 'POST'
        });
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        // Remove token from localStorage
        removeAuthToken();
        
        // Redirect to login page - path will be handled by caller
        // This function just clears the token, redirect is handled by the page
    }
}

// Check if user is authenticated
function isAuthenticated() {
    return !!getAuthToken();
}

// Get user info from localStorage
function getUserInfo() {
    return {
        email: localStorage.getItem('user_email'),
        usertype: localStorage.getItem('user_type'),
        userid: localStorage.getItem('user_id')
    };
}

