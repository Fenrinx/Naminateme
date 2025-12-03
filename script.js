// ============================================
// АНТИПРЕМИЯ "ТАК СЕБЕ ДОСТИЖЕНИЯ"
// С ФИКСАМИ ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ
// ============================================

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

// Данные студентов
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

// Номинации
const nominations = [
    {
        id: "best_male",
        title: "Лучший парень группы",
        description: "Тот, кто всегда поддержит в трудную минуту, поможет с учебой и создаст дружескую атмосферу. Настоящий лидер и надежный товарищ.",
        isMain: true,
        gender: "male"
    },
    {
        id: "best_female", 
        title: "Лучшая девушка группы",
        description: "Самая отзывчивая, ответственная и душевная. Всегда готова помочь, поддержать и зарядить позитивом всю группу.", 
        isMain: true,
        gender: "female"
    },
    {
        id: "alternative_reality",
        title: "Мастер альтернативной реальности",
        description: "Живет по собственному расписанию и календарю. Для него каждый день может быть пятницей, а дедлайн — понятие растяжимое.",
        isMain: false
    },
    {
        id: "group_meme", 
        title: "Мем группы",
        description: "Его фразы и поступки моментально становятся легендами. Одно его слово — и в чате новый мем на неделю.",
        isMain: false
    },
    {
        id: "group_diplomat",
        title: "Дипломат группы", 
        description: "Умеет договориться с любым преподавателем. Для него сессия — просто временные трудности, а не конец света.",
        isMain: false
    },
    {
        id: "group_fashionista",
        title: "Модник группы",
        description: "Его стиль — это отдельный предмет для изучения. Даже в старой худи он выглядит как с обложки журнала.",
        isMain: false
    },
    {
        id: "group_invisible",
        title: "Невидимка группы",
        description: "Мастер стелс-технологий. Появляется только в самых критических ситуациях и моментально растворяется в пространстве.",
        isMain: false
    },
    {
        id: "excuse_wizard",
        title: "Колдун оправданий",
        description: "Его объяснения пропусков и невыполненных работ — это настоящее искусство. Даже строгий преподаватель поверит в историю про кота.",
        isMain: false
    },
    {
        id: "expulsion_candidate",
        title: "Кандидат на отчисление",
        description: "Человек, который, кажется, больше времени проводит в раздумьях 'а стоит ли идти на пары?', чем на самих парах. Главный специалист по поиску причин не учиться.",
        isMain: false
    },
    {
        id: "ptu_effect",
        title: "Эффект ПТУ",
        description: "Студент, который за время учебы претерпел такие метаморфозы, что теперь его не узнать. Из скромного тихони в душу компании, или наоборот. Эволюция личности в реальном времени!",
        isMain: false
    },
    {
        id: "quiet_of_the_year",
        title: "Тихоня года",
        description: "Человек, присутствие которого в группе было настолько незаметным, что многие только сейчас осознали: 'Так он/она с нами учится?' Мастер скрытного присутствия.",
        isMain: false
    }
];

// Глобальные переменные
let currentNomination = null;
let currentUser = null;
const ADMIN_PASSWORD = "TrapMan8@";

// Ключи для localStorage
const ALL_VOTES_KEY = "antipremia_isp_2024_all_votes";
const ALL_USERS_KEY = "antipremia_isp_2024_all_users";
const CURRENT_USER_KEY = "antipremia_isp_2024_current_user";
const BROWSER_FINGERPRINT_KEY = "antipremia_isp_2024_browser_fingerprint";

// Определяем тип устройства
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);

// Флаги для мобильных
let mobileSelectedStudent = null;
let mobileCurrentNomination = null;
let isProcessing = false; // Защита от множественных нажатий

// ============================================
// ФУНКЦИИ ДЛЯ РАБОТЫ С ХРАНИЛИЩЕМ
// ============================================

function generateBrowserFingerprint() {
    let fingerprint = '';
    fingerprint += navigator.userAgent;
    fingerprint += navigator.language;
    fingerprint += screen.colorDepth;
    fingerprint += (screen.height || '') + (screen.width || '');
    return btoa(fingerprint).substring(0, 32);
}

