// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'dashboard.html') {
        checkSession();
        loadUserData();
    } else if (currentPage === 'register.html') {
        initializeValidation();
        initializeProfilePicture();
        initializeRegisterForm();
    } else if (currentPage === 'login.html') {
        initializeLoginForm();
    }
});

// Check if user is already logged in
function checkSession() {
    const sessionUser = localStorage.getItem('currentUser');
    if (!sessionUser) {
        window.location.href = 'login.html';
        return;
    }
    return JSON.parse(sessionUser);
}

// Toggle password visibility
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const toggle = field.nextElementSibling;
    
    if (field.type === 'password') {
        field.type = 'text';
        toggle.textContent = '🙈';
    } else {
        field.type = 'password';
        toggle.textContent = '👁️';
    }
}

// Initialize profile picture upload
function initializeProfilePicture() {
    const profilePicInput = document.getElementById('profilePic');
    const profileImg = document.getElementById('profileImg');
    
    if (profilePicInput) {
        profilePicInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profileImg.src = e.target.result;
                    profileImg.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// Validation functions
function validateFullName(name) {
    if (!name || name.length < 3) {
        return "Name must be at least 3 characters long";
    }
    
    if (/\d/.test(name)) {
        return "Name cannot contain numbers";
    }
    
    // Check for same character 3 times consecutively
    for (let i = 0; i < name.length - 2; i++) {
        if (name[i] === name[i + 1] && name[i] === name[i + 2]) {
            return "Name cannot have same character 3 times consecutively";
        }
    }
    
    return null;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return "Please enter a valid email address";
    }
    return null;
}

function validatePassword(password) {
    if (password.length < 8) {
        return "Password must be at least 8 characters long";
    }
    
    if (!/[A-Z]/.test(password)) {
        return "Password must contain at least one uppercase letter";
    }
    
    if (!/[a-z]/.test(password)) {
        return "Password must contain at least one lowercase letter";
    }
    
    if (!/\d/.test(password)) {
        return "Password must contain at least one number";
    }
    
    if (!/[!@#$%^&*]/.test(password)) {
        return "Password must contain at least one special character";
    }
    
    return null;
}

function validatePhone(phone) {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        return "Phone number must be exactly 10 digits";
    }
    return null;
}

function validateAge(dob) {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    if (age < 18) {
        return "You must be at least 18 years old";
    }
    
    return null;
}

function validateAddress(address) {
    if (!address || address.length < 10) {
        return "Address must be at least 10 characters long";
    }
    return null;
}

function showValidationMessage(fieldId, message, isError = true) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(fieldId + 'Error');
    const successDiv = document.getElementById(fieldId + 'Success');
    
    if (isError) {
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
        if (successDiv) {
            successDiv.style.display = 'none';
        }
        if (field) {
            field.classList.add('invalid');
            field.classList.remove('valid');
        }
    } else {
        if (successDiv) {
            successDiv.textContent = message;
            successDiv.style.display = 'block';
        }
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
        if (field) {
            field.classList.add('valid');
            field.classList.remove('invalid');
        }
    }
}

function clearValidationMessage(fieldId) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(fieldId + 'Error');
    const successDiv = document.getElementById(fieldId + 'Success');
    
    if (errorDiv) errorDiv.style.display = 'none';
    if (successDiv) successDiv.style.display = 'none';
    if (field) field.classList.remove('invalid', 'valid');
}

// Initialize real-time validation
function initializeValidation() {
    const fields = [
        { id: 'fullName', validator: validateFullName },
        { id: 'email', validator: validateEmail },
        { id: 'password', validator: validatePassword },
        { id: 'phone', validator: validatePhone },
        { id: 'dob', validator: validateAge },
        { id: 'address', validator: validateAddress }
    ];

    fields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element) {
            element.addEventListener('input', function() {
                const error = field.validator(this.value);
                if (error) {
                    showValidationMessage(field.id, error, true);
                } else {
                    showValidationMessage(field.id, '✓ Valid', false);
                }
            });
        }
    });

    // Confirm password validation
    const confirmPasswordField = document.getElementById('confirmPassword');
    if (confirmPasswordField) {
        confirmPasswordField.addEventListener('input', function() {
            const password = document.getElementById('password').value;
            if (this.value !== password) {
                showValidationMessage('confirmPassword', 'Passwords do not match', true);
            } else {
                showValidationMessage('confirmPassword', '✓ Passwords match', false);
            }
        });
    }
}

