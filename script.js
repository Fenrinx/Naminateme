// Firebase конфигурация
const firebaseConfig = {
  apiKey: "AIzaSyA7SFNUZTK85Iw40DdtFEZoGtk6ce4MzqI",
  authDomain: "naminateme.firebaseapp.com",
  projectId: "naminateme",
  storageBucket: "naminateme.firebasestorage.app",
  messagingSenderId: "249249124120",
  appId: "1:249249124120:web:a0a18d9fbc7ee3c54ed86d"
};

// Инициализация Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const students = [
    { name: "Барсукова Валерия", photo: "photos/barsukova.jpg", gender: "female" },
    { name: "Гайдукова Валерия", photo: "photos/gaydukova.jpg", gender: "female" },
    { name: "Демирова Анна", photo: "photos/demirova.jpg", gender: "female" },
    { name: "Мамашарипова Зиёдахон", photo: "photos/mamasharipova.jpg", gender: "female" },
    { name: "Одинокова Юлия", photo: "photos/odinokova.jpg", gender: "female" },
    { name: "Асанбеков Тынай", photo: "photos/asanbekov.jpg", gender: "male" },
    { name: "Беляев Александр", photo: "photos/belyaev.jpg", gender: "male" },
    { name: "Воробьев Александр", photo: "photos/vorobiev.jpg", gender: "male" },
    { name: "Гупанов Данила", photo: "photos/gupanov.jpg", gender: "male" },
    { name: "Крутов Павел", photo: "photos/krutov.jpg", gender: "male" },
    { name: "Мазур Александр", photo: "photos/mazur.jpg", gender: "male" },
    { name: "Медведев Илья", photo: "photos/medvedev.jpg", gender: "male" },
    { name: "Московский Дмитрий", photo: "photos/moskovsky.jpg", gender: "male" },
    { name: "Назаренко Ларион", photo: "photos/nazarenko.jpg", gender: "male" },
    { name: "Никитин Кирилл", photo: "photos/nikitin.jpg", gender: "male" },
    { name: "Ракуц Иван", photo: "photos/rakuts.jpg", gender: "male" },
    { name: "Резниченко Алексей", photo: "photos/reznichenko.jpg", gender: "male" },
    { name: "Халваши Иван", photo: "photos/khalvashi.jpg", gender: "male" },
    { name: "Яцышин Андриан", photo: "photos/yatsyshin.jpg", gender: "male" }
];

const nominations = [
    {
        id: "best_male",
        title: "Лучший парень группы",
        description: "Главный приз за выдающиеся качества и лидерство",
        isMain: true,
        gender: "male"
    },
    {
        id: "best_female", 
        title: "Лучшая девушка группы",
        description: "Главный приз за выдающиеся качества и лидерство", 
        isMain: true,
        gender: "female"
    },
    {
        id: "best_student",
        title: "Лучший студент",
        description: "За выдающиеся академические достижения и успехи в учебе",
        isMain: false
    },
    {
        id: "creative", 
        title: "Самый креативный",
        description: "За творческий подход и нестандартное мышление",
        isMain: false
    },
    {
        id: "leader",
        title: "Лучший лидер", 
        description: "За организаторские способности и лидерские качества",
        isMain: false
    },
    {
        id: "friend",
        title: "Лучший друг",
        description: "За надежность и поддержку в трудную минуту",
        isMain: false
    },
    {
        id: "sportsman",
        title: "Лучший спортсмен",
        description: "За спортивные достижения и активный образ жизни",
        isMain: false
    },
    {
        id: "humor",
        title: "Душа компании",
        description: "За отличное чувство юмора и умение поднять настроение",
        isMain: false
    }
];

let currentNomination = null;
let currentUser = null;
const ADMIN_PASSWORD = "admin2024";

const ALL_VOTES_KEY = "premia_isp_2025_all_votes";
const ALL_USERS_KEY = "premia_isp_2025_all_users";
const CURRENT_USER_KEY = "premia_isp_2025_current_user";

// ==================== FIREBASE ФУНКЦИИ ====================