function checkExistingVote() {
    const fingerprint = localStorage.getItem(BROWSER_FINGERPRINT_KEY);
    if (!fingerprint) return null;
    const allUsers = getAllUsers();
    return Object.values(allUsers).find(user => user.browserFingerprint === fingerprint);
}

function saveBrowserFingerprint() {
    const fingerprint = generateBrowserFingerprint();
    localStorage.setItem(BROWSER_FINGERPRINT_KEY, fingerprint);
    return fingerprint;
}

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
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            browserFingerprint: currentUser.browserFingerprint
        };

        await db.collection('votes').add(voteData);
        saveToLocalStorage(currentUser.id, nominationId, studentName);
        
        showNotification('✓ Голос сохранен!', 'success');
        return true;
        
    } catch (error) {
        saveToLocalStorage(currentUser.id, nominationId, studentName);
        showNotification('✓ Голос сохранен локально', 'info');
        return true;
    }
}

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

// ============================================
// ВИЗУАЛЬНЫЕ ЭФФЕКТЫ
// ============================================

function createSnowflakes() {
    const container = document.getElementById('snowflakes-container');
    if (!container) return;
    
    const count = isMobile ? 20 : 35;
    
    for (let i = 0; i < count; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        
        const symbols = ['*', '+', '·', '•'];
        snowflake.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        
        snowflake.style.left = Math.random() * 100 + 'vw';
        
        const duration = isMobile ? 
            (Math.random() * 6 + 8) + 's' :
            (Math.random() * 4 + 6) + 's';
            
        snowflake.style.animationDuration = duration;
        
        snowflake.style.opacity = Math.random() * 0.6 + 0.3;
        
        const size = isMobile ? 
            (Math.random() * 2 + 8) + 'px' :
            (Math.random() * 5 + 12) + 'px';
        snowflake.style.fontSize = size;
        
        snowflake.style.animationDelay = Math.random() * 2 + 's';
        
        const colors = [
            'rgba(255, 255, 255, 0.9)',
            'rgba(168, 155, 220, 0.9)',
            'rgba(94, 53, 177, 0.9)',
            'rgba(66, 165, 245, 0.9)',
            'rgba(255, 255, 255, 0.8)'
        ];
        snowflake.style.color = colors[Math.floor(Math.random() * colors.length)];
        
        container.appendChild(snowflake);
        
        const removeTime = parseFloat(duration) * 1000 + 2000;
        setTimeout(() => {
            if (snowflake.parentNode === container) {
                container.removeChild(snowflake);
            }
        }, removeTime);
    }
}

function createGarlands() {
    createGarlandBalls('.garland-balls', isMobile ? 8 : 12);
}

function createGarlandBalls(selector, count) {
    const containers = document.querySelectorAll(selector);
    containers.forEach(container => {
        container.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const ball = document.createElement('div');
            ball.className = 'ball';
            ball.style.setProperty('--i', i);
            container.appendChild(ball);
        }
    });
}

// ============================================
// ОСНОВНЫЕ ФУНКЦИИ ПРИЛОЖЕНИЯ
// ============================================

