// API Utility Functions
const API_BASE_URL = 'https://jowashlaravel.muccsbblock1.com/jowash-backend/api';

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

// Make authenticated API request using jQuery AJAX
function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();
    
    const defaultOptions = {
        url: `${API_BASE_URL}${endpoint}`,
        method: options.method || 'GET',
        contentType: 'application/json',
        dataType: 'json',
        headers: {
            'Accept': 'application/json'
        }
    };

    if (token) {
        defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }

    // Handle FormData (for file uploads)
    if (options.body instanceof FormData) {
        defaultOptions.contentType = false;
        defaultOptions.processData = false;
        defaultOptions.data = options.body;
    } else if (options.body) {
        // If body is a string (JSON), parse it
        if (typeof options.body === 'string') {
            defaultOptions.data = options.body;
        } else {
            defaultOptions.data = JSON.stringify(options.body);
        }
    }

    // Merge with provided options
    const finalOptions = $.extend(true, {}, defaultOptions, {
        method: options.method || defaultOptions.method,
        headers: $.extend({}, defaultOptions.headers, options.headers || {})
    });

    return $.ajax(finalOptions).then(function(data, textStatus, jqXHR) {
        return {
            response: {
                status: jqXHR.status,
                statusText: jqXHR.statusText,
                ok: jqXHR.status >= 200 && jqXHR.status < 300
            },
            data: data
        };
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error('API request error:', errorThrown);
        // Return error in same format as fetch
        return {
            response: {
                status: jqXHR.status || 500,
                statusText: jqXHR.statusText || textStatus,
                ok: false
            },
            data: jqXHR.responseJSON || { success: false, message: errorThrown || 'Request failed' }
        };
    });
}

// Logout function
function logout() {
    return apiRequest('/logout', {
        method: 'POST'
    }).always(function() {
        // Remove token from localStorage
        removeAuthToken();
        
        // Redirect to login page - path will be handled by caller
        // This function just clears the token, redirect is handled by the page
    });
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

