// Authentication Middleware for Admin Panel
class AuthMiddleware {
    constructor() {
        this.sessionKey = 'bmkg_admin_session';
        this.apiBaseUrl = '../api';
        this.currentUser = null;
        this.sessionCheckInterval = null;
    }

    // Initialize authentication system
    async init() {
        await this.checkAuthentication();
        this.startSessionMonitoring();
        this.setupGlobalErrorHandling();
    }

    // Check if user is authenticated
    async checkAuthentication() {
        const sessionData = this.getStoredSession();
        
        if (!sessionData) {
            this.redirectToLogin();
            return false;
        }

        // Verify session with server
        try {
            const response = await this.verifySessionWithServer(sessionData.session_token);
            
            if (response.success) {
                this.currentUser = response.data;
                this.updateSessionData(response.data);
                return true;
            } else {
                this.clearSession();
                this.redirectToLogin();
                return false;
            }
        } catch (error) {
            console.error('Session verification failed:', error);
            this.clearSession();
            this.redirectToLogin();
            return false;
        }
    }

    // Verify session with server
    async verifySessionWithServer(sessionToken) {
        const response = await fetch(`${this.apiBaseUrl}/auth.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${sessionToken}`
            },
            body: new URLSearchParams({
                action: 'verify_session',
                session_token: sessionToken
            })
        });

        return await response.json();
    }

    // Get stored session data
    getStoredSession() {
        const sessionStr = localStorage.getItem(this.sessionKey) || 
                          sessionStorage.getItem(this.sessionKey);
        
        if (sessionStr) {
            try {
                const sessionData = JSON.parse(sessionStr);
                
                // Check if session is expired locally
                if (Date.now() > new Date(sessionData.expires_at).getTime()) {
                    this.clearSession();
                    return null;
                }
                
                return sessionData;
            } catch (e) {
                console.error('Invalid session data:', e);
                this.clearSession();
                return null;
            }
        }
        
        return null;
    }

    // Update session data
    updateSessionData(userData) {
        const sessionData = this.getStoredSession();
        if (sessionData) {
            const updatedSession = {
                ...sessionData,
                ...userData,
                last_activity: Date.now()
            };
            
            if (sessionData.remember_me) {
                localStorage.setItem(this.sessionKey, JSON.stringify(updatedSession));
            } else {
                sessionStorage.setItem(this.sessionKey, JSON.stringify(updatedSession));
            }
        }
    }

    // Clear session data
    clearSession() {
        localStorage.removeItem(this.sessionKey);
        sessionStorage.removeItem(this.sessionKey);
        this.currentUser = null;
    }

    // Redirect to login page
    redirectToLogin() {
        if (window.location.pathname !== '/admin/login.html') {
            window.location.href = 'login.html';
        }
    }

    // Logout user
    async logout() {
        const sessionData = this.getStoredSession();
        
        if (sessionData && sessionData.session_token) {
            try {
                // Notify server about logout
                await fetch(`${this.apiBaseUrl}/auth.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({
                        action: 'logout',
                        session_token: sessionData.session_token
                    })
                });
            } catch (error) {
                console.error('Logout API call failed:', error);
            }
        }
        
        this.clearSession();
        this.stopSessionMonitoring();
        this.redirectToLogin();
    }

    // Start monitoring session
    startSessionMonitoring() {
        // Check session every 5 minutes
        this.sessionCheckInterval = setInterval(async () => {
            const sessionData = this.getStoredSession();
            
            if (sessionData) {
                // Check if session is about to expire (within 10 minutes)
                const expiresAt = new Date(sessionData.expires_at).getTime();
                const now = Date.now();
                const timeUntilExpiry = expiresAt - now;
                
                if (timeUntilExpiry <= 10 * 60 * 1000) { // 10 minutes
                    this.showSessionWarning(Math.floor(timeUntilExpiry / 60000));
                }
                
                // Verify session is still valid
                try {
                    const response = await this.verifySessionWithServer(sessionData.session_token);
                    if (!response.success) {
                        this.handleSessionExpired();
                    }
                } catch (error) {
                    console.error('Session check failed:', error);
                }
            }
        }, 5 * 60 * 1000); // 5 minutes
    }

    // Stop session monitoring
    stopSessionMonitoring() {
        if (this.sessionCheckInterval) {
            clearInterval(this.sessionCheckInterval);
            this.sessionCheckInterval = null;
        }
    }

    // Show session warning
    showSessionWarning(minutesLeft) {
        if (minutesLeft <= 0) {
            this.handleSessionExpired();
            return;
        }

        const warningDiv = document.createElement('div');
        warningDiv.id = 'sessionWarning';
        warningDiv.className = 'fixed top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg shadow-lg z-50';
        warningDiv.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-exclamation-triangle mr-2"></i>
                <div>
                    <p class="font-semibold">Sesi akan berakhir dalam ${minutesLeft} menit</p>
                    <div class="mt-2">
                        <button onclick="authMiddleware.extendSession()" class="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 mr-2">
                            Perpanjang Sesi
                        </button>
                        <button onclick="authMiddleware.dismissWarning()" class="text-yellow-600 text-sm hover:text-yellow-800">
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Remove existing warning
        const existingWarning = document.getElementById('sessionWarning');
        if (existingWarning) {
            existingWarning.remove();
        }

        document.body.appendChild(warningDiv);
    }

    // Extend session
    async extendSession() {
        const sessionData = this.getStoredSession();
        
        if (sessionData) {
            try {
                const response = await this.verifySessionWithServer(sessionData.session_token);
                if (response.success) {
                    this.updateSessionData(response.data);
                    this.dismissWarning();
                    this.showNotification('success', 'Sesi berhasil diperpanjang');
                }
            } catch (error) {
                console.error('Failed to extend session:', error);
                this.showNotification('error', 'Gagal memperpanjang sesi');
            }
        }
    }

    // Dismiss session warning
    dismissWarning() {
        const warningDiv = document.getElementById('sessionWarning');
        if (warningDiv) {
            warningDiv.remove();
        }
    }

    // Handle session expired
    handleSessionExpired() {
        this.dismissWarning();
        this.showNotification('error', 'Sesi Anda telah berakhir. Silakan login kembali.');
        
        setTimeout(() => {
            this.logout();
        }, 3000);
    }

    // Show notification
    showNotification(type, message) {
        const notificationDiv = document.createElement('div');
        notificationDiv.className = `fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' :
            type === 'error' ? 'bg-red-100 border border-red-400 text-red-700' :
            'bg-blue-100 border border-blue-400 text-blue-700'
        }`;
        
        notificationDiv.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${
                    type === 'success' ? 'fa-check-circle' :
                    type === 'error' ? 'fa-exclamation-circle' :
                    'fa-info-circle'
                } mr-2"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notificationDiv);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notificationDiv.remove();
        }, 5000);
    }

    // Setup global error handling
    setupGlobalErrorHandling() {
        // Handle fetch errors globally
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            try {
                const response = await originalFetch(...args);
                
                // Handle authentication errors
                if (response.status === 401) {
                    this.handleSessionExpired();
                    throw new Error('Authentication required');
                }
                
                return response;
            } catch (error) {
                if (error.message === 'Authentication required') {
                    throw error;
                }
                
                // Handle network errors
                console.error('Network error:', error);
                throw error;
            }
        };
    }

    // Check user permissions
    hasPermission(permission) {
        if (!this.currentUser || !this.currentUser.permissions) {
            return false;
        }
        
        return this.currentUser.permissions.includes(permission);
    }

    // Check user role
    hasRole(role) {
        if (!this.currentUser) {
            return false;
        }
        
        return this.currentUser.role === role;
    }

    // Get current user info
    getCurrentUser() {
        return this.currentUser;
    }

    // Make authenticated API request
    async authenticatedFetch(url, options = {}) {
        const sessionData = this.getStoredSession();
        
        if (!sessionData || !sessionData.session_token) {
            throw new Error('No valid session');
        }

        const headers = {
            'Authorization': `Bearer ${sessionData.session_token}`,
            ...options.headers
        };

        return fetch(url, {
            ...options,
            headers
        });
    }

    // Activity tracking
    trackActivity() {
        const sessionData = this.getStoredSession();
        if (sessionData) {
            sessionData.last_activity = Date.now();
            
            if (sessionData.remember_me) {
                localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
            } else {
                sessionStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
            }
        }
    }
}

// Global instance
window.authMiddleware = new AuthMiddleware();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Skip authentication check on login page
    if (window.location.pathname.includes('login.html')) {
        return;
    }
    
    await window.authMiddleware.init();
    
    // Track user activity
    ['click', 'keypress', 'scroll', 'mousemove'].forEach(event => {
        document.addEventListener(event, () => {
            window.authMiddleware.trackActivity();
        }, { passive: true });
    });
});

// Global logout function
function logout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        window.authMiddleware.logout();
    }
}