// ВАЖНО: Простая функция для регистрации
function registerUser() {
    if (isProcessing) return;
    isProcessing = true;
    
    // Визуальная обратная связь
    const button = document.querySelector('.login-button');
    if (button) {
        button.style.transform = 'scale(0.95)';
        button.style.opacity = '0.8';
    }
    
    const userName = document.getElementById('userName')?.value?.trim() || '';
    const userEmail = document.getElementById('userEmail')?.value?.trim() || '';
    
    if (!userName || !userEmail) {
        showNotification('Заполните все поля', 'error');
        isProcessing = false;
        if (button) {
            button.style.transform = '';
            button.style.opacity = '';
        }
        return;
    }
    
    // Проверка имени (минимум 2 слова)
    if (userName.split(' ').filter(w => w.length > 1).length < 2) {
        showNotification('Введите полное ФИО', 'error');
        isProcessing = false;
        if (button) {
            button.style.transform = '';
            button.style.opacity = '';
        }
        return;
    }
    
    // Простая проверка email
    if (!userEmail.includes('@') || !userEmail.includes('.')) {
        showNotification('Введите корректный email', 'error');
        isProcessing = false;
        if (button) {
            button.style.transform = '';
            button.style.opacity = '';
        }
        return;
    }
    
    // Проверяем, не голосовал ли уже пользователь
    const existingVoter = checkExistingVote();
    if (existingVoter) {
        showNotification(`Вы уже голосовали как: ${existingVoter.name}`, 'error');
        isProcessing = false;
        if (button) {
            button.style.transform = '';
            button.style.opacity = '';
        }
        return;
    }
    
    // Сохраняем отпечаток браузера
    const browserFingerprint = saveBrowserFingerprint();
    
    // Создаем пользователя
    currentUser = {
        name: userName,
        email: userEmail,
        id: Date.now().toString(),
        registeredAt: new Date().toISOString(),
        browserFingerprint: browserFingerprint
    };
    
    // Сохраняем в localStorage
    const allUsers = getAllUsers();
    allUsers[currentUser.id] = {
        name: currentUser.name,
        email: currentUser.email,
        registeredAt: currentUser.registeredAt,
        browserFingerprint: currentUser.browserFingerprint
    };
    saveAllUsers(allUsers);
    
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    
    // Показываем секцию голосования
    showVotingSection();
    showNotification(`Добро пожаловать, ${userName}!`, 'success');
    
    // Восстанавливаем кнопку
    setTimeout(() => {
        isProcessing = false;
        if (button) {
            button.style.transform = '';
            button.style.opacity = '';
        }
    }, 1000);
}

// Показываем секцию голосования
function showVotingSection() {
    const regSection = document.getElementById('registrationSection');
    const votingSection = document.getElementById('votingSection');
    
    if (regSection) regSection.style.display = 'none';
    if (votingSection) {
        votingSection.style.display = 'block';
        
        // Прокручиваем наверх на мобильных
        if (isMobile) {
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 100);
        }
        
        // Рендерим номинации
        renderNominations();
    }
}

// Рендерим номинации
function renderNominations() {
    const mainContainer = document.getElementById('mainNominationsContainer');
    const otherContainer = document.getElementById('otherNominationsContainer');
    
    if (!mainContainer || !otherContainer) return;
    
    mainContainer.innerHTML = '';
    otherContainer.innerHTML = '';
    
    // Главные номинации
    nominations.filter(n => n.isMain).forEach(nomination => {
        const card = createNominationCard(nomination);
        mainContainer.appendChild(card);
    });
    
    // Антиноминации
    nominations.filter(n => !n.isMain).forEach(nomination => {
        const card = createNominationCard(nomination);
        otherContainer.appendChild(card);
    });
    
    // Настраиваем обработчики для кнопок
    setTimeout(() => {
        setupVoteButtons();
    }, 100);
}

// Создаем карточку номинации
function createNominationCard(nomination) {
    const card = document.createElement('div');
    
    // Определяем класс в зависимости от типа номинации
    if (nomination.isMain) {
        if (nomination.gender === 'male') {
            card.className = 'nomination-card male-card';
        } else {
            card.className = 'nomination-card female-card';
        }
    } else {
        card.className = 'nomination-card other-card';
    }
    
    // Проверяем, есть ли уже выбранный студент
    const allVotes = getAllVotes();
    const userVotes = allVotes[currentUser?.id] || {};
    const selectedStudent = userVotes[nomination.id];
    
    // Обрезаем описание для мобильных
    let description = nomination.description;
    if (isMobile && description.length > 80) {
        description = description.substring(0, 80) + '...';
    }
    
    // Создаем HTML
    card.innerHTML = `
        <h3>${nomination.title}</h3>
        <p>${description}</p>
        <div class="selected-student" id="selected-${nomination.id}" 
             style="${selectedStudent ? 'display: flex' : 'display: none'}">
            <span id="selected-name-${nomination.id}">${selectedStudent || ''}</span>
        </div>
        <button class="vote-button" data-nomination="${nomination.id}">
            <span class="button-text">${selectedStudent ? 'Изменить выбор' : 'Выбрать студента'}</span>
            <span class="button-arrow"></span>
        </button>
    `;
    
    return card;
}

