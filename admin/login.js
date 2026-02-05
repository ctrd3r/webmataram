// Login System JavaScript
class LoginSystem {
    constructor() {
        this.maxAttempts = 5;
        this.lockoutTime = 15 * 60 * 1000; // 15 minutes
        this.sessionTimeout = 2 * 60 * 60 * 1000; // 2 hours
        this.init();
    }

    init() {
        this.checkExistingSession();
        this.setupEventListeners();
        this.loadRememberedUser();
        this.checkLoginAttempts();
    }

    setupEventListeners() {
        // Login form submission
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Toggle password visibility
        document.getElementById('togglePassword').addEventListener('click', () => {
            this.togglePasswordVisibility();
        });

        // Forgot password form
        document.getElementById('forgotPasswordForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleForgotPassword();
        });

        // Enter key handling
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !document.getElementById('forgotPasswordModal').classList.contains('hidden')) {
                e.preventDefault();
                document.getElementById('forgotPasswordForm').dispatchEvent(new Event('submit'));
            }
        });

        // Auto-logout on tab close/refresh
        window.addEventListener('beforeunload', () => {
            if (!document.getElementById('rememberMe').checked) {
                this.clearSession();
            }
        });
    }

    async handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Validation
        if (!username || !password) {
            this.showAlert('error', 'Username dan password harus diisi!');
            return;
        }

        // Check if account is locked
        if (this.isAccountLocked()) {
            const remainingTime = this.getRemainingLockTime();
            this.showAlert('error', `Akun terkunci. Coba lagi dalam ${Math.ceil(remainingTime / 60000)} menit.`);
            return;
        }

        this.setLoadingState(true);

        try {
            const response = await this.authenticateUser(username, password);
            
            if (response.success) {
                this.handleSuccessfulLogin(response.data, rememberMe);
            } else {
                this.handleFailedLogin(response.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showAlert('error', 'Terjadi kesalahan sistem. Silakan coba lagi.');
        } finally {
            this.setLoadingState(false);
        }
    }

    async authenticateUser(username, password) {
        // Simulate API call - replace with actual authentication endpoint
        return new Promise((resolve) => {
            setTimeout(() => {
                // Demo credentials - replace with actual authentication
                const validCredentials = [
                    { username: 'admin', password: 'admin123', role: 'super_admin', name: 'Super Admin' },
                    { username: 'editor', password: 'editor123', role: 'editor', name: 'Editor BMKG' },
                    { username: 'bmkg_admin', password: 'bmkg2024!', role: 'admin', name: 'Admin BMKG' }
                ];

                const user = validCredentials.find(cred => 
                    cred.username === username && cred.password === password
                );

                if (user) {
                    resolve({
                        success: true,
                        data: {
                            id: Math.floor(Math.random() * 1000),
                            username: user.username,
                            name: user.name,
                            role: user.role,
                            email: `${user.username}@bmkg.go.id`,
                            last_login: new Date().toISOString(),
                            permissions: this.getRolePermissions(user.role),
                            session_token: this.generateSessionToken()
                        }
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Username atau password salah!'
                    });
                }
            }, 1000);
        });
    }

    getRolePermissions(role) {
        const permissions = {
            super_admin: ['read', 'write', 'delete', 'manage_users', 'manage_settings'],
            admin: ['read', 'write', 'delete', 'moderate_comments'],
            editor: ['read', 'write', 'moderate_comments'],
            viewer: ['read']
        };
        return permissions[role] || permissions.viewer;
    }

    generateSessionToken() {
        return 'sess_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    handleSuccessfulLogin(userData, rememberMe) {
        // Clear failed attempts
        this.clearFailedAttempts();

        // Store session data
        const sessionData = {
            ...userData,
            login_time: Date.now(),
            expires_at: Date.now() + this.sessionTimeout,
            remember_me: rememberMe
        };

        // Store in appropriate storage
        if (rememberMe) {
            localStorage.setItem('bmkg_admin_session', JSON.stringify(sessionData));
            localStorage.setItem('bmkg_remember_user', userData.username);
        } else {
            sessionStorage.setItem('bmkg_admin_session', JSON.stringify(sessionData));
        }

        // Log successful login
        this.logSecurityEvent('login_success', {
            username: userData.username,
            ip: 'client_ip', // In real implementation, get from server
            user_agent: navigator.userAgent
        });

        this.showAlert('success', `Selamat datang, ${userData.name}!`);

        // Redirect to admin dashboard
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    handleFailedLogin(message) {
        this.incrementFailedAttempts();
        const attempts = this.getFailedAttempts();
        const remaining = this.maxAttempts - attempts;

        if (remaining <= 0) {
            this.lockAccount();
            this.showAlert('error', 'Akun terkunci karena terlalu banyak percobaan login yang gagal.');
        } else {
            this.showAlert('error', `${message} (${remaining} percobaan tersisa)`);
        }

        // Log failed attempt
        this.logSecurityEvent('login_failed', {
            username: document.getElementById('username').value,
            attempts: attempts,
            ip: 'client_ip'
        });
    }

    checkExistingSession() {
        const sessionData = this.getStoredSession();
        
        if (sessionData) {
            // Check if session is still valid
            if (Date.now() < sessionData.expires_at) {
                // Valid session exists, redirect to dashboard
                window.location.href = 'index.html';
                return;
            } else {
                // Session expired, clear it
                this.clearSession();
                this.showAlert('warning', 'Sesi Anda telah berakhir. Silakan login kembali.');
            }
        }
    }

    getStoredSession() {
        const sessionStr = localStorage.getItem('bmkg_admin_session') || 
                          sessionStorage.getItem('bmkg_admin_session');
        
        if (sessionStr) {
            try {
                return JSON.parse(sessionStr);
            } catch (e) {
                console.error('Invalid session data:', e);
                this.clearSession();
            }
        }
        return null;
    }

    clearSession() {
        localStorage.removeItem('bmkg_admin_session');
        sessionStorage.removeItem('bmkg_admin_session');
    }

    loadRememberedUser() {
        const rememberedUser = localStorage.getItem('bmkg_remember_user');
        if (rememberedUser) {
            document.getElementById('username').value = rememberedUser;
            document.getElementById('rememberMe').checked = true;
        }
    }

    // Failed login attempts management
    getFailedAttempts() {
        const attempts = localStorage.getItem('bmkg_failed_attempts');
        return attempts ? parseInt(attempts) : 0;
    }

    incrementFailedAttempts() {
        const attempts = this.getFailedAttempts() + 1;
        localStorage.setItem('bmkg_failed_attempts', attempts.toString());
        localStorage.setItem('bmkg_last_attempt', Date.now().toString());
    }

    clearFailedAttempts() {
        localStorage.removeItem('bmkg_failed_attempts');
        localStorage.removeItem('bmkg_last_attempt');
        localStorage.removeItem('bmkg_account_locked');
    }

    lockAccount() {
        localStorage.setItem('bmkg_account_locked', Date.now().toString());
    }

    isAccountLocked() {
        const lockedTime = localStorage.getItem('bmkg_account_locked');
        if (!lockedTime) return false;

        const lockTime = parseInt(lockedTime);
        return (Date.now() - lockTime) < this.lockoutTime;
    }

    getRemainingLockTime() {
        const lockedTime = localStorage.getItem('bmkg_account_locked');
        if (!lockedTime) return 0;

        const lockTime = parseInt(lockedTime);
        const elapsed = Date.now() - lockTime;
        return Math.max(0, this.lockoutTime - elapsed);
    }

    checkLoginAttempts() {
        if (this.isAccountLocked()) {
            const remainingTime = this.getRemainingLockTime();
            this.showAlert('error', `Akun terkunci. Coba lagi dalam ${Math.ceil(remainingTime / 60000)} menit.`);
            document.getElementById('loginBtn').disabled = true;
            
            // Auto-unlock after lockout time
            setTimeout(() => {
                this.clearFailedAttempts();
                document.getElementById('loginBtn').disabled = false;
                this.hideAlert();
            }, remainingTime);
        }
    }

    // UI Helper Methods
    togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const toggleIcon = document.querySelector('#togglePassword i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.className = 'fas fa-eye-slash';
        } else {
            passwordInput.type = 'password';
            toggleIcon.className = 'fas fa-eye';
        }
    }

    setLoadingState(loading) {
        const loginBtn = document.getElementById('loginBtn');
        const loginBtnText = document.getElementById('loginBtnText');
        const loginBtnLoading = document.getElementById('loginBtnLoading');
        
        if (loading) {
            loginBtn.disabled = true;
            loginBtnText.classList.add('hidden');
            loginBtnLoading.classList.remove('hidden');
        } else {
            loginBtn.disabled = false;
            loginBtnText.classList.remove('hidden');
            loginBtnLoading.classList.add('hidden');
        }
    }

    showAlert(type, message) {
        const alertDiv = document.getElementById('alertMessage');
        const alertIcon = document.getElementById('alertIcon');
        const alertText = document.getElementById('alertText');
        
        // Reset classes
        alertDiv.className = 'mb-6 p-4 rounded-lg flex items-center';
        
        // Set type-specific styles
        switch (type) {
            case 'success':
                alertDiv.classList.add('bg-green-100', 'border', 'border-green-400', 'text-green-700');
                alertIcon.className = 'fas fa-check-circle text-green-500 mr-3';
                break;
            case 'error':
                alertDiv.classList.add('bg-red-100', 'border', 'border-red-400', 'text-red-700');
                alertIcon.className = 'fas fa-exclamation-circle text-red-500 mr-3';
                break;
            case 'warning':
                alertDiv.classList.add('bg-yellow-100', 'border', 'border-yellow-400', 'text-yellow-700');
                alertIcon.className = 'fas fa-exclamation-triangle text-yellow-500 mr-3';
                break;
            default:
                alertDiv.classList.add('bg-blue-100', 'border', 'border-blue-400', 'text-blue-700');
                alertIcon.className = 'fas fa-info-circle text-blue-500 mr-3';
        }
        
        alertText.textContent = message;
        alertDiv.classList.remove('hidden');
        
        // Auto-hide after 5 seconds for non-error messages
        if (type !== 'error') {
            setTimeout(() => this.hideAlert(), 5000);
        }
    }

    hideAlert() {
        document.getElementById('alertMessage').classList.add('hidden');
    }

    // Forgot Password
    async handleForgotPassword() {
        const email = document.getElementById('resetEmail').value.trim();
        
        if (!email) {
            alert('Email harus diisi!');
            return;
        }

        try {
            // Simulate API call for password reset
            const response = await this.sendPasswordReset(email);
            
            if (response.success) {
                alert('Link reset password telah dikirim ke email Anda.');
                this.closeForgotPassword();
            } else {
                alert('Email tidak ditemukan dalam sistem.');
            }
        } catch (error) {
            alert('Terjadi kesalahan. Silakan coba lagi.');
        }
    }

    async sendPasswordReset(email) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                // Check if email exists (demo)
                const validEmails = ['admin@bmkg.go.id', 'editor@bmkg.go.id'];
                resolve({
                    success: validEmails.includes(email)
                });
            }, 1000);
        });
    }

    // Security logging
    logSecurityEvent(event, data) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            event: event,
            data: data,
            session_id: this.generateSessionToken()
        };
        
        // In real implementation, send to server
        console.log('Security Event:', logEntry);
        
        // Store locally for demo (in production, send to server)
        const logs = JSON.parse(localStorage.getItem('bmkg_security_logs') || '[]');
        logs.push(logEntry);
        
        // Keep only last 100 logs
        if (logs.length > 100) {
            logs.splice(0, logs.length - 100);
        }
        
        localStorage.setItem('bmkg_security_logs', JSON.stringify(logs));
    }
}

// Global functions for modal
function showForgotPassword() {
    document.getElementById('forgotPasswordModal').classList.remove('hidden');
    document.getElementById('forgotPasswordModal').classList.add('flex');
    document.getElementById('resetEmail').focus();
}

function closeForgotPassword() {
    document.getElementById('forgotPasswordModal').classList.add('hidden');
    document.getElementById('forgotPasswordModal').classList.remove('flex');
    document.getElementById('forgotPasswordForm').reset();
}

// Initialize login system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.loginSystem = new LoginSystem();
});