// Initialize registration form
function initializeRegisterForm() {
    const form = document.getElementById('registerForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const userData = {};
            
            // Collect form data
            for (let [key, value] of formData.entries()) {
                userData[key] = value;
            }
            
            // Collect skills
            const skills = [];
            const skillCheckboxes = document.querySelectorAll('input[name="skills"]:checked');
            skillCheckboxes.forEach(checkbox => skills.push(checkbox.value));
            userData.skills = skills;
            
            // Add profile picture if uploaded
            const profileImg = document.getElementById('profileImg');
            if (profileImg && profileImg.src && profileImg.src !== '') {
                userData.profilePicture = profileImg.src;
            }
            
            // Validate all fields
            let isValid = true;
            
            // Validate full name
            const nameError = validateFullName(userData.fullName);
            if (nameError) {
                showValidationMessage('fullName', nameError, true);
                isValid = false;
            }
            
            // Validate email
            const emailError = validateEmail(userData.email);
            if (emailError) {
                showValidationMessage('email', emailError, true);
                isValid = false;
            }
            
            // Check if email already exists
            const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
            if (existingUsers.find(user => user.email === userData.email)) {
                showValidationMessage('email', 'Email already exists', true);
                isValid = false;
            }
            
            // Validate password
            const passwordError = validatePassword(userData.password);
            if (passwordError) {
                showValidationMessage('password', passwordError, true);
                isValid = false;
            }
            
            // Validate confirm password
            if (userData.password !== userData.confirmPassword) {
                showValidationMessage('confirmPassword', 'Passwords do not match', true);
                isValid = false;
            }
            
            // Validate phone
            const phoneError = validatePhone(userData.phone);
            if (phoneError) {
                showValidationMessage('phone', phoneError, true);
                isValid = false;
            }
            
            // Validate age
            const ageError = validateAge(userData.dob);
            if (ageError) {
                showValidationMessage('dob', ageError, true);
                isValid = false;
            }
            
            // Validate address
            const addressError = validateAddress(userData.address);
            if (addressError) {
                showValidationMessage('address', addressError, true);
                isValid = false;
            }
            
            // Validate gender
            if (!userData.gender) {
                showValidationMessage('gender', 'Please select a gender', true);
                isValid = false;
            }
            
            // Validate city
            if (!userData.city) {
                showValidationMessage('city', 'Please select a city', true);
                isValid = false;
            }
            
            // Validate skills
            if (skills.length === 0) {
                showValidationMessage('skills', 'Please select at least one skill', true);
                isValid = false;
            }
            
            // Validate terms
            if (!userData.terms) {
                showValidationMessage('terms', 'Please accept the terms and conditions', true);
                isValid = false;
            }
            
            if (isValid) {
                // Save user data
                existingUsers.push(userData);
                localStorage.setItem('users', JSON.stringify(existingUsers));
                
                alert('Registration successful! You can now login.');
                window.location.href = 'login.html';
            }
        });
    }
}

// Initialize login form
function initializeLoginForm() {
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Validate inputs
            if (!email || !password) {
                showValidationMessage('loginEmail', 'Please fill in all fields', true);
                return;
            }
            
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            // Find user
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Set current user session
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                showValidationMessage('loginEmail', 'Invalid email or password', true);
            }
        });
    }
}