// Сохранить голос в Firebase
async function saveVoteToFirebase(nominationId, studentName) {
    try {
        if (!currentUser) return;

        const voteData = {
            userName: currentUser.name,
            userEmail: currentUser.email,
            userId: currentUser.id,
            nominationId: nominationId,
            nominationTitle: nominations.find(n => n.id === nominationId)?.title,
            studentName: studentName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        // Сохраняем в Firebase
        await db.collection('votes').add(voteData);
        
        // Сохраняем локально для быстрого доступа
        saveToLocalStorage(currentUser.id, nominationId, studentName);
        
        showNotification('Голос сохранен!', 'success');
        updateStats();
        return true;
        
    } catch (error) {
        console.error('Ошибка сохранения в Firebase:', error);
        // Сохраняем локально при ошибке
        saveToLocalStorage(currentUser.id, nominationId, studentName);
        showNotification('Голос сохранен локально', 'info');
        return true;
    }
}

// Получить все голоса из Firebase
async function getAllVotesFromFirebase() {
    try {
        const snapshot = await db.collection('votes').orderBy('timestamp', 'desc').get();
        const votes = {};
        
        snapshot.forEach(doc => {
            const vote = doc.data();
            if (!votes[vote.userId]) votes[vote.userId] = {};
            votes[vote.userId][vote.nominationId] = vote.studentName;
        });
        
        return votes;
    } catch (error) {
        console.error('Ошибка загрузки из Firebase:', error);
        return getAllVotes(); // Возвращаем локальные данные
    }
}

// Получить детальную информацию о голосах
async function getDetailedVotesFromFirebase() {
    try {
        const snapshot = await db.collection('votes').orderBy('timestamp', 'desc').get();
        const votes = [];
        
        snapshot.forEach(doc => {
            votes.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return votes;
    } catch (error) {
        console.error('Ошибка загрузки детальных данных:', error);
        return [];
    }
}

// ==================== LOCALSTORAGE ФУНКЦИИ ====================

function getAllVotes() {
    try {
        const data = localStorage.getItem(ALL_VOTES_KEY);
        return data ? JSON.parse(data) : {};
    } catch (e) {
        return {};
    }
}

function saveAllVotes(votes) {
    try {
        localStorage.setItem(ALL_VOTES_KEY, JSON.stringify(votes));
    } catch (e) {}
}

function getAllUsers() {
    try {
        const data = localStorage.getItem(ALL_USERS_KEY);
        return data ? JSON.parse(data) : {};
    } catch (e) {
        return {};
    }
}

function saveAllUsers(users) {
    try {
        localStorage.setItem(ALL_USERS_KEY, JSON.stringify(users));
    } catch (e) {}
}

function saveToLocalStorage(userId, nominationId, studentName) {
    const allVotes = getAllVotes();
    if (!allVotes[userId]) allVotes[userId] = {};
    allVotes[userId][nominationId] = studentName;
    saveAllVotes(allVotes);
}

// ==================== ОСНОВНЫЕ ФУНКЦИИ ====================

function createSnowflakes() {
    const container = document.getElementById('snowflakes-container');
    if (!container) return;
    
    const count = window.innerWidth < 768 ? 25 : 50;
    
    for (let i = 0; i < count; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.innerHTML = '❄';
        snowflake.style.left = Math.random() * 100 + 'vw';
        snowflake.style.animationDuration = (Math.random() * 5 + 3) + 's';
        snowflake.style.opacity = Math.random() * 0.7 + 0.3;
        snowflake.style.fontSize = (Math.random() * 8 + 6) + 'px';
        snowflake.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(snowflake);
        
        setTimeout(() => snowflake.remove(), 15000);
    }
}

function validateName(name) {
    return name.trim().split(' ').length >= 2 && name.trim().length >= 5;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateForm() {
    const name = document.getElementById('userName')?.value || '';
    const email = document.getElementById('userEmail')?.value || '';
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    
    let isValid = true;
    
    if (!validateName(name)) {
        if (nameError) nameError.style.display = 'block';
        if (nameInput) nameInput.classList.add('invalid');
        isValid = false;
    } else {
        if (nameError) nameError.style.display = 'none';
        if (nameInput) nameInput.classList.remove('invalid');
    }
    
    if (!validateEmail(email)) {
        if (emailError) emailError.style.display = 'block';
        if (emailInput) emailInput.classList.add('invalid');
        isValid = false;
    } else {
        if (emailError) emailError.style.display = 'none';
        if (emailInput) emailInput.classList.remove('invalid');
    }
    
    return isValid;
}

async function initApp() {
    createSnowflakes();
    setInterval(createSnowflakes, 3000);
    
    const userNameInput = document.getElementById('userName');
    const userEmailInput = document.getElementById('userEmail');
    
    if (userNameInput && userEmailInput) {
        userNameInput.addEventListener('input', validateForm);
        userEmailInput.addEventListener('input', validateForm);
        
        userNameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') registerUser();
        });
        userEmailInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') registerUser();
        });
    }
    
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            showVotingSection();
        } catch (e) {
            localStorage.removeItem(CURRENT_USER_KEY);
            showRegistrationSection();
        }
    } else {
        showRegistrationSection();
    }
    
    updateStats();
}

