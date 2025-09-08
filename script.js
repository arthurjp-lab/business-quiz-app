class QuizGame {
    constructor() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.timeLeft = 45;
        this.timer = null;
        this.gameQuestions = [];
        this.userAnswers = [];
        this.gameHistory = this.loadGameHistory();
        this.currentUsername = '';
        this.isAdminMode = false;
        this.adminPassword = 'admin123';
        
        this.initializeGame();
    }

    initializeGame() {
        this.showScreen('menu-screen');
        this.loadStatistics();
        this.updateAdminButtonVisibility();
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    startQuiz() {
        if (!this.currentUsername) {
            alert('ユーザー名を入力してください。');
            return;
        }
        
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.gameQuestions = this.shuffleArray([...quizQuestions]).slice(0, 10);
        
        this.showScreen('quiz-screen');
        this.displayQuestion();
        this.startTimer();
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    displayQuestion() {
        const question = this.gameQuestions[this.currentQuestionIndex];
        const progress = ((this.currentQuestionIndex) / this.gameQuestions.length) * 100;
        
        document.getElementById('progress').style.width = `${progress}%`;
        document.getElementById('question-number').textContent = `問題 ${this.currentQuestionIndex + 1}/${this.gameQuestions.length}`;
        document.getElementById('question-text').textContent = question.question;
        
        const optionsContainer = document.getElementById('options');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option;
            optionElement.onclick = () => this.selectAnswer(index);
            optionsContainer.appendChild(optionElement);
        });
        
        this.timeLeft = 45;
        this.updateTimer();
    }

    selectAnswer(answerIndex) {
        document.querySelectorAll('.option').forEach(option => {
            option.classList.remove('selected');
        });
        
        document.querySelectorAll('.option')[answerIndex].classList.add('selected');
        
        setTimeout(() => {
            this.checkAnswer(answerIndex);
        }, 500);
    }

    checkAnswer(answerIndex) {
        const question = this.gameQuestions[this.currentQuestionIndex];
        const isCorrect = answerIndex === question.correct;
        
        this.userAnswers.push({
            questionId: question.id,
            selectedAnswer: answerIndex,
            isCorrect: isCorrect,
            timeSpent: 45 - this.timeLeft
        });
        
        if (isCorrect) {
            this.score++;
        }
        
        this.showAnswerFeedback(answerIndex, question.correct);
        
        setTimeout(() => {
            this.nextQuestion();
        }, 2000);
    }

    showAnswerFeedback(selectedIndex, correctIndex) {
        const options = document.querySelectorAll('.option');
        
        options[correctIndex].classList.add('correct');
        
        if (selectedIndex !== correctIndex) {
            options[selectedIndex].classList.add('wrong');
        }
        
        options.forEach(option => {
            option.onclick = null;
        });
        
        this.stopTimer();
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex < this.gameQuestions.length) {
            this.displayQuestion();
            this.startTimer();
        } else {
            this.endQuiz();
        }
    }

    startTimer() {
        this.timeLeft = 45;
        this.updateTimer();
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();
            
            if (this.timeLeft <= 0) {
                this.timeUp();
            }
        }, 1000);
    }

    updateTimer() {
        const timerElement = document.getElementById('timer');
        timerElement.textContent = this.timeLeft;
        
        if (this.timeLeft <= 10) {
            timerElement.style.background = '#fed7d7';
            timerElement.style.color = '#e53e3e';
            timerElement.classList.add('pulse');
        } else {
            timerElement.style.background = '#e6fffa';
            timerElement.style.color = '#38b2ac';
            timerElement.classList.remove('pulse');
        }
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    timeUp() {
        this.stopTimer();
        
        const question = this.gameQuestions[this.currentQuestionIndex];
        this.userAnswers.push({
            questionId: question.id,
            selectedAnswer: -1,
            isCorrect: false,
            timeSpent: 45
        });
        
        const options = document.querySelectorAll('.option');
        options[question.correct].classList.add('correct');
        
        options.forEach(option => {
            option.onclick = null;
        });
        
        setTimeout(() => {
            this.nextQuestion();
        }, 2000);
    }

    endQuiz() {
        this.stopTimer();
        this.saveGameResult();
        this.showResults();
    }

    showResults() {
        this.showScreen('result-screen');
        
        const finalScore = this.score;
        const accuracy = Math.round((finalScore / this.gameQuestions.length) * 100);
        
        document.getElementById('result-username').textContent = `${this.currentUsername} さんの結果`;
        document.getElementById('final-score').textContent = finalScore;
        document.getElementById('correct-count').textContent = finalScore;
        document.getElementById('accuracy-rate').textContent = `${accuracy}%`;
        
        let message = '';
        if (accuracy >= 90) {
            message = '素晴らしい！経営学の専門家レベルです！';
        } else if (accuracy >= 70) {
            message = 'よくできました！経営学の知識が豊富ですね！';
        } else if (accuracy >= 50) {
            message = '合格点です！もう少し勉強すればさらに向上できます！';
        } else {
            message = '基礎から復習してみましょう！頑張って！';
        }
        
        document.getElementById('score-message').textContent = message;
        
        document.getElementById('final-score').parentElement.style.animation = 'fadeIn 1s ease-out';
    }

    saveGameResult() {
        const gameResult = {
            date: new Date().toISOString(),
            username: this.currentUsername,
            score: this.score,
            totalQuestions: this.gameQuestions.length,
            accuracy: Math.round((this.score / this.gameQuestions.length) * 100),
            answers: this.userAnswers
        };
        
        this.gameHistory.unshift(gameResult);
        
        if (this.gameHistory.length > 50) {
            this.gameHistory = this.gameHistory.slice(0, 50);
        }
        
        localStorage.setItem('quizGameHistory', JSON.stringify(this.gameHistory));
    }

    loadGameHistory() {
        const saved = localStorage.getItem('quizGameHistory');
        return saved ? JSON.parse(saved) : [];
    }

    showMenu() {
        this.showScreen('menu-screen');
        this.stopTimer();
    }


    loadStatistics() {
        // この機能は管理者のみがアクセス可能になりました
    }

    showUsernameInput() {
        this.showScreen('username-screen');
        document.getElementById('username-input').focus();
    }
    
    setUsernameAndStart() {
        const usernameInput = document.getElementById('username-input');
        const username = usernameInput.value.trim();
        
        if (!username) {
            alert('ユーザー名を入力してください。');
            return;
        }
        
        if (username.length > 20) {
            alert('ユーザー名は20文字以内で入力してください。');
            return;
        }
        
        this.currentUsername = username;
        usernameInput.value = '';
        this.startQuiz();
    }
    
    showAdminLogin() {
        this.showScreen('admin-login-screen');
        document.getElementById('admin-password').focus();
    }
    
    adminLogin() {
        const passwordInput = document.getElementById('admin-password');
        const password = passwordInput.value;
        
        if (password === this.adminPassword) {
            this.isAdminMode = true;
            passwordInput.value = '';
            this.updateAdminButtonVisibility();
            this.showAdmin();
        } else {
            alert('パスワードが間違っています。');
            passwordInput.value = '';
            passwordInput.focus();
        }
    }
    
    adminLogout() {
        this.isAdminMode = false;
        this.updateAdminButtonVisibility();
        this.showMenu();
    }
    
    updateAdminButtonVisibility() {
        const adminBtn = document.getElementById('admin-btn');
        if (this.isAdminMode) {
            adminBtn.style.display = 'inline-block';
        } else {
            adminBtn.style.display = 'none';
        }
    }
    
    showAdmin() {
        if (!this.isAdminMode) {
            alert('管理者権限が必要です。');
            return;
        }
        this.showScreen('admin-screen');
        this.loadAdminData();
    }

    loadAdminData() {
        this.showQuestionList();
        this.loadAdminStatistics();
    }

    showQuestionList() {
        this.setActiveTab('question-list-tab');
        const questionList = document.getElementById('admin-question-list');
        questionList.innerHTML = '';
        
        quizQuestions.forEach(question => {
            const questionItem = document.createElement('div');
            questionItem.className = 'question-item';
            
            questionItem.innerHTML = `
                <h4>${question.question}</h4>
                <div class="question-meta">
                    <span class="category-tag">${categoryNames[question.category]}</span>
                    <button class="edit-btn" onclick="editQuestion(${question.id})">編集</button>
                </div>
            `;
            
            questionList.appendChild(questionItem);
        });
    }

    showAddQuestion() {
        this.setActiveTab('add-question-tab');
    }
    
    showPlayerStats() {
        this.setActiveTab('player-stats-tab');
        this.loadPlayerStatistics();
    }

    showStatistics() {
        this.setActiveTab('statistics-tab');
    }

    setActiveTab(tabId) {
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        if (tabId === 'question-list-tab') {
            document.querySelectorAll('.tab-btn')[0].classList.add('active');
        } else if (tabId === 'add-question-tab') {
            document.querySelectorAll('.tab-btn')[1].classList.add('active');
        } else if (tabId === 'player-stats-tab') {
            document.querySelectorAll('.tab-btn')[2].classList.add('active');
        } else if (tabId === 'statistics-tab') {
            document.querySelectorAll('.tab-btn')[3].classList.add('active');
        }
    }

    loadAdminStatistics() {
        document.getElementById('total-questions').textContent = quizQuestions.length;
        
        const categoryStats = {};
        quizQuestions.forEach(question => {
            categoryStats[question.category] = (categoryStats[question.category] || 0) + 1;
        });
        
        const categoryStatsElement = document.getElementById('category-stats');
        categoryStatsElement.innerHTML = '';
        
        Object.entries(categoryStats).forEach(([category, count]) => {
            const statDiv = document.createElement('div');
            statDiv.innerHTML = `${categoryNames[category]}: ${count}問`;
            categoryStatsElement.appendChild(statDiv);
        });
        
        const systemStatsElement = document.getElementById('system-stats');
        systemStatsElement.innerHTML = `
            <div>総プレイ数: ${this.gameHistory.length}</div>
            <div>平均スコア: ${this.gameHistory.length > 0 ? (this.gameHistory.reduce((sum, game) => sum + game.score, 0) / this.gameHistory.length).toFixed(1) : 0}</div>
        `;
    }
    
    loadPlayerStatistics() {
        const history = this.gameHistory;
        
        // 統計サマリーの計算
        const uniquePlayers = [...new Set(history.map(game => game.username || 'ゲスト'))];
        const totalGames = history.length;
        const avgAccuracy = totalGames > 0 ? Math.round(history.reduce((sum, game) => sum + game.accuracy, 0) / totalGames) : 0;
        
        // サマリー表示の更新
        document.getElementById('total-players').textContent = uniquePlayers.length;
        document.getElementById('total-games-admin').textContent = totalGames;
        document.getElementById('avg-accuracy-admin').textContent = `${avgAccuracy}%`;
        
        // プレイヤーリストの表示
        this.displayPlayerRecords(history);
        
        // フィルターとソートの設定
        this.setupPlayerFilters();
    }
    
    displayPlayerRecords(records, searchTerm = '', sortBy = 'date') {
        const playerList = document.getElementById('admin-player-list');
        playerList.innerHTML = '';
        
        if (records.length === 0) {
            playerList.innerHTML = '<div class="player-record"><div class="player-info">まだゲーム記録がありません</div></div>';
            return;
        }
        
        let filteredRecords = records.filter(record => {
            const username = (record.username || 'ゲスト').toLowerCase();
            return username.includes(searchTerm.toLowerCase());
        });
        
        // ソート処理
        filteredRecords.sort((a, b) => {
            switch(sortBy) {
                case 'date':
                    return new Date(b.date) - new Date(a.date);
                case 'score':
                    return b.score - a.score;
                case 'username':
                    return (a.username || 'ゲスト').localeCompare(b.username || 'ゲスト');
                case 'accuracy':
                    return b.accuracy - a.accuracy;
                default:
                    return 0;
            }
        });
        
        filteredRecords.forEach(record => {
            const playerRecord = document.createElement('div');
            playerRecord.className = 'player-record';
            
            const date = new Date(record.date);
            const dateString = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
            const timeString = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
            
            const username = record.username || 'ゲスト';
            
            playerRecord.innerHTML = `
                <div class="player-info">
                    <div class="player-name">${username}</div>
                    <div class="player-date">${dateString}</div>
                </div>
                <div class="record-score">${record.score}/${record.totalQuestions}</div>
                <div class="record-accuracy">${record.accuracy}%</div>
                <div class="record-details">
                    ${record.answers ? `回答数: ${record.answers.length}` : '詳細なし'}
                </div>
                <div class="record-time">${timeString}</div>
            `;
            
            playerList.appendChild(playerRecord);
        });
    }
    
    setupPlayerFilters() {
        const searchInput = document.getElementById('player-search');
        const sortSelect = document.getElementById('sort-option');
        
        const updateDisplay = () => {
            const searchTerm = searchInput.value;
            const sortBy = sortSelect.value;
            this.displayPlayerRecords(this.gameHistory, searchTerm, sortBy);
        };
        
        searchInput.addEventListener('input', updateDisplay);
        sortSelect.addEventListener('change', updateDisplay);
    }

    addQuestion(questionData) {
        const newQuestion = {
            id: Math.max(...quizQuestions.map(q => q.id)) + 1,
            category: questionData.category,
            question: questionData.question,
            options: questionData.options,
            correct: parseInt(questionData.correct),
            explanation: questionData.explanation || ''
        };
        
        quizQuestions.push(newQuestion);
        this.loadAdminData();
        
        alert('問題が追加されました！');
    }
}