// Настраиваем обработчики для кнопок голосования
function setupVoteButtons() {
    const voteButtons = document.querySelectorAll('.vote-button');
    
    voteButtons.forEach(button => {
        // Удаляем старые обработчики
        button.removeEventListener('click', handleVoteClick);
        button.removeEventListener('touchend', handleVoteTouch);
        
        // Добавляем новые
        button.addEventListener('click', handleVoteClick);
        button.addEventListener('touchend', handleVoteTouch);
    });
}

// Обработчик клика на кнопку голосования
function handleVoteClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (isProcessing) return;
    isProcessing = true;
    
    const button = e.currentTarget;
    const nominationId = button.getAttribute('data-nomination');
    
    if (!nominationId) {
        isProcessing = false;
        return;
    }
    
    // Визуальная обратная связь
    button.style.transform = 'scale(0.95)';
    button.style.opacity = '0.8';
    
    console.log('Opening selection for:', nominationId);
    
    // Открываем выбор студента
    setTimeout(() => {
        openStudentSelection(nominationId);
        button.style.transform = '';
        button.style.opacity = '';
        isProcessing = false;
    }, 150);
}

// Обработчик касания на кнопку голосования
function handleVoteTouch(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (isProcessing) return;
    isProcessing = true;
    
    const button = e.currentTarget;
    const nominationId = button.getAttribute('data-nomination');
    
    if (!nominationId) {
        isProcessing = false;
        return;
    }
    
    // Визуальная обратная связь для мобильных
    button.style.transform = 'scale(0.95)';
    button.style.opacity = '0.8';
    
    console.log('Touch: Opening selection for:', nominationId);
    
    // Открываем выбор студента с задержкой
    setTimeout(() => {
        openStudentSelection(nominationId);
        
        // Восстанавливаем кнопку
        setTimeout(() => {
            button.style.transform = '';
            button.style.opacity = '';
            isProcessing = false;
        }, 300);
    }, 100);
}

// Открываем выбор студента
function openStudentSelection(nominationId) {
    console.log('openStudentSelection called for:', nominationId);
    
    if (!nominationId || !currentUser) {
        showNotification('Ошибка: номинация не найдена', 'error');
        return;
    }
    
    currentNomination = nominationId;
    
    // На мобильных используем мобильное меню
    if (isMobile) {
        mobileCurrentNomination = nominationId;
        showMobileStudentList(nominationId);
    } else {
        // На десктопе используем модальное окно
        showDesktopStudentModal(nominationId);
    }
}

// Показываем модальное окно на десктопе
function showDesktopStudentModal(nominationId) {
    const modal = document.getElementById('studentModal');
    const modalTitle = document.getElementById('modalTitle');
    const studentsGrid = document.getElementById('studentsGrid');
    const confirmBtn = document.getElementById('confirmSelection');
    
    if (!modal || !modalTitle || !studentsGrid || !confirmBtn) return;
    
    // Находим номинацию
    const nomination = nominations.find(n => n.id === nominationId);
    if (nomination) {
        modalTitle.textContent = nomination.title;
    }
    
    // Очищаем контейнер
    studentsGrid.innerHTML = '';
    
    // Получаем текущий выбор пользователя
    const allVotes = getAllVotes();
    const userVotes = allVotes[currentUser?.id] || {};
    const currentSelection = userVotes[nominationId];
    
    // Фильтруем студентов по полу (если нужно)
    let filteredStudents;
    if (nomination.gender) {
        filteredStudents = students.filter(student => student.gender === nomination.gender);
    } else {
        filteredStudents = [...students].sort((a, b) => a.name.localeCompare(b.name));
    }
    
    // Создаем карточки студентов
    filteredStudents.forEach((student) => {
        const studentCard = document.createElement('div');
        studentCard.className = 'student-card';
        studentCard.dataset.studentName = student.name;
        
        // Если студент уже выбран, отмечаем его
        if (currentSelection === student.name) {
            studentCard.classList.add('selected');
        }
        
        // Создаем фото студента
        const photoContainer = document.createElement('div');
        photoContainer.className = 'student-photo';
        
        const img = document.createElement('img');
        img.alt = student.name;
        img.loading = 'lazy';
        
        // Пробуем загрузить фото
        const imgLoader = new Image();
        imgLoader.src = student.photo;
        imgLoader.onload = function() {
            img.src = student.photo;
        };
        imgLoader.onerror = function() {
            // Если фото не загрузилось, показываем инициалы
            img.style.display = 'none';
            photoContainer.style.background = student.gender === 'female' 
                ? 'linear-gradient(135deg, #ec407a, #ab47bc)'
                : 'linear-gradient(135deg, #42a5f5, #5e35b1)';
            
            const initials = document.createElement('div');
            initials.textContent = getInitials(student.name);
            initials.style.cssText = `
                color: white;
                font-size: 2em;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
            `;
            photoContainer.appendChild(initials);
        };
        
        photoContainer.appendChild(img);
        
        // Имя студента
        const nameDiv = document.createElement('div');
        nameDiv.className = 'student-name';
        nameDiv.textContent = student.name;
        
        // Собираем карточку
        studentCard.appendChild(photoContainer);
        studentCard.appendChild(nameDiv);
        
        // Обработчик клика
        studentCard.addEventListener('click', function() {
            selectStudent(student.name, studentCard);
        });
        
        studentsGrid.appendChild(studentCard);
    });
    
    // Настраиваем кнопку подтверждения
    confirmBtn.disabled = !currentSelection;
    
    // Показываем модальное окно
    modal.style.display = 'block';
    
    // Настраиваем закрытие
    setupModalClose(modal);
}