function showRegistrationSection() {
    const regSection = document.getElementById('registrationSection');
    const votingSection = document.getElementById('votingSection');
    if (regSection) regSection.style.display = 'block';
    if (votingSection) votingSection.style.display = 'none';
}

function showVotingSection() {
    const regSection = document.getElementById('registrationSection');
    const votingSection = document.getElementById('votingSection');
    if (regSection) regSection.style.display = 'none';
    if (votingSection) votingSection.style.display = 'block';
    
    if (currentUser) {
        const userNameDisplay = document.getElementById('userNameDisplay');
        if (userNameDisplay) userNameDisplay.textContent = currentUser.name;
    }
    
    renderNominations();
    setupModal();
    updateStats();
}

function registerUser() {
    const userNameInput = document.getElementById('userName');
    const userEmailInput = document.getElementById('userEmail');
    
    if (!userNameInput || !userEmailInput) return;
    
    const userName = userNameInput.value.trim();
    const userEmail = userEmailInput.value.trim();
    
    if (!userName || !userEmail) {
        showNotification('Пожалуйста, заполните все поля', 'error');
        return;
    }
    
    if (!validateForm()) {
        showNotification('Пожалуйста, исправьте ошибки в форме', 'error');
        return;
    }
    
    currentUser = {
        name: userName,
        email: userEmail,
        id: Date.now().toString(),
        registeredAt: new Date().toISOString()
    };
    
    const allUsers = getAllUsers();
    allUsers[currentUser.id] = {
        name: currentUser.name,
        email: currentUser.email,
        registeredAt: currentUser.registeredAt
    };
    saveAllUsers(allUsers);
    
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    
    showVotingSection();
    showNotification(`Добро пожаловать, ${userName}! Приятного голосования!`, 'success');
}

function renderNominations() {
    const mainContainer = document.getElementById('mainNominationsContainer');
    const otherContainer = document.getElementById('otherNominationsContainer');
    
    if (!mainContainer || !otherContainer) return;
    
    mainContainer.innerHTML = '';
    otherContainer.innerHTML = '';

    nominations.filter(n => n.isMain).forEach(nomination => {
        const card = createNominationCard(nomination);
        mainContainer.appendChild(card);
    });
    
    nominations.filter(n => !n.isMain).forEach(nomination => {
        const card = createNominationCard(nomination);
        otherContainer.appendChild(card);
    });
}

function createNominationCard(nomination) {
    const card = document.createElement('div');
    card.className = `nomination-card ${nomination.isMain ? 'main-card' : ''}`;
    
    if (nomination.gender === 'male') card.classList.add('male-nomination');
    else if (nomination.gender === 'female') card.classList.add('female-nomination');
    
    const allVotes = getAllVotes();
    const userVotes = allVotes[currentUser?.id] || {};
    const selectedStudent = userVotes[nomination.id];
    
    card.innerHTML = `
        <h3>${nomination.title}</h3>
        <p>${nomination.description}</p>
        <div class="selected-student" id="selected-${nomination.id}" 
             style="${selectedStudent ? 'display: flex' : 'display: none'}">
            <span id="selected-name-${nomination.id}">${selectedStudent || ''}</span>
        </div>
        <button class="vote-button nomination-vote-btn" onclick="openStudentSelection('${nomination.id}')">
            <span class="btn-text">${selectedStudent ? 'Изменить выбор' : 'Выбрать студента'}</span>
            <span class="btn-arrow">→</span>
        </button>
    `;
    
    return card;
}

