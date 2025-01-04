// guide.js
// guide.js
export const program = {
    currentQuestions: null,
    correctPairs: {},

    async launch(sectionName, targetElement) {
        console.log('🎭 Launching Speakeasy Guide...');
        await this.loadStyles();
        await this.render(sectionName, targetElement);
        
        if (!this.checkGatewayPassed()) {
            await this.loadAndDisplayQuestions(targetElement);
            this.setupListeners(targetElement);
        } else {
            this.showSpeakeasyContent(targetElement);
        }
    },

    async loadStyles() {
        try {
            console.log('🎨 Loading styles...');
            const appElement = document.querySelector('[data-view-type="application"]');
            
            if (!appElement) {
                console.error('❌ Application element not found');
                return;
            }

            const section = appElement.dataset.originSection;
            const application = appElement.dataset.application;
            const cssPath = `/application_groups/${section}/applications/${application}/static/css/guide.css`;
        
            if (!document.querySelector(`link[href*="${cssPath}"]`)) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = cssPath;
                await new Promise((resolve, reject) => {
                    link.onload = () => {
                        console.log('✅ Styles loaded successfully');
                        resolve();
                    };
                    link.onerror = (e) => {
                        console.error('❌ Error loading styles:', e);
                        reject(e);
                    };
                    document.head.appendChild(link);
                });
            }
        } catch (error) {
            console.error('❌ Error in loadStyles:', error);
        }
    },

    checkGatewayPassed() {
        return sessionStorage.getItem('speakeasyAccess') === 'granted';
    },

    async render(sectionName, targetElement) {
        try {
            const appElement = document.querySelector('[data-view-type="application"]');
            const section = appElement.dataset.originSection;
            const application = appElement.dataset.application;

            const templatePath = `/application_groups/${section}/applications/${application}/static/speakeasyguide.html`;
            console.log('📜 Fetching template from:', templatePath);
            
            const response = await fetch(templatePath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const htmlContent = await response.text();
            targetElement.innerHTML = htmlContent;
            
            console.log('✅ Render complete');
        } catch (error) {
            console.error('❌ Error in render:', error);
            targetElement.innerHTML = '<p>Error loading content. Please try again.</p>';
        }
    },

    async loadQuestions() {
        try {
            const appElement = document.querySelector('[data-view-type="application"]');
            const section = appElement.dataset.originSection;
            const application = appElement.dataset.application;
            
            const jsonPath = `/application_groups/${section}/applications/${application}/static/data/speakeasy_sesamepairs.json`;
            console.log('📜 Loading questions from:', jsonPath);
            
            const response = await fetch(jsonPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.questionPairs;
        } catch (error) {
            console.error('❌ Error loading questions:', error);
            return [];
        }
    },

    getRandomQuestions(questions, count = 5) {
        return [...questions]
            .sort(() => Math.random() - 0.5)
            .slice(0, count);
    },

    async loadAndDisplayQuestions(targetElement) {
        const allQuestions = await this.loadQuestions();
        if (allQuestions.length === 0) {
            console.error('❌ No questions loaded');
            return;
        }
        
        this.currentQuestions = this.getRandomQuestions(allQuestions);
        this.correctPairs = {};
        this.currentQuestions.forEach(q => {
            this.correctPairs[q.question] = q.answer;
        });

        this.displayQuestions(targetElement);
    },

    displayQuestions(targetElement) {
        const questionsContainer = targetElement.querySelector('#questionsContainer');
        const answersContainer = targetElement.querySelector('#answersContainer');

        if (!questionsContainer || !answersContainer) {
            console.error('❌ Question or answer container not found');
            return;
        }

        const questionsHTML = this.currentQuestions.map((q, index) => `
            <div class="option question-option">
                <input type="radio" name="question" id="q${index}" value="${q.question}">
                <label for="q${index}">${q.question}</label>
            </div>
        `).join('');

        const shuffledAnswers = [...this.currentQuestions]
            .sort(() => Math.random() - 0.5)
            .map((q, index) => `
                <div class="option answer-option">
                    <input type="radio" name="answer" id="a${index}" value="${q.answer}">
                    <label for="a${index}">${q.answer}</label>
                </div>
            `).join('');

        questionsContainer.innerHTML = questionsHTML;
        answersContainer.innerHTML = shuffledAnswers;
    },

    setupListeners(targetElement) {
        console.log('🎮 Setting up event listeners...');
        const checkAnswersBtn = targetElement.querySelector('.check-answers-btn');
        if (checkAnswersBtn) {
            checkAnswersBtn.addEventListener('click', () => {
                const selectedQuestion = targetElement.querySelector('input[name="question"]:checked');
                const selectedAnswer = targetElement.querySelector('input[name="answer"]:checked');
                const hint = targetElement.querySelector('#hint');

                if (!selectedQuestion || !selectedAnswer) {
                    hint.textContent = 'Please select both a question and an answer.';
                    hint.style.display = 'block';
                    this.shakeButton(checkAnswersBtn);
                    return;
                }

                if (this.correctPairs[selectedQuestion.value] === selectedAnswer.value) {
                    console.log('🎉 Correct answer!');
                    sessionStorage.setItem('speakeasyAccess', 'granted');
                    this.showSpeakeasyContent(targetElement);
                } else {
                    console.log('❌ Incorrect answer');
                    hint.textContent = 'Hmm, that\'s not quite right. Try another combination!';
                    hint.style.display = 'block';
                    this.shakeButton(checkAnswersBtn);
                }
            });
        }

        // Clear hint when selection changes
        const radioButtons = targetElement.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', () => {
                const hint = targetElement.querySelector('#hint');
                if (hint) hint.style.display = 'none';
            });
        });
    },

    showSpeakeasyContent(targetElement) {
        const entranceQuiz = targetElement.querySelector('#entranceQuiz');
        const content = targetElement.querySelector('#speakeasyContent');
        
        if (entranceQuiz && content) {
            entranceQuiz.style.display = 'none';
            content.style.display = 'block';
            content.style.opacity = '0';
            content.style.transform = 'translateY(20px)';
            content.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
            
            setTimeout(() => {
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            }, 100);
        }
    },

    shakeButton(button) {
        if (!button) return;
        button.style.animation = 'none';
        button.offsetHeight; // Trigger reflow
        button.style.animation = 'shake 0.5s ease-in-out';
    }
};

// Add shake animation to document
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

console.log('📦 Speakeasy Guide module loaded');