// Load user data in dashboard
function loadUserData() {
    const currentUser = checkSession();
    if (!currentUser) return;
    
    const userInfoDiv = document.getElementById('userInfo');
    if (userInfoDiv) {
        let profilePicHtml = '';
        if (currentUser.profilePicture) {
            profilePicHtml = `
                <div class="profile-pic-dashboard">
                    <img src="${currentUser.profilePicture}" alt="Profile">
                </div>
            `;
        }
        
        userInfoDiv.innerHTML = `
            ${profilePicHtml}
            <h3>Welcome, ${currentUser.fullName}!</h3>
            <p><strong>Email:</strong> ${currentUser.email}</p>
            <p><strong>Phone:</strong> ${currentUser.phone}</p>
            <p><strong>Gender:</strong> ${currentUser.gender}</p>
            <p><strong>Date of Birth:</strong> ${currentUser.dob}</p>
            <p><strong>City:</strong> ${currentUser.city}</p>
            <p><strong>Address:</strong> ${currentUser.address}</p>
            <p><strong>Skills:</strong> ${currentUser.skills ? currentUser.skills.join(', ') : 'None'}</p>
        `;
    }
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Update profile function
function updateProfile() {
    const currentUser = checkSession();
    if (!currentUser) return;
    
    // You can implement profile update functionality here
    alert('Profile update functionality can be implemented here');
}

// Delete account function
function deleteAccount() {
    const currentUser = checkSession();
    if (!currentUser) return;
    
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        // Get all users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Remove current user
        const updatedUsers = users.filter(user => user.email !== currentUser.email);
        
        // Update localStorage
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        // Clear session
        localStorage.removeItem('currentUser');
        
        alert('Account deleted successfully');
        window.location.href = 'login.html';
    }
}

// Clear all data function (for testing purposes)
function clearAllData() {
    if (confirm('Are you sure you want to clear all data? This will remove all registered users.')) {
        localStorage.removeItem('users');
        localStorage.removeItem('currentUser');
        alert('All data cleared');
        window.location.href = 'login.html';
    }
}

// Utility function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

// Utility function to calculate age
function calculateAge(dob) {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

// Display user count (for admin purposes)
function displayUserCount() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    console.log(`Total registered users: ${users.length}`);
    return users.length;
}

// Search users function (for admin purposes)
function searchUsers(searchTerm) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.filter(user => 
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
}// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'dashboard.html') {
        checkSession();
        loadUserData();
    } else if (currentPage === 'register.html') {
        initializeValidation();
        initializeProfilePicture();
        initializeRegisterForm();
    } else if (currentPage === 'login.html') {
        initializeLoginForm();
    }
});

// Check if user is already logged in
function checkSession() {
    const sessionUser = localStorage.getItem('currentUser');
    if (!sessionUser) {
        window.location.href = 'login.html';
        return;
    }
    return JSON.parse(sessionUser);
}

// Toggle password visibility
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const toggle = field.nextElementSibling;
    
    if (field.type === 'password') {
        field.type = 'text';
        toggle.textContent = '🙈';
    } else {
        field.type = 'password';
        toggle.textContent = '👁️';
    }
}

// Initialize profile picture upload
function initializeProfilePicture() {
    const profilePicInput = document.getElementById('profilePic');
    const profileImg = document.getElementById('profileImg');
    
    if (profilePicInput) {
        profilePicInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profileImg.src = e.target.result;
                    profileImg.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// Validation functions
function validateFullName(name) {
    if (!name || name.length < 3) {
        return "Name must be at least 3 characters long";
    }
    
    if (/\d/.test(name)) {
        return "Name cannot contain numbers";
    }
    
    // Check for same character 3 times consecutively
    for (let i = 0; i < name.length - 2; i++) {
        if (name[i] === name[i + 1] && name[i] === name[i + 2]) {
            return "Name cannot have same character 3 times consecutively";
        }
    }
    
    return null;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return "Please enter a valid email address";
    }
    return null;
}

function validatePassword(password) {
    if (password.length < 8) {
        return "Password must be at least 8 characters long";
    }
    
    if (!/[A-Z]/.test(password)) {
        return "Password must contain at least one uppercase letter";
    }
    
    if (!/[a-z]/.test(password)) {
        return "Password must contain at least one lowercase letter";
    }
    
    if (!/\d/.test(password)) {
        return "Password must contain at least one number";
    }
    
    if (!/[!@#$%^&*]/.test(password)) {
        return "Password must contain at least one special character";
    }
    
    return null;
}

function validatePhone(phone) {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        return "Phone number must be exactly 10 digits";
    }
    return null;
}

function validateAge(dob) {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    if (age < 18) {
        return "You must be at least 18 years old";
    }
    
    return null;
}

function validateAddress(address) {
    if (!address || address.length < 10) {
        return "Address must be at least 10 characters long";
    }
    return null;
}

function showValidationMessage(fieldId, message, isError = true) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(fieldId + 'Error');
    const successDiv = document.getElementById(fieldId + 'Success');
    
    if (isError) {
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
        if (successDiv) {
            successDiv.style.display = 'none';
        }
        if (field) {
            field.classList.add('invalid');
            field.classList.remove('valid');
        }
    } else {
        if (successDiv) {
            successDiv.textContent = message;
            successDiv.style.display = 'block';
        }
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
        if (field) {
            field.classList.add('valid');
            field.classList.remove('invalid');
        }
    }
}