function setupModal() {
    const modal = document.getElementById('studentModal');
    const closeBtn = document.querySelector('#studentModal .close');
    const confirmBtn = document.getElementById('confirmSelection');

    if (closeBtn) {
        closeBtn.onclick = () => {
            if (modal) modal.style.display = 'none';
            currentNomination = null;
        };
    }
    
    if (confirmBtn) confirmBtn.onclick = confirmSelection;

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            currentNomination = null;
        }
    };
}

function openStudentSelection(nominationId) {
    currentNomination = nominationId;
    const modal = document.getElementById('studentModal');
    const modalTitle = document.getElementById('modalTitle');
    const studentsGrid = document.getElementById('studentsGrid');
    const confirmBtn = document.getElementById('confirmSelection');

    if (!modal || !modalTitle || !studentsGrid || !confirmBtn) return;

    const nomination = nominations.find(n => n.id === nominationId);
    if (nomination) modalTitle.textContent = nomination.title;
    
    studentsGrid.innerHTML = '';

    const allVotes = getAllVotes();
    const userVotes = allVotes[currentUser?.id] || {};
    const currentSelection = userVotes[nominationId];

    const filteredStudents = nomination.gender ? 
        students.filter(student => student.gender === nomination.gender) : 
        students;

    filteredStudents.forEach((student) => {
        const studentCard = document.createElement('div');
        studentCard.className = `student-card ${student.gender}`;
        
        if (currentSelection === student.name) studentCard.classList.add('selected');
        
        const photoDiv = document.createElement('div');
        photoDiv.className = 'student-photo';
        
        const img = document.createElement('img');
        img.src = student.photo;
        img.alt = student.name;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.borderRadius = '50%';
        img.style.objectFit = 'cover';
        
        img.onerror = function() {
            console.log(`Ошибка загрузки фото: ${student.photo}`);
            img.style.display = 'none';
            showInitials(photoDiv, student);
        };
        
        img.onload = function() {
            console.log(`Фото загружено: ${student.photo}`);
            photoDiv.classList.add('has-image');
        };
        
        photoDiv.appendChild(img);
        
        showInitials(photoDiv, student);

        studentCard.innerHTML = `<div class="student-name">${student.name}</div>`;
        studentCard.insertBefore(photoDiv, studentCard.firstChild);
        studentCard.onclick = () => selectStudent(student.name, studentCard);
        studentsGrid.appendChild(studentCard);
    });

    confirmBtn.disabled = !currentSelection;
    modal.style.display = 'block';
}

function showInitials(photoDiv, student) {
    const initials = student.name.split(' ').map(n => n[0]).join('');
    const initialsSpan = document.createElement('span');
    initialsSpan.textContent = initials;
    initialsSpan.style.cssText = `
        font-weight: 600;
        font-size: 1.2em;
        color: #fff8f0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    `;
    
    photoDiv.appendChild(initialsSpan);
    
    if (student.gender === 'female') {
        photoDiv.style.background = 'linear-gradient(135deg, #ff6b9d, #c2185b)';
    } else {
        photoDiv.style.background = 'linear-gradient(135deg, #4fc3f7, #1565c0)';
    }
}

function selectStudent(studentName, cardElement) {
    const studentsGrid = document.getElementById('studentsGrid');
    const confirmBtn = document.getElementById('confirmSelection');
    
    if (!studentsGrid || !confirmBtn) return;
    
    Array.from(studentsGrid.children).forEach(card => card.classList.remove('selected'));
    cardElement.classList.add('selected');
    confirmBtn.disabled = false;

    cardElement.style.transform = 'scale(0.95)';
    setTimeout(() => cardElement.style.transform = 'scale(1.05)', 150);
}

function confirmSelection() {
    if (!currentNomination || !currentUser) return;
    
    const selectedCard = document.querySelector('#studentModal .student-card.selected');
    if (!selectedCard) return;
    
    const studentNameElement = selectedCard.querySelector('.student-name');
    if (!studentNameElement) return;
    
    const studentName = studentNameElement.textContent;
    
    saveVoteToFirebase(currentNomination, studentName);
    updateNominationDisplay(currentNomination, studentName);
    updateStats();
    
    showNotification(`Вы выбрали: ${studentName}`, 'success');
    
    const modal = document.getElementById('studentModal');
    if (modal) modal.style.display = 'none';
    currentNomination = null;
}