// Получаем инициалы имени
function getInitials(name) {
    return name.split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

// Выбираем студента
function selectStudent(studentName, cardElement) {
    console.log('Student selected:', studentName);
    
    const studentsGrid = document.getElementById('studentsGrid');
    const confirmBtn = document.getElementById('confirmSelection');
    
    if (!studentsGrid || !confirmBtn) return;
    
    // Снимаем выделение со всех карточек
    Array.from(studentsGrid.children).forEach(card => {
        card.classList.remove('selected');
    });
    
    // Выделяем выбранную карточку
    cardElement.classList.add('selected');
    
    // Активируем кнопку подтверждения
    confirmBtn.disabled = false;
}

// Подтверждаем выбор
function confirmSelection() {
    console.log('Confirming selection...');
    
    if (!currentNomination || !currentUser) {
        showNotification('Ошибка при выборе студента', 'error');
        return;
    }
    
    const selectedCard = document.querySelector('#studentModal .student-card.selected');
    if (!selectedCard) {
        showNotification('Выберите студента', 'error');
        return;
    }
    
    const studentName = selectedCard.dataset.studentName;
    if (!studentName) {
        showNotification('Ошибка: имя студента не найдено', 'error');
        return;
    }
    
    console.log('Saving vote for:', currentNomination, '->', studentName);
    
    // Сохраняем голос
    saveVoteToFirebase(currentNomination, studentName);
    
    // Обновляем отображение
    updateNominationDisplay(currentNomination, studentName);
    
    // Показываем уведомление
    showNotification(`Вы выбрали: ${studentName}`, 'success');
    
    // Закрываем модальное окно
    const modal = document.getElementById('studentModal');
    if (modal) modal.style.display = 'none';
    
    currentNomination = null;
}

// Обновляем отображение номинации
function updateNominationDisplay(nominationId, studentName) {
    const selectedDiv = document.getElementById(`selected-${nominationId}`);
    const selectedName = document.getElementById(`selected-name-${nominationId}`);
    const button = document.querySelector(`.vote-button[data-nomination="${nominationId}"]`);
    
    if (selectedDiv && selectedName) {
        selectedName.textContent = studentName;
        selectedDiv.style.display = 'flex';
    }
    
    if (button) {
        const buttonText = button.querySelector('.button-text');
        if (buttonText) {
            buttonText.textContent = 'Изменить выбор';
        }
    }
}

// Настраиваем закрытие модального окна
function setupModalClose(modal) {
    const closeBtn = modal.querySelector('.close');
    
    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = 'none';
            currentNomination = null;
        };
    }
    
    // Закрытие по клику на фон
    modal.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            currentNomination = null;
        }
    };
}

