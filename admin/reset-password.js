// Reset Password JavaScript
class ResetPassword {
    constructor() {
        this.token = this.getTokenFromURL();
        this.apiBaseUrl = '../api';
        this.init();
    }

    getTokenFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('token');
    }

    async init() {
        if (!this.token) {
            this.showInvalidToken();
            return;
        }

        this.showLoading();
        
        // Verify token validity
        try {
            const isValid = await this.verifyToken();
            if (isValid) {
                this.showResetForm();
                this.setupEventListeners();
            } else {
                this.showInvalidToken();
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            this.showInvalidToken();
        }
    }

    async verifyToken() {
        // In a real implementation, you would verify the token with the server
        // For now, we'll assume the token is valid if it exists and has the right format
        return this.token && this.token.length >= 32;
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('resetPasswordForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleResetPassword();
        });

        // Password visibility toggles
        document.getElementById('toggleNewPassword').addEventListener('click', () => {
            this.togglePasswordVisibility('newPassword', 'toggleNewPassword');
        });

        document.getElementById('toggleConfirmPassword').addEventListener('click', () => {
            this.togglePasswordVisibility('confirmPassword', 'toggleConfirmPassword');
        });

        // Password strength checking
        document.getElementById('newPassword').addEventListener('input', (e) => {
            this.checkPasswordStrength(e.target.value);
            this.checkPasswordMatch();
        });

        document.getElementById('confirmPassword').addEventListener('input', () => {
            this.checkPasswordMatch();
        });
    }

    async handleResetPassword() {
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validation
        if (!this.validatePasswords(newPassword, confirmPassword)) {
            return;
        }

        this.setLoadingState(true);

        try {
            const response = await this.resetPasswordAPI(newPassword, confirmPassword);
            
            if (response.success) {
                this.showSuccess();
            } else {
                this.showAlert('error', response.message || 'Gagal mereset password');
            }
        } catch (error) {
            console.error('Reset password error:', error);
            this.showAlert('error', 'Terjadi kesalahan sistem. Silakan coba lagi.');
        } finally {
            this.setLoadingState(false);
        }
    }

    async resetPasswordAPI(newPassword, confirmPassword) {
        const response = await fetch(`${this.apiBaseUrl}/auth.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                action: 'reset_password',
                token: this.token,
                new_password: newPassword,
                confirm_password: confirmPassword
            })
        });

        return await response.json();
    }

    validatePasswords(newPassword, confirmPassword) {
        // Check password strength
        const strength = this.calculatePasswordStrength(newPassword);
        if (strength < 3) {
            this.showAlert('error', 'Password terlalu lemah. Pastikan memenuhi semua persyaratan.');
            return false;
        }

        // Check password match
        if (newPassword !== confirmPassword) {
            this.showAlert('error', 'Password konfirmasi tidak cocok');
            return false;
        }

        return true;
    }

    checkPasswordStrength(password) {
        const strength = this.calculatePasswordStrength(password);
        const strengthBar = document.getElementById('passwordStrength');
        const strengthText = document.getElementById('passwordStrengthText');

        // Update strength bar
        const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];
        const widths = ['20%', '40%', '60%', '80%', '100%'];
        const texts = ['Sangat Lemah', 'Lemah', 'Sedang', 'Kuat', 'Sangat Kuat'];

        strengthBar.style.backgroundColor = colors[strength];
        strengthBar.style.width = widths[strength];
        strengthText.textContent = `Kekuatan password: ${texts[strength]}`;

        // Update requirements
        this.updateRequirement('req-length', password.length >= 8);
        this.updateRequirement('req-uppercase', /[A-Z]/.test(password));
        this.updateRequirement('req-lowercase', /[a-z]/.test(password));
        this.updateRequirement('req-number', /\d/.test(password));
        this.updateRequirement('req-special', /[!@#$%^&*(),.?":{}|<>]/.test(password));
    }

    calculatePasswordStrength(password) {
        let strength = 0;
        
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
        
        return Math.min(strength, 4);
    }

    updateRequirement(elementId, met) {
        const element = document.getElementById(elementId);
        const icon = element.querySelector('i');
        
        if (met) {
            icon.className = 'fas fa-check text-green-400 mr-2 w-3';
            element.classList.add('text-green-400');
            element.classList.remove('text-blue-100');
        } else {
            icon.className = 'fas fa-times text-red-400 mr-2 w-3';
            element.classList.remove('text-green-400');
            element.classList.add('text-blue-100');
        }
    }

    checkPasswordMatch() {
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const matchText = document.getElementById('passwordMatchText');

        if (confirmPassword.length === 0) {
            matchText.textContent = '';
            return;
        }

        if (newPassword === confirmPassword) {
            matchText.textContent = '✓ Password cocok';
            matchText.className = 'text-xs text-green-400 mt-1';
        } else {
            matchText.textContent = '✗ Password tidak cocok';
            matchText.className = 'text-xs text-red-400 mt-1';
        }
    }

    togglePasswordVisibility(inputId, buttonId) {
        const input = document.getElementById(inputId);
        const button = document.getElementById(buttonId);
        const icon = button.querySelector('i');

        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    // UI State Management
    showLoading() {
        document.getElementById('loadingState').classList.remove('hidden');
        document.getElementById('resetPasswordForm').classList.add('hidden');
        document.getElementById('invalidTokenState').classList.add('hidden');
        document.getElementById('successState').classList.add('hidden');
    }

    showResetForm() {
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('resetPasswordForm').classList.remove('hidden');
        document.getElementById('invalidTokenState').classList.add('hidden');
        document.getElementById('successState').classList.add('hidden');
    }

    showInvalidToken() {
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('resetPasswordForm').classList.add('hidden');
        document.getElementById('invalidTokenState').classList.remove('hidden');
        document.getElementById('successState').classList.add('hidden');
    }

    showSuccess() {
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('resetPasswordForm').classList.add('hidden');
        document.getElementById('invalidTokenState').classList.add('hidden');
        document.getElementById('successState').classList.remove('hidden');
    }

    setLoadingState(loading) {
        const resetBtn = document.getElementById('resetBtn');
        const resetBtnText = document.getElementById('resetBtnText');
        const resetBtnLoading = document.getElementById('resetBtnLoading');
        
        if (loading) {
            resetBtn.disabled = true;
            resetBtnText.classList.add('hidden');
            resetBtnLoading.classList.remove('hidden');
        } else {
            resetBtn.disabled = false;
            resetBtnText.classList.remove('hidden');
            resetBtnLoading.classList.add('hidden');
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
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.resetPassword = new ResetPassword();
});