function updateNominationDisplay(nominationId, studentName) {
    const selectedDiv = document.getElementById(`selected-${nominationId}`);
    const selectedName = document.getElementById(`selected-name-${nominationId}`);
    const buttons = document.querySelectorAll(`.nomination-vote-btn[onclick="openStudentSelection('${nominationId}')"]`);
    
    if (selectedDiv && selectedName) {
        selectedName.textContent = studentName;
        selectedDiv.style.display = 'flex';
    }
    
    buttons.forEach(button => {
        const btnText = button.querySelector('.btn-text');
        if (btnText) btnText.textContent = 'Изменить выбор';
    });
}

// ==================== АДМИН-ФУНКЦИИ ====================

function showPasswordModal() {
    const modal = document.getElementById('passwordModal');
    const passwordInput = document.getElementById('adminPassword');
    
    if (modal) {
        modal.style.display = 'block';
        if (passwordInput) {
            passwordInput.value = '';
            setTimeout(() => passwordInput.focus(), 100);
        }
    }
}

function closePasswordModal() {
    const modal = document.getElementById('passwordModal');
    if (modal) modal.style.display = 'none';
}

function checkAdminPassword() {
    const passwordInput = document.getElementById('adminPassword');
    if (!passwordInput) return;
    
    const password = passwordInput.value;
    if (password === ADMIN_PASSWORD) {
        closePasswordModal();
        showAdminPanel();
        showNotification('Доступ разрешен!', 'success');
    } else {
        showNotification('Неверный пароль!', 'error');
        passwordInput.value = '';
        passwordInput.focus();
    }
}

function showAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    if (adminPanel) adminPanel.style.display = 'block';
}

function hideAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    if (adminPanel) adminPanel.style.display = 'none';
}

// ПЛАШКА 1: Результаты голосования
async function showLiveResults() {
    const modal = document.getElementById('resultsModal');
    const resultsGrid = document.getElementById('resultsGrid');
    const resultsTitle = document.getElementById('resultsTitle');
    
    if (!modal || !resultsGrid || !resultsTitle) return;
    
    resultsTitle.textContent = '📊 РЕЗУЛЬТАТЫ ГОЛОСОВАНИЯ';
    resultsGrid.innerHTML = '<div class="loading">Загрузка данных...</div>';
    
    modal.style.display = 'block';
    hideAdminPanel();
    
    try {
        const votes = await getDetailedVotesFromFirebase();
        const results = calculateResults(votes);
        
        let html = `
            <div class="results-stats" style="text-align: center; margin-bottom: 20px; font-size: 1.1em;">
                <strong>Всего проголосовало: ${getUniqueVotersCount(votes)} человек</strong><br>
                <strong>Всего голосов: ${votes.length}</strong>
            </div>
        `;
        
        nominations.forEach(nomination => {
            const nominationResults = results[nomination.id] || {};
            const totalVotes = Object.values(nominationResults).reduce((sum, count) => sum + count, 0);
            
            html += `
                <div class="result-item">
                    <h4>${nomination.title}</h4>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${totalVotes > 0 ? '100%' : '0%'}"></div>
                    </div>
                    <div class="results-stats">Всего голосов: ${totalVotes}</div>
                    <ul class="result-list">
            `;
            
            if (totalVotes > 0) {
                const sortedResults = Object.entries(nominationResults)
                    .sort(([,a], [,b]) => b - a);
                
                sortedResults.forEach(([student, votes], index) => {
                    const percentage = totalVotes > 0 ? (votes / totalVotes * 100).toFixed(1) : 0;
                    const isLeading = index === 0 && votes > 0;
                    html += `
                        <li class="${isLeading ? 'leading' : ''}">
                            <span class="student-result-name">${student}</span>
                            <div class="result-details">
                                <span style="margin-right: 10px; color: #fff8f0;">${percentage}%</span>
                                <span class="vote-count">${votes} гол.</span>
                            </div>
                        </li>
                    `;
                });
            } else {
                html += '<li class="no-votes">Голосов пока нет</li>';
            }
            
            html += '</ul></div>';
        });
        
        resultsGrid.innerHTML = html;
        
    } catch (error) {
        resultsGrid.innerHTML = '<div class="error">Ошибка загрузки результатов</div>';
        console.error('Ошибка:', error);
    }
}

