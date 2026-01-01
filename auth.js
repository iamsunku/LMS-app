// Auth page functionality with advanced animations
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form-container');
    const splitContainer = document.querySelector('.auth-split-container');
    const infoPanel = document.querySelector('.auth-info-panel');

    // Quotes Database
    const quotes = [
        { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
        { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
        { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
        { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" }
    ];
    let currentQuoteIndex = 0;

    // Initial animations for the split container
    setTimeout(() => {
        animateFormElements(document.querySelector('.auth-form-container.active'));
    }, 100);

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');

            if (tab.classList.contains('active')) return;

            // Toggle Register Mode on Left Panel
            if (targetTab === 'register') {
                infoPanel.classList.add('register-mode');
                cycleQuote();
            } else {
                infoPanel.classList.remove('register-mode');
            }

            // Tab switch animation
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Form switch animation
            forms.forEach(f => {
                if (f.classList.contains('active')) {
                    f.style.opacity = '0';
                    f.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        f.classList.remove('active');
                        const targetForm = document.getElementById(`${targetTab}-form`);
                        targetForm.classList.add('active');
                        targetForm.style.opacity = '0';
                        targetForm.style.transform = 'translateY(10px)';

                        // Trigger reflow
                        targetForm.offsetHeight;

                        targetForm.style.opacity = '1';
                        targetForm.style.transform = 'translateY(0)';
                        animateFormElements(targetForm);
                    }, 300);
                }
            });
        });
    });

    function cycleQuote() {
        currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
        const quoteEl = document.getElementById('dynamic-quote');
        const textEl = quoteEl.querySelector('.quote-text');
        const authorEl = quoteEl.querySelector('.quote-author');

        textEl.textContent = quotes[currentQuoteIndex].text;
        authorEl.textContent = `— ${quotes[currentQuoteIndex].author}`;
    }

    function animateFormElements(container) {
        const elements = container.querySelectorAll('.form-group, .auth-toggle-group, .auth-btn, .form-options, .auth-title, .auth-subtitle');
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${index * 0.1}s`;

            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 50);
        });
    }

    // Handle register link click
    const registerLinks = document.querySelectorAll('.register-link');
    registerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const registerTab = document.querySelector('[data-tab="register"]');
            if (registerTab) registerTab.click();
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
                emailLabel.textContent = 'User ID';
                emailInput.placeholder = 'PAR12345678';
                emailHint.style.display = 'block';
            } else {
                emailLabel.textContent = 'Email Address';
                emailInput.placeholder = 'your@email.com';
                emailHint.style.display = 'none';
            }
        });
    });

    // Handle form submissions
    const authForms = document.querySelectorAll('.auth-form');
    authForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;

            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                alert('Success! Processed successfully.');
            }, 2000);
        });
    });

    // Handle guest button click
    const guestBtn = document.querySelector('.btn-outline');
    if (guestBtn) {
        guestBtn.addEventListener('click', () => {
            window.location.href = 'guest.html';
        });
    }
});