// ============================================
// МОБИЛЬНОЕ МЕНЮ ДЛЯ ВЫБОРА СТУДЕНТОВ
// ============================================

// Инициализация мобильного меню
function initMobileMenu() {
    // Создаем оверлей
    const overlay = document.createElement('div');
    overlay.id = 'mobileStudentOverlay';
    overlay.className = 'mobile-student-overlay';
    overlay.onclick = closeMobileStudentList;
    
    // Создаем меню
    const mobileMenu = document.createElement('div');
    mobileMenu.id = 'mobileStudentList';
    mobileMenu.className = 'mobile-student-list';
    
    // HTML меню
    mobileMenu.innerHTML = `
        <div class="mobile-student-header">
            <h3 class="mobile-student-title" id="mobileStudentTitle">Выберите студента</h3>
            <button class="mobile-close-btn" id="mobileCloseBtn">×</button>
        </div>
        <div class="mobile-students-container" id="mobileStudentsContainer"></div>
        <button id="mobileSelectBtn" class="mobile-select-btn" disabled>
            Подтвердить выбор
        </button>
    `;
    
    // Добавляем в DOM
    document.body.appendChild(overlay);
    document.body.appendChild(mobileMenu);
    
    // Настраиваем обработчики
    const closeBtn = document.getElementById('mobileCloseBtn');
    const selectBtn = document.getElementById('mobileSelectBtn');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMobileStudentList);
        closeBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            closeMobileStudentList();
        });
    }
    
    if (selectBtn) {
        selectBtn.addEventListener('click', confirmMobileSelection);
        selectBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            if (!this.disabled) {
                confirmMobileSelection();
            }
        });
    }
}

// Показываем мобильное меню
function showMobileStudentList(nominationId) {
    console.log('Showing mobile list for:', nominationId);
    
    const nomination = nominations.find(n => n.id === nominationId);
    if (!nomination) return;
    
    const overlay = document.getElementById('mobileStudentOverlay');
    const list = document.getElementById('mobileStudentList');
    const title = document.getElementById('mobileStudentTitle');
    const container = document.getElementById('mobileStudentsContainer');
    const selectBtn = document.getElementById('mobileSelectBtn');
    
    if (!overlay || !list || !title || !container || !selectBtn) return;
    
    // Устанавливаем заголовок
    title.textContent = nomination.title;
    
    // Очищаем контейнер
    container.innerHTML = '';
    mobileSelectedStudent = null;
    
    // Получаем текущий выбор пользователя
    const allVotes = getAllVotes();
    const userVotes = allVotes[currentUser?.id] || {};
    const currentSelection = userVotes[nominationId];
    
    // Фильтруем студентов
    let filteredStudents;
    if (nomination.gender) {
        filteredStudents = students.filter(student => student.gender === nomination.gender);
    } else {
        filteredStudents = [...students].sort((a, b) => a.name.localeCompare(b.name));
    }
    
    // Создаем элементы списка
    filteredStudents.forEach((student) => {
        const listItem = document.createElement('div');
        listItem.className = 'mobile-student-item';
        listItem.dataset.studentName = student.name;
        
        // Если студент уже выбран, отмечаем его
        if (currentSelection === student.name) {
            listItem.classList.add('selected');
            mobileSelectedStudent = student.name;
        }
        
        // Фото студента
        const photoContainer = document.createElement('div');
        photoContainer.className = 'mobile-student-photo';
        
        const img = document.createElement('img');
        img.alt = student.name;
        img.loading = 'lazy';
        
        // Пробуем загрузить фото
        const imgLoader = new Image();
        imgLoader.src = student.photo;
        imgLoader.onload = function() {
            img.src = student.photo;
        };
        imgLoader.onerror = function() {
            // Если фото не загрузилось, показываем инициалы
            const placeholder = document.createElement('div');
            placeholder.className = 'mobile-photo-placeholder';
            placeholder.textContent = getInitials(student.name);
            photoContainer.innerHTML = '';
            photoContainer.appendChild(placeholder);
        };
        
        photoContainer.appendChild(img);
        
        // Информация о студенте
        const infoDiv = document.createElement('div');
        infoDiv.className = 'mobile-student-info';
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'mobile-student-name';
        nameDiv.textContent = student.name;
        
        const genderDiv = document.createElement('div');
        genderDiv.className = 'mobile-student-gender';
        genderDiv.textContent = student.gender === 'female' ? 'Девушка' : 'Парень';
        
        infoDiv.appendChild(nameDiv);
        infoDiv.appendChild(genderDiv);
        
        // Собираем элемент
        listItem.appendChild(photoContainer);
        listItem.appendChild(infoDiv);
        
        // Обработчики для выбора
        listItem.addEventListener('click', function() {
            selectMobileStudent(student.name, listItem);
        });
        
        listItem.addEventListener('touchend', function(e) {
            e.preventDefault();
            selectMobileStudent(student.name, listItem);
        });
        
        container.appendChild(listItem);
    });
    
    // Настраиваем кнопку подтверждения
    selectBtn.disabled = !mobileSelectedStudent;
    
    // Показываем меню
    overlay.classList.add('active');
    list.classList.add('active');
    
    // Блокируем скролл страницы
    document.body.style.overflow = 'hidden';
}