function clearValidationMessage(fieldId) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(fieldId + 'Error');
    const successDiv = document.getElementById(fieldId + 'Success');
    
    if (errorDiv) errorDiv.style.display = 'none';
    if (successDiv) successDiv.style.display = 'none';
    if (field) field.classList.remove('invalid', 'valid');
}

// Initialize real-time validation
function initializeValidation() {
    const fields = [
        { id: 'fullName', validator: validateFullName },
        { id: 'email', validator: validateEmail },
        { id: 'password', validator: validatePassword },
        { id: 'phone', validator: validatePhone },
        { id: 'dob', validator: validateAge },
        { id: 'address', validator: validateAddress }
    ];

    fields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element) {
            element.addEventListener('input', function() {
                const error = field.validator(this.value);
                if (error) {
                    showValidationMessage(field.id, error, true);
                } else {
                    showValidationMessage(field.id, '✓ Valid', false);
                }
            });
        }
    });

    // Confirm password validation
    const confirmPasswordField = document.getElementById('confirmPassword');
    if (confirmPasswordField) {
        confirmPasswordField.addEventListener('input', function() {
            const password = document.getElementById('password').value;
            if (this.value !== password) {
                showValidationMessage('confirmPassword', 'Passwords do not match', true);
            } else {
                showValidationMessage('confirmPassword', '✓ Passwords match', false);
            }
        });
    }
}

// Initialize registration form
function initializeRegisterForm() {
    const form = document.getElementById('registerForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const userData = {};
            
            // Collect form data
            for (let [key, value] of formData.entries()) {
                userData[key] = value;
            }
            
            // Collect skills
            const skills = [];
            const skillCheckboxes = document.querySelectorAll('input[name="skills"]:checked');
            skillCheckboxes.forEach(checkbox => skills.push(checkbox.value));
            userData.skills = skills;
            
            // Add profile picture if uploaded
            const profileImg = document.getElementById('profileImg');
            if (profileImg && profileImg.src && profileImg.src !== '') {
                userData.profilePicture = profileImg.src;
            }
            
            // Validate all fields
            let isValid = true;
            
            // Validate full name
            const nameError = validateFullName(userData.fullName);
            if (nameError) {
                showValidationMessage('fullName', nameError, true);
                isValid = false;
            }
            
            // Validate email
            const emailError = validateEmail(userData.email);
            if (emailError) {
                showValidationMessage('email', emailError, true);
                isValid = false;
            }
            
            // Check if email already exists
            const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
            if (existingUsers.find(user => user.email === userData.email)) {
                showValidationMessage('email', 'Email already exists', true);
                isValid = false;
            }
            
            // Validate password
            const passwordError = validatePassword(userData.password);
            if (passwordError) {
                showValidationMessage('password', passwordError, true);
                isValid = false;
            }
            
            // Validate confirm password
            if (userData.password !== userData.confirmPassword) {
                showValidationMessage('confirmPassword', 'Passwords do not match', true);
                isValid = false;
            }
            
            // Validate phone
            const phoneError = validatePhone(userData.phone);
            if (phoneError) {
                showValidationMessage('phone', phoneError, true);
                isValid = false;
            }
            
            // Validate age
            const ageError = validateAge(userData.dob);
            if (ageError) {
                showValidationMessage('dob', ageError, true);
                isValid = false;
            }
            
            // Validate address
            const addressError = validateAddress(userData.address);
            if (addressError) {
                showValidationMessage('address', addressError, true);
                isValid = false;
            }
            
            // Validate gender
            if (!userData.gender) {
                showValidationMessage('gender', 'Please select a gender', true);
                isValid = false;
            }
            
            // Validate city
            if (!userData.city) {
                showValidationMessage('city', 'Please select a city', true);
                isValid = false;
            }
            
            // Validate skills
            if (skills.length === 0) {
                showValidationMessage('skills', 'Please select at least one skill', true);
                isValid = false;
            }
            
            // Validate terms
            if (!userData.terms) {
                showValidationMessage('terms', 'Please accept the terms and conditions', true);
                isValid = false;
            }
            
            if (isValid) {
                // Save user data
                existingUsers.push(userData);
                localStorage.setItem('users', JSON.stringify(existingUsers));
                
                alert('Registration successful! You can now login.');
                window.location.href = 'login.html';
            }
        });
    }
}

