// Auth page tab switching functionality
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form-container');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');

            // Remove active class from all tabs and forms
            tabs.forEach(t => t.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));

            // Add active class to clicked tab
            tab.classList.add('active');

            // Show corresponding form
            const targetForm = document.getElementById(`${targetTab}-form`);
            if (targetForm) {
                targetForm.classList.add('active');
            }
        });
    });

    // Handle register link click
    const registerLinks = document.querySelectorAll('.register-link');
    registerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const registerTab = document.querySelector('[data-tab="register"]');
            if (registerTab) {
                registerTab.click();
            }
        });
    });

    // Handle user type selection change
    const userTypeRadios = document.querySelectorAll('input[name="user-type"]');
    userTypeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const emailLabel = document.getElementById('email-label');
            const emailInput = document.getElementById('login-email');
            const emailHint = document.getElementById('email-hint');

            if (e.target.value === 'parent') {
                // Change to User ID for Parent
                emailLabel.textContent = 'User ID';
                emailInput.placeholder = 'PAR12345678';
                emailInput.type = 'text';
                emailHint.style.display = 'block';
            } else {
                // Change to Email Address for User
                emailLabel.textContent = 'Email Address';
                emailInput.placeholder = 'your@email.com';
                emailInput.type = 'text';
                emailHint.style.display = 'none';
            }
        });
    });

    // Handle form submissions
    const authForms = document.querySelectorAll('.auth-form');
    authForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const isLoginForm = form.closest('#login-form');
            if (isLoginForm) {
                handleLogin(form);
            } else {
                handleRegister(form);
            }
        });
    });
});

function handleLogin(form) {
    const email = form.querySelector('#login-email').value;
    const password = form.querySelector('#login-password').value;
    const rememberMe = form.querySelector('#remember-me').checked;

    console.log('Login attempt:', { email, rememberMe });

    // Add your login logic here
    alert('Login functionality will be implemented here!');
}

function handleRegister(form) {
    const name = form.querySelector('#register-name').value;
    const email = form.querySelector('#register-email').value;
    const password = form.querySelector('#register-password').value;
    const confirmPassword = form.querySelector('#register-confirm-password').value;
    const termsAccepted = form.querySelector('#terms').checked;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    if (!termsAccepted) {
        alert('Please accept the Terms & Conditions');
        return;
    }

    console.log('Register attempt:', { name, email });

    // Add your registration logic here
    alert('Registration functionality will be implemented here!');
}
