document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('config-modal');
    const closeBtn = document.getElementById('close-config');
    const configForm = document.getElementById('plan-config-form');
    const gradeSelect = document.getElementById('grade-select');
    const subjectsContainer = document.getElementById('subjects-container');
    const priceDisplay = document.getElementById('package-price');
    const packageHero = document.querySelector('.packages-hero');
    const packagesSections = document.querySelectorAll('.packages-section');
    const learningPortal = document.getElementById('learning-portal');

    // Quiz State
    let currentSubjectIndex = 0;
    let currentChapterIndex = 1;
    let quizQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let isVideoFinished = false;
    let userProgress = {}; // Tracks completion per subject/chapter

    // Subject Data
    const subjectsByGrade = {
        'junior': ['Mathematics', 'English', 'Science', 'Social Studies', 'Moral Science'],
        'senior': ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'History', 'Geography', 'Economics']
    };

    // Mock Questions Database
    const mockQuestions = [
        { q: "What is the primary focus of this chapter?", a: ["Introduction", "Advanced Theory", "Historical Context", "Practical Application"], c: 0 },
        { q: "Which of these is a fundamental concept discussed?", a: ["Complexity", "Basics", "Evolution", "Scaling"], c: 1 },
        { q: "The provided resources include which of the following?", a: ["Audio files", "Summary PDF", "Source Code", "Live link"], c: 1 },
        { q: "To unlock the next chapter, you need a score of:", a: ["40%", "50%", "60%", "100%"], c: 2 },
        { q: "Which tool is used for note-taking in the portal?", a: ["Sticky Notes", "MS Word", "Built-in Notes Area", "Pen and Paper"], c: 2 },
        { q: "True or False: You can skip the video and take the quiz directy.", a: ["True", "False"], c: 1 },
        { q: "What color is the 'Save Notes' button?", a: ["Blue", "Green", "Orange", "Red"], c: 2 },
        { q: "How many questions are in this module quiz?", a: ["5", "10", "15", "20"], c: 1 },
        { q: "What signifies a 'Locked' quiz tab?", a: ["A red dot", "A lock icon", "Grey text", "None"], c: 1 },
        { q: "Which board was selected during configuration?", a: ["CBSE", "ICSE", "IGCSE", "Dynamic based on choice"], c: 3 }
    ];

    // Populate Grades 1-12
    for (let i = 1; i <= 12; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Grade ${i}`;
        gradeSelect.appendChild(option);
    }

    // Open Modal logic
    document.querySelectorAll('.package-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const packageTitle = e.target.parentElement.querySelector('.package-title').textContent;
            modal.style.display = 'flex';
            modal.dataset.package = packageTitle;
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = 'none';
    };

    // Update subjects based on grade
    gradeSelect.addEventListener('change', (e) => {
        const grade = parseInt(e.target.value);
        subjectsContainer.innerHTML = '';

        if (!grade) {
            subjectsContainer.innerHTML = '<p style="color: #999; font-style: italic;">Select a grade first...</p>';
            updatePrice();
            return;
        }

        const type = grade <= 7 ? 'junior' : 'senior';
        subjectsByGrade[type].forEach(sub => {
            const div = document.createElement('div');
            div.className = 'subject-item';
            div.innerHTML = `
                <input type="checkbox" name="subjects" value="${sub}" id="sub-${sub}">
                <label for="sub-${sub}">${sub}</label>
            `;
            subjectsContainer.appendChild(div);

            div.querySelector('input').addEventListener('change', updatePrice);
        });
        updatePrice();
    });

    function updatePrice() {
        const selectedSubjects = document.querySelectorAll('input[name="subjects"]:checked');
        const count = selectedSubjects.length;
        const basePrice = 2500;
        const totalPrice = count * basePrice;
        priceDisplay.textContent = totalPrice.toLocaleString();
    }

    // Purchase flow
    configForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedSubjects = Array.from(document.querySelectorAll('input[name="subjects"]:checked')).map(cb => cb.value);

        if (selectedSubjects.length === 0) {
            alert('Please select at least one subject!');
            return;
        }

        const submitBtn = configForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Processing Purchase...';
        submitBtn.disabled = true;

        setTimeout(() => {
            modal.style.display = 'none';
            initDashboard(selectedSubjects);
        }, 1500);
    });

    function initDashboard(subjects) {
        packageHero.style.display = 'none';
        packagesSections.forEach(s => s.style.display = 'none');
        learningPortal.style.display = 'block';
        window.scrollTo(0, 0);

        const list = document.getElementById('dashboard-subject-list');
        list.innerHTML = '';
        subjects.forEach((sub, index) => {
            userProgress[sub] = { completedChapters: 0, currentChapter: 1 };
            const li = document.createElement('li');
            li.className = `subject-nav-item ${index === 0 ? '' : 'locked'}`;
            li.innerHTML = `<i class="fa-solid fa-${index === 0 ? 'book' : 'lock'}"></i> <span>${sub}</span>`;

            if (index === 0) {
                li.addEventListener('click', () => switchSubject(sub, li));
            }
            list.appendChild(li);
        });

        document.getElementById('purchased-package-title').textContent = `${modal.dataset.package} Dashboard`;
        document.getElementById('student-plan-info').textContent = `${document.getElementById('board-select').value} | Grade ${gradeSelect.value}`;

        // Setup toggle
        const toggleBtn = document.getElementById('sidebar-toggle');
        const dashboardContainer = document.querySelector('.dashboard-container');
        if (toggleBtn) {
            toggleBtn.onclick = () => {
                dashboardContainer.classList.toggle('sidebar-collapsed');
            };
        }

        // Ensure sidebar is visible on start
        dashboardContainer.classList.remove('sidebar-collapsed');

        switchSubject(subjects[0], list.firstChild);
    }

    function switchSubject(subjectName, element) {
        if (element.classList.contains('locked')) {
            alert('Please complete previous sections to unlock this subject.');
            return;
        }

        document.querySelectorAll('.subject-nav-item').forEach(el => el.classList.remove('active'));
        element.classList.add('active');

        const titleContainer = document.getElementById('active-content-title');
        const h3 = titleContainer.querySelector('h3');
        if (h3) {
            h3.textContent = `${subjectName} - Chapter ${userProgress[subjectName].currentChapter}: Introduction`;
        }

        // Populate Curriculum (Chapters) list
        const curriculumList = document.getElementById('curriculum-list');
        if (curriculumList) {
            curriculumList.innerHTML = '';
            const chapters = [
                { name: 'Introduction', locked: false },
                { name: 'Core Principles', locked: userProgress[subjectName].completedChapters < 1 },
                { name: 'Practical Examples', locked: true },
                { name: 'Final Assessment', locked: true }
            ];

            chapters.forEach((ch, i) => {
                const li = document.createElement('li');
                li.className = `chapter-item ${i === 0 ? 'active' : ''} ${ch.locked ? 'locked' : ''}`;
                li.innerHTML = `<i class="fa-solid fa-${ch.locked ? 'lock' : 'circle-play'}"></i> <span>${ch.name}</span>`;
                curriculumList.appendChild(li);
            });
        }

        // Reset Video State for new Chapter/Subject
        isVideoFinished = false;
        updateQuizLockState();

        // Reset auto-scroll items
        const hlItems = document.querySelectorAll('.v-content-item');
        hlItems.forEach(item => item.classList.remove('active'));
        if (hlItems.length) hlItems[0].classList.add('active');

        // Tab to Video
        document.querySelector('[data-tab="video"]').click();

        // Play Button / Video Placeholder logic
        const video = document.getElementById('main-course-video');
        const videoOverlay = document.getElementById('video-overlay');
        const dashboardContainer = document.querySelector('.dashboard-container');

        if (video && videoOverlay) {
            videoOverlay.onclick = () => {
                dashboardContainer.classList.add('watching-video');
                videoOverlay.style.display = 'none'; // Hide overlay on play

                video.play().then(() => {
                    console.log("Video playing");
                }).catch(err => {
                    console.warn("Video play failed, fallback to simulation", err);
                    simulateVideoProgress();
                });
            };

            video.ontimeupdate = () => {
                handleVideoProgress(video.currentTime, video.duration);
            };

            video.onended = () => {
                isVideoFinished = true;
                updateQuizLockState();

                setTimeout(() => {
                    dashboardContainer.classList.remove('watching-video');
                    showQuizInPlayer();
                }, 1000);
            };
        }
    }

    function handleVideoProgress(current, duration) {
        const items = document.querySelectorAll('.v-content-item');
        if (!items.length) return;

        const segmentDuration = duration / items.length;
        const currentHL = Math.floor(current / segmentDuration);

        items.forEach((item, index) => {
            if (index === currentHL) {
                if (!item.classList.contains('active')) {
                    item.classList.add('active');
                    item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            } else {
                item.classList.remove('active');
            }
        });
    }

    function simulateVideoProgress() {
        const items = document.querySelectorAll('.v-content-item');
        const dashboardContainer = document.querySelector('.dashboard-container');
        let currentHL = 0;

        const interval = setInterval(() => {
            if (currentHL < items.length - 1) {
                items[currentHL].classList.remove('active');
                currentHL++;
                items[currentHL].classList.add('active');
                items[currentHL].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                clearInterval(interval);
                isVideoFinished = true;
                updateQuizLockState();
                setTimeout(() => {
                    dashboardContainer.classList.remove('watching-video');
                    showQuizInPlayer();
                }, 1000);
            }
        }, 2000);
    }

    function showQuizInPlayer() {
        const playerBox = document.getElementById('player-container');
        const playerQuizContainer = document.getElementById('player-quiz-container');
        const tabQuiz = document.getElementById('tab-quiz');

        if (playerQuizContainer && tabQuiz) {
            playerQuizContainer.innerHTML = '';
            playerQuizContainer.appendChild(tabQuiz);
            tabQuiz.style.display = 'block';
            if (playerBox) playerBox.classList.add('quiz-mode');
            playerQuizContainer.style.display = 'block';
            startQuiz();
        }
    }

    function updateQuizLockState() {
        const quizTab = document.getElementById('quiz-tab-handle');
        if (!quizTab) return;

        if (isVideoFinished) {
            quizTab.style.display = 'block';
            quizTab.style.pointerEvents = 'auto';
            quizTab.style.opacity = '1';
        } else {
            quizTab.style.display = 'none';
            quizTab.style.pointerEvents = 'none';
        }
    }

    // Tab Switching Logic
    const tabs = document.querySelectorAll('.content-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.id === 'quiz-tab-handle' && !isVideoFinished) {
                alert('Please finish watching the video first!');
                return;
            }

            const target = tab.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            tabContents.forEach(tc => {
                tc.style.display = tc.id === `tab-${target}` ? 'block' : 'none';
            });

            if (target === 'quiz') resetQuizUI();
        });
    });

    // Quiz Navigation/Logic
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const quizInitial = document.getElementById('quiz-initial');
    const quizActive = document.getElementById('quiz-active');
    const quizResults = document.getElementById('quiz-results');
    const nextQBtn = document.getElementById('next-q-btn');
    const questionText = document.getElementById('quiz-question-text');
    const optionsContainer = document.getElementById('quiz-options');
    const currentQNumDisplay = document.getElementById('current-q-num');

    const showAnswerBtn = document.getElementById('show-answer-btn');

    startQuizBtn.addEventListener('click', startQuiz);
    nextQBtn.addEventListener('click', nextQuestion);
    showAnswerBtn.addEventListener('click', () => {
        const qData = mockQuestions[currentQuestionIndex];
        const options = document.querySelectorAll('.quiz-option');
        options[qData.c].classList.add('correct');
        showAnswerBtn.style.display = 'none';
        nextQBtn.style.display = 'block';
    });

    function startQuiz() {
        quizInitial.style.display = 'none';
        quizActive.style.display = 'block';
        quizResults.style.display = 'none';
        currentQuestionIndex = 0;
        score = 0;
        showQuestion();
    }

    function showQuestion() {
        const qData = mockQuestions[currentQuestionIndex];
        currentQNumDisplay.textContent = currentQuestionIndex + 1;
        questionText.textContent = qData.q;
        optionsContainer.innerHTML = '';
        nextQBtn.style.display = 'none';

        qData.a.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.textContent = opt;
            btn.addEventListener('click', () => selectOption(i, btn));
            optionsContainer.appendChild(btn);
        });

        // Show "Show Answer" button if needed
        showAnswerBtn.style.display = 'block';
    }

    function selectOption(index, btn) {
        const qData = mockQuestions[currentQuestionIndex];

        // Style feedback
        document.querySelectorAll('.quiz-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        // Disable all options
        document.querySelectorAll('.quiz-option').forEach(b => b.disabled = true);

        if (index === qData.c) {
            btn.classList.add('correct');
            score++;
        } else {
            btn.classList.add('wrong');
            document.querySelectorAll('.quiz-option')[qData.c].classList.add('correct');
        }

        showAnswerBtn.style.display = 'none';
        nextQBtn.style.display = 'block';
    }

    function nextQuestion() {
        currentQuestionIndex++;
        if (currentQuestionIndex < 10) {
            showQuestion();
        } else {
            showResults();
        }
    }

    function showResults() {
        quizActive.style.display = 'none';
        quizResults.style.display = 'block';

        const percentage = (score / 10) * 100;
        const passed = percentage >= 60;

        quizResults.innerHTML = `
            <i class="fa-solid fa-${passed ? 'circle-check' : 'circle-xmark'}" style="font-size: 4rem; color: ${passed ? '#2ecc71' : '#e74c3c'}; margin-bottom: 20px;"></i>
            <h2>${passed ? 'Congratulations!' : 'Almost There!'}</h2>
            <p style="font-size: 1.2rem; margin: 15px 0;">Your Score: <strong>${score} / 10 (${percentage}%)</strong></p>
            <p style="color: #666; margin-bottom: 30px;">${passed ? 'You have successfully passed the module quiz.' : 'You need at least 60% to move to the next chapter.'}</p>
            ${passed ?
                `<button class="confirm-buy-btn" onclick="location.reload()" style="max-width: 250px;">Next Chapter Unlocked!</button>` :
                `<button class="confirm-buy-btn" id="retry-quiz-btn" style="max-width: 250px;">Retry Quiz</button>`
            }
        `;

        if (!passed) {
            document.getElementById('retry-quiz-btn').addEventListener('click', startQuiz);
        } else {
            // Unlock next chapter logic (simplified for demo)
            console.log("Next content unlocked.");
        }
    }

    function resetQuizUI() {
        quizInitial.style.display = 'block';
        quizActive.style.display = 'none';
        quizResults.style.display = 'none';
    }

    // Notes Logic
    document.querySelector('.save-notes-btn').addEventListener('click', () => {
        const area = document.querySelector('.notes-area');
        if (area.value.trim()) {
            alert('Progress Saved! Your notes are secured for this session.');
        } else {
            alert('Please type something before saving.');
        }
    });
});