// Выбираем студента в мобильном меню
function selectMobileStudent(studentName, listItem) {
    console.log('Mobile student selected:', studentName);
    
    const container = document.getElementById('mobileStudentsContainer');
    const selectBtn = document.getElementById('mobileSelectBtn');
    
    if (!container || !selectBtn) return;
    
    // Снимаем выделение со всех элементов
    container.querySelectorAll('.mobile-student-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Выделяем выбранный элемент
    listItem.classList.add('selected');
    mobileSelectedStudent = studentName;
    
    // Активируем кнопку подтверждения
    selectBtn.disabled = false;
    
    // Вибрация (если поддерживается)
    if (navigator.vibrate) {
        navigator.vibrate(30);
    }
}

// Подтверждаем выбор в мобильном меню
function confirmMobileSelection() {
    console.log('Confirming mobile selection...');
    
    if (!mobileSelectedStudent || !mobileCurrentNomination || !currentUser) {
        showNotification('Ошибка при выборе студента', 'error');
        return;
    }
    
    console.log('Saving mobile vote for:', mobileCurrentNomination, '->', mobileSelectedStudent);
    
    // Сохраняем голос
    saveVoteToFirebase(mobileCurrentNomination, mobileSelectedStudent);
    
    // Обновляем отображение
    updateNominationDisplay(mobileCurrentNomination, mobileSelectedStudent);
    
    // Показываем уведомление
    showNotification(`✓ Выбрали: ${mobileSelectedStudent}`, 'success');
    
    // Закрываем меню
    closeMobileStudentList();
}

// Закрываем мобильное меню
function closeMobileStudentList() {
    const overlay = document.getElementById('mobileStudentOverlay');
    const list = document.getElementById('mobileStudentList');
    
    if (overlay) overlay.classList.remove('active');
    if (list) list.classList.remove('active');
    
    // Восстанавливаем скролл страницы
    document.body.style.overflow = '';
    
    // Сбрасываем переменные
    mobileSelectedStudent = null;
    mobileCurrentNomination = null;
}

// ============================================
// УВЕДОМЛЕНИЯ
// ============================================

function showNotification(message, type = 'info') {
    // Удаляем старые уведомления
    const oldNotifications = document.querySelectorAll('.notification');
    oldNotifications.forEach(notif => notif.remove());
    
    // Создаем новое уведомление
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Стили
    notification.style.cssText = `
        position: fixed;
        ${isMobile ? 'top: 20px; left: 20px; right: 20px;' : 'top: 30px; right: 30px;'}
        padding: ${isMobile ? '15px' : '20px'};
        border-radius: 12px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        text-align: center;
        animation: slideIn 0.3s ease;
        backdrop-filter: blur(10px);
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        font-size: ${isMobile ? '14px' : '16px'};
    `;
    
    // Цвета в зависимости от типа
    if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #d32f2f, #b71c1c)';
        notification.style.border = '1px solid #ff5252';
    } else if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #388e3c, #1b5e20)';
        notification.style.border = '1px solid #69f0ae';
    } else {
        notification.style.background = 'linear-gradient(135deg, #5e35b1, #4527a0)';
        notification.style.border = '1px solid #a89bdc';
    }
    
    // Добавляем на страницу
    document.body.appendChild(notification);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Добавляем стили для анимаций уведомлений
