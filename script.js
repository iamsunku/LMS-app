document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('hero-video');
    const playButton = document.querySelector('.play-button');
    const overlay = document.querySelector('.video-overlay');

    if (playButton && video) {
        overlay.style.cursor = 'pointer';

        const updatePlayState = () => {
            if (video.paused) {
                playButton.style.opacity = '1';
            } else {
                playButton.style.opacity = '0';
            }
        };

        video.addEventListener('play', updatePlayState);
        video.addEventListener('pause', updatePlayState);

        // Check initial state (for autoplay)
        if (!video.paused) {
            updatePlayState();
        }

        overlay.addEventListener('click', () => {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });
    }

    // Scroll animation for cards
    const cards = document.querySelectorAll('.feature-card');
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });
});