// ПЛАШКА 2: Все проголосовавшие
async function showAllVoters() {
    const modal = document.getElementById('resultsModal');
    const resultsGrid = document.getElementById('resultsGrid');
    const resultsTitle = document.getElementById('resultsTitle');
    
    if (!modal || !resultsGrid || !resultsTitle) return;
    
    resultsTitle.textContent = '👥 ВСЕ ПРОГОЛОСОВАВШИЕ';
    resultsGrid.innerHTML = '<div class="loading">Загрузка данных...</div>';
    
    modal.style.display = 'block';
    hideAdminPanel();
    
    try {
        const votes = await getDetailedVotesFromFirebase();
        const voters = groupVotesByUser(votes);
        
        let html = `
            <div class="results-stats" style="text-align: center; margin-bottom: 20px; font-size: 1.1em;">
                <strong>Всего проголосовало: ${voters.length} человек</strong>
            </div>
        `;
        
        if (voters.length === 0) {
            html += '<div class="no-votes" style="text-align: center;">Пока никто не проголосовал</div>';
        } else {
            voters.forEach((voter, index) => {
                html += `
                    <div class="result-item">
                        <h4>${index + 1}. ${voter.userName}</h4>
                        <div class="results-stats">
                            Email: ${voter.userEmail}<br>
                            Проголосовал в ${Object.keys(voter.votes).length} номинациях
                        </div>
                        <ul class="result-list">
                `;
                
                Object.entries(voter.votes).forEach(([nominationId, studentName]) => {
                    const nomination = nominations.find(n => n.id === nominationId);
                    html += `
                        <li>
                            <span class="student-result-name">${nomination?.title || nominationId}</span>
                            <div class="result-details">
                                <span style="color: #fff8f0;">→ ${studentName}</span>
                            </div>
                        </li>
                    `;
                });
                
                html += '</ul></div>';
            });
        }
        
        resultsGrid.innerHTML = html;
        
    } catch (error) {
        resultsGrid.innerHTML = '<div class="error">Ошибка загрузки данных</div>';
        console.error('Ошибка:', error);
    }
}

// Вспомогательные функции для админки
function calculateResults(votes) {
    const results = {};
    
    nominations.forEach(nomination => {
        results[nomination.id] = {};
    });
    
    votes.forEach(vote => {
        if (vote.studentName && results[vote.nominationId]) {
            if (!results[vote.nominationId][vote.studentName]) {
                results[vote.nominationId][vote.studentName] = 0;
            }
            results[vote.nominationId][vote.studentName]++;
        }
    });
    
    return results;
}

function getUniqueVotersCount(votes) {
    const uniqueUserIds = new Set(votes.map(vote => vote.userId));
    return uniqueUserIds.size;
}

function groupVotesByUser(votes) {
    const users = {};
    
    votes.forEach(vote => {
        if (!users[vote.userId]) {
            users[vote.userId] = {
                userName: vote.userName,
                userEmail: vote.userEmail,
                userId: vote.userId,
                votes: {}
            };
        }
        users[vote.userId].votes[vote.nominationId] = vote.studentName;
    });
    
    return Object.values(users).sort((a, b) => a.userName.localeCompare(b.userName));
}

function closeResults() {
    const modal = document.getElementById('resultsModal');
    if (modal) modal.style.display = 'none';
}