if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateY(-50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            to {
                transform: translateY(-50px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// АДМИН-ПАНЕЛЬ
// ============================================

// Показываем модальное окно с паролем
function showPasswordModal() {
    const modal = document.getElementById('passwordModal');
    if (modal) {
        modal.style.display = 'block';
        
        // Фокус на поле ввода
        const passwordInput = document.getElementById('adminPassword');
        if (passwordInput) {
            setTimeout(() => passwordInput.focus(), 100);
        }
    }
}

// Закрываем модальное окно с паролем
function closePasswordModal() {
    const modal = document.getElementById('passwordModal');
    if (modal) modal.style.display = 'none';
}

// Проверяем пароль админа
function checkAdminPassword() {
    const passwordInput = document.getElementById('adminPassword');
    if (!passwordInput) return;
    
    const password = passwordInput.value;
    if (password === ADMIN_PASSWORD) {
        closePasswordModal();
        showAdminPanel();
        showNotification('✓ Доступ разрешен!', 'success');
    } else {
        showNotification('Неверный пароль!', 'error');
        passwordInput.value = '';
        passwordInput.focus();
    }
}

// Показываем админ-панель
function showAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    if (adminPanel) adminPanel.style.display = 'block';
}

// Скрываем админ-панель
function hideAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    if (adminPanel) adminPanel.style.display = 'none';
}

// ============================================
// ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
// ============================================

// Основная функция инициализации
function initApp() {
    console.log('Initializing app...');
    
    // Создаем снежинки и гирлянды
    createSnowflakes();
    createGarlands();
    
    // Интервал для снежинок
    setInterval(createSnowflakes, isMobile ? 2000 : 1200);
    
    // Инициализируем мобильное меню
    if (isMobile) {
        initMobileMenu();
    }
    
    // Проверяем, авторизован ли пользователь
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
    
    // Настраиваем обработчики для полей ввода
    setupInputHandlers();
    
    // Добавляем обработчики для iOS
    if (isIOS) {
        setupIOSHandlers();
    }
}

// Показываем секцию регистрации
function showRegistrationSection() {
    const regSection = document.getElementById('registrationSection');
    const votingSection = document.getElementById('votingSection');
    
    if (regSection) regSection.style.display = 'block';
    if (votingSection) votingSection.style.display = 'none';
}

// Настраиваем обработчики для полей ввода
function setupInputHandlers() {
    const userNameInput = document.getElementById('userName');
    const userEmailInput = document.getElementById('userEmail');
    
    if (userNameInput && userEmailInput) {
        // Отправка формы по Enter
        userNameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') registerUser();
        });
        
        userEmailInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') registerUser();
        });
        
        // Фокус на мобильных
        if (isMobile) {
            userNameInput.addEventListener('focus', function() {
                setTimeout(() => {
                    this.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            });
            
            userEmailInput.addEventListener('focus', function() {
                setTimeout(() => {
                    this.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            });
        }
    }
}

// Настраиваем обработчики для iOS
function setupIOSHandlers() {
    // Исправление 100vh для iOS
    const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    
    // Предотвращение зума при фокусе
    document.addEventListener('focusin', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            setTimeout(() => {
                e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        }
    });
}

// ============================================
// ЗАГРУЗКА ПРИЛОЖЕНИЯ
// ============================================

// Загружаем приложение когда DOM готов
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Экспортируем функции в глобальную область видимости
window.registerUser = registerUser;
window.openStudentSelection = openStudentSelection;
window.confirmSelection = confirmSelection;
window.showPasswordModal = showPasswordModal;
window.closePasswordModal = closePasswordModal;
window.checkAdminPassword = checkAdminPassword;
window.showAdminPanel = showAdminPanel;
window.hideAdminPanel = hideAdminPanel;
window.closeMobileStudentList = closeMobileStudentList;
window.confirmMobileSelection = confirmMobileSelection;

// Для отладки
console.log('App initialized successfully');
console.log('Mobile device:', isMobile);
console.log('iOS device:', isIOS);