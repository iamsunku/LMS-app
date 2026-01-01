document.addEventListener('DOMContentLoaded', () => {
    // Inject Chatbot HTML
    const chatbotHTML = `
        <div class="chatbot-container">
            <div class="chatbot-toggle" id="chat-toggle">
                <i class="fa-solid fa-robot"></i>
                <div class="notification-dot"></div>
            </div>
            <div class="chatbot-window" id="chat-window">
                <div class="chatbot-header">
                    <div class="chat-info">
                        <h3>EduMind AI</h3>
                        <span>Always active to help you</span>
                    </div>
                    <div class="close-chat" id="close-chat">
                        <i class="fa-solid fa-xmark"></i>
                    </div>
                </div>
                <div class="chatbot-messages" id="chat-messages">
                    <div class="message msg-bot">
                        Hello explorer! I'm EduMind, your AI learning assistant. How can I help you today?
                    </div>
                </div>
                <div class="chat-quick-options">
                    <div class="quick-opt" data-msg="View Packages">View Packages</div>
                    <div class="quick-opt" data-msg="How to Register?">Registration Help</div>
                    <div class="quick-opt" data-msg="Speak to Admin">Connect with Admin</div>
                    <div class="quick-opt" data-msg="Free Trial">Request Trial</div>
                </div>
                <div class="chatbot-input">
                    <input type="text" id="chat-input" placeholder="Type your message here...">
                    <i class="fa-solid fa-paper-plane send-chat" id="send-chat"></i>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);

    const toggle = document.getElementById('chat-toggle');
    const window = document.getElementById('chat-window');
    const closeBtn = document.getElementById('close-chat');
    const sendBtn = document.getElementById('send-chat');
    const input = document.getElementById('chat-input');
    const messagesContainer = document.getElementById('chat-messages');
    const quickOpts = document.querySelectorAll('.quick-opt');

    // Toggle Chat
    toggle.addEventListener('click', () => {
        window.classList.toggle('active');
        document.querySelector('.notification-dot').style.display = 'none';
    });

    closeBtn.addEventListener('click', () => {
        window.classList.remove('active');
    });

    // Send Message Logic
    function sendMessage(msg) {
        if (!msg.trim()) return;

        // User Message
        const userDiv = document.createElement('div');
        userDiv.className = 'message msg-user';
        userDiv.textContent = msg;
        messagesContainer.appendChild(userDiv);
        input.value = '';

        scrollToBottom();

        // Bot Response Simulation
        setTimeout(() => {
            const botDiv = document.createElement('div');
            botDiv.className = 'message msg-bot';
            botDiv.textContent = getBotResponse(msg);
            messagesContainer.appendChild(botDiv);
            scrollToBottom();
        }, 800);
    }

    function getBotResponse(input) {
        const lower = input.toLowerCase();
        if (lower.includes('package')) return "We offer School (Grades 1-12) and Competitive packages (JEE/NEET). You can explore them in our Packages section!";
        if (lower.includes('register')) return "Registration is easy! Just click 'LOGIN/REGISTER' in the menu, go to the Register tab, and fill in your student details.";
        if (lower.includes('admin') || lower.includes('speak')) return "Connecting you with an admin... Our team usually responds within 5 minutes. Please stay on the line!";
        if (lower.includes('trial')) return "Good news! You can explore most of our platform features in 'Guest Mode' right now.";
        return "That's an interesting question! For specific academic doubts, our AI Mentors are available inside each subject module after you subscribe.";
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    sendBtn.addEventListener('click', () => sendMessage(input.value));
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage(input.value);
    });

    quickOpts.forEach(opt => {
        opt.addEventListener('click', () => {
            sendMessage(opt.dataset.msg);
        });
    });
});