async function exportData() {
    try {
        const votes = await getDetailedVotesFromFirebase();
        const results = calculateResults(votes);
        
        let csvContent = "Номинация,Студент,Количество голосов,Процент\n";
        
        nominations.forEach(nomination => {
            const nominationResults = results[nomination.id] || {};
            const totalVotes = Object.values(nominationResults).reduce((sum, count) => sum + count, 0);
            
            Object.entries(nominationResults)
                .sort(([,a], [,b]) => b - a)
                .forEach(([student, votes]) => {
                    const percentage = totalVotes > 0 ? (votes / totalVotes * 100).toFixed(2) : 0;
                    csvContent += `"${nomination.title}","${student}",${votes},${percentage}%\n`;
                });
        });
        
        csvContent += "\n\nДетали голосования:\nПользователь,Email,Номинация,Выбранный студент,Время\n";
        
        votes.forEach(vote => {
            const nomination = nominations.find(n => n.id === vote.nominationId);
            const time = vote.timestamp ? new Date(vote.timestamp.seconds * 1000).toLocaleString('ru-RU') : 'N/A';
            csvContent += `"${vote.userName}","${vote.userEmail}","${nomination?.title || vote.nominationId}","${vote.studentName}","${time}"\n`;
        });
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `результаты_премии_исп_${new Date().toLocaleDateString('ru-RU')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('Данные экспортированы в CSV!', 'success');
        hideAdminPanel();
    } catch (error) {
        showNotification('Ошибка экспорта данных', 'error');
        console.error('Ошибка экспорта:', error);
    }
}

function resetVoting() {
    if (confirm('ВНИМАНИЕ! Это действие сбросит ВСЕ данные голосования. Продолжить?')) {
        const currentUserBackup = localStorage.getItem(CURRENT_USER_KEY);
        
        localStorage.removeItem(ALL_VOTES_KEY);
        
        if (currentUserBackup) {
            localStorage.setItem(CURRENT_USER_KEY, currentUserBackup);
            currentUser = JSON.parse(currentUserBackup);
        }
        
        showNotification('Локальные данные сброшены!', 'success');
        setTimeout(() => {
            renderNominations();
            updateStats();
        }, 1000);
    }
}

function updateStats() {
    if (!currentUser) return;
    
    const allVotes = getAllVotes();
    const userVotes = allVotes[currentUser.id] || {};
    const completedNominations = Object.values(userVotes).filter(v => v).length;
    
    const completedElement = document.getElementById('completedNominations');
    const totalVotesElement = document.getElementById('totalVotes');
    
    if (completedElement) completedElement.textContent = `${completedNominations}/${nominations.length}`;
    
    // Подсчет общего количества голосов
    let totalVotesCount = 0;
    Object.values(allVotes).forEach(userVotes => {
        totalVotesCount += Object.values(userVotes).filter(v => v).length;
    });
    
    if (totalVotesElement) totalVotesElement.textContent = totalVotesCount;
}

function showNotification(message, type = 'info') {
    const oldNotifications = document.querySelectorAll('.notification');
    oldNotifications.forEach(notif => notif.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: #fff8f0;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.4s ease;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        border: 2px solid rgba(146, 20, 12, 0.7);
        font-size: 1em;
        max-width: 300px;
        ${type === 'success' ? 'background: linear-gradient(135deg, #1e1e24, rgba(40, 167, 69, 0.8));' : ''}
        ${type === 'error' ? 'background: linear-gradient(135deg, #1e1e24, rgba(220, 53, 69, 0.8));' : ''}
        ${type === 'info' ? 'background: linear-gradient(135deg, #1e1e24, rgba(146, 20, 12, 0.8));' : ''}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

function logout() {
    if (confirm('Вы уверены, что хотите выйти? Вы сможете зарегистрироваться снова.')) {
        localStorage.removeItem(CURRENT_USER_KEY);
        currentUser = null;
        showRegistrationSection();
        showNotification('Вы вышли из системы', 'info');
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Запускаем приложение с Firebase...');
    
    const registerButton = document.querySelector('.login-button');
    if (registerButton) registerButton.onclick = registerUser;
    
    initApp();
});

// Глобальные функции для HTML
window.registerUser = registerUser;
window.openStudentSelection = openStudentSelection;
window.showPasswordModal = showPasswordModal;
window.closePasswordModal = closePasswordModal;
window.checkAdminPassword = checkAdminPassword;
window.hideAdminPanel = hideAdminPanel;
window.showLiveResults = showLiveResults;
window.showAllVoters = showAllVoters;
window.closeResults = closeResults;
window.exportData = exportData;
window.resetVoting = resetVoting;
window.logout = logout;