// Initialize login form
function initializeLoginForm() {
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Validate inputs
            if (!email || !password) {
                showValidationMessage('loginEmail', 'Please fill in all fields', true);
                return;
            }
            
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            // Find user
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Set current user session
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                showValidationMessage('loginEmail', 'Invalid email or password', true);
            }
        });
    }
}

// Load user data in dashboard
function loadUserData() {
    const currentUser = checkSession();
    if (!currentUser) return;
    
    const userInfoDiv = document.getElementById('userInfo');
    if (userInfoDiv) {
        let profilePicHtml = '';
        if (currentUser.profilePicture) {
            profilePicHtml = `
                <div class="profile-pic-dashboard">
                    <img src="${currentUser.profilePicture}" alt="Profile">
                </div>
            `;
        }
        
        userInfoDiv.innerHTML = `
            ${profilePicHtml}
            <h3>Welcome, ${currentUser.fullName}!</h3>
            <p><strong>Email:</strong> ${currentUser.email}</p>
            <p><strong>Phone:</strong> ${currentUser.phone}</p>
            <p><strong>Gender:</strong> ${currentUser.gender}</p>
            <p><strong>Date of Birth:</strong> ${currentUser.dob}</p>
            <p><strong>City:</strong> ${currentUser.city}</p>
            <p><strong>Address:</strong> ${currentUser.address}</p>
            <p><strong>Skills:</strong> ${currentUser.skills ? currentUser.skills.join(', ') : 'None'}</p>
        `;
    }
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Update profile function
function updateProfile() {
    const currentUser = checkSession();
    if (!currentUser) return;
    
    // You can implement profile update functionality here
    alert('Profile update functionality can be implemented here');
}

// Delete account function
function deleteAccount() {
    const currentUser = checkSession();
    if (!currentUser) return;
    
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        // Get all users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Remove current user
        const updatedUsers = users.filter(user => user.email !== currentUser.email);
        
        // Update localStorage
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        // Clear session
        localStorage.removeItem('currentUser');
        
        alert('Account deleted successfully');
        window.location.href = 'login.html';
    }
}

// Clear all data function (for testing purposes)
function clearAllData() {
    if (confirm('Are you sure you want to clear all data? This will remove all registered users.')) {
        localStorage.removeItem('users');
        localStorage.removeItem('currentUser');
        alert('All data cleared');
        window.location.href = 'login.html';
    }
}

// Utility function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

// Utility function to calculate age
function calculateAge(dob) {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

// Display user count (for admin purposes)
function displayUserCount() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    console.log(`Total registered users: ${users.length}`);
    return users.length;
}

// Search users function (for admin purposes)
function searchUsers(searchTerm) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.filter(user => 
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
}