let game;

document.addEventListener('DOMContentLoaded', function() {
    game = new QuizGame();
    
    document.getElementById('add-question-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const questionData = {
            question: document.getElementById('new-question').value,
            category: document.getElementById('new-category').value,
            options: [
                document.getElementById('option-a').value,
                document.getElementById('option-b').value,
                document.getElementById('option-c').value,
                document.getElementById('option-d').value
            ],
            correct: document.getElementById('correct-answer').value
        };
        
        game.addQuestion(questionData);
        
        this.reset();
    });
});

function startQuiz() {
    game.startQuiz();
}

function showMenu() {
    game.showMenu();
}


function showUsernameInput() {
    game.showUsernameInput();
}

function setUsernameAndStart() {
    game.setUsernameAndStart();
}

function showAdminLogin() {
    game.showAdminLogin();
}

function adminLogin() {
    game.adminLogin();
}

function adminLogout() {
    game.adminLogout();
}

function showAdmin() {
    game.showAdmin();
}

function showQuestionList() {
    game.showQuestionList();
}

function showAddQuestion() {
    game.showAddQuestion();
}

function showPlayerStats() {
    game.showPlayerStats();
}

function showStatistics() {
    game.showStatistics();
}

function editQuestion(questionId) {
    alert(`問題ID ${questionId} の編集機能は実装予定です。`);
}