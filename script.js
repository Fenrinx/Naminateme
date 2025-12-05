const firebaseConfig = {
  apiKey: "AIzaSyA7SFNUZTK85Iw40DdtFEZoGtk6ce4MzqI",
  authDomain: "naminateme.firebaseapp.com",
  projectId: "naminateme",
  storageBucket: "naminateme.firebasestorage.app",
  messagingSenderId: "249249124120",
  appId: "1:249249124120:web:a0a18d9fbc7ee3c54ed86d"
};

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

let currentNomination = null;
let currentUser = null;
const ADMIN_PASSWORD = "TrapMan8@";

const ALL_VOTES_KEY = "antipremia_isp_2024_all_votes";
const ALL_USERS_KEY = "antipremia_isp_2024_all_users";
const CURRENT_USER_KEY = "antipremia_isp_2024_current_user";
const BROWSER_FINGERPRINT_KEY = "antipremia_isp_2024_browser_fingerprint";

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

let selectedStudentName = null;
let selectedElement = null;

// Добавляем флаг для управления модальным окном
let isModalOpen = false;

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
        
        showNotification('Голос сохранен!', 'success');
        return true;
        
    } catch (error) {
        saveToLocalStorage(currentUser.id, nominationId, studentName);
        showNotification('Голос сохранен локально', 'info');
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
        
        snowflake.style.willChange = 'transform, opacity';
        
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
            
            ball.style.willChange = 'transform, box-shadow, opacity';
            
            container.appendChild(ball);
        }
    });
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

async function loadStudentPhotos() {
    console.log('Начинаю загрузку фотографий студентов...');
    
    const loadPromises = students.map(student => {
        return new Promise((resolve) => {
            const img = new Image();
            
            const tryPaths = [
                student.photo,
                student.photo.startsWith('photos/') ? student.photo : `photos/${student.photo}`,
                student.photo.startsWith('./photos/') ? student.photo : `./photos/${student.photo}`,
                student.photo.replace('photos/', 'images/')
            ];
            
            let currentTry = 0;
            
            function tryNextPath() {
                if (currentTry >= tryPaths.length) {
                    console.log('Не удалось загрузить фото для: ' + student.name);
                    student.photoLoaded = false;
                    resolve(null);
                    return;
                }
                
                img.src = tryPaths[currentTry];
                currentTry++;
                
                img.onload = function() {
                    console.log('Фото загружено: ' + student.name);
                    student.photo = img.src;
                    student.photoLoaded = true;
                    resolve(img);
                };
                
                img.onerror = tryNextPath;
            }
            
            tryNextPath();
        });
    });
    
    await Promise.allSettled(loadPromises);
    console.log('Загрузка фотографий завершена');
}

function initApp() {
    if (isMobile) {
        document.body.classList.add('mobile');
    }
    
    createSnowflakes();
    
    const snowflakeInterval = isMobile ? 2000 : 1200;
    setInterval(createSnowflakes, snowflakeInterval);
    
    createGarlands();
    
    const userNameInput = document.getElementById('userName');
    const userEmailInput = document.getElementById('userEmail');
    
    if (userNameInput && userEmailInput) {
        userNameInput.addEventListener('input', validateForm);
        userEmailInput.addEventListener('input', validateForm);
        
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
        
        userNameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') registerUser();
        });
        userEmailInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') registerUser();
        });
    }
    
    const existingVoter = checkExistingVote();
    if (existingVoter) {
        showNotification(`Вы уже голосовали как: ${existingVoter.name}`, 'error');
        const savedUser = localStorage.getItem(CURRENT_USER_KEY);
        if (savedUser) {
            try {
                currentUser = JSON.parse(savedUser);
                showVotingSection();
                return;
            } catch (e) {
                localStorage.removeItem(CURRENT_USER_KEY);
            }
        }
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
    
    loadStudentPhotos().catch(error => {
        console.log('Ошибка при загрузке фото: ', error);
    });
    
    // Улучшаем обработку касаний для мобильных устройств
    if (isTouchDevice) {
        document.addEventListener('touchstart', function(e) {
            // Разрешаем тач-события для модального окна
            if (isModalOpen && e.target.closest('.modal-content')) {
                return;
            }
        }, { passive: true });
        
        // Убираем блокировку масштабирования на мобильных
        document.addEventListener('touchmove', function(e) {
            // Разрешаем скролл в модальном окне
            if (isModalOpen && e.target.closest('.modal-content')) {
                return;
            }
        }, { passive: true });
    }
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
    
    renderNominations();
    
    if (isMobile) {
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    }
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
    
    const allUsers = getAllUsers();
    const existingUser = Object.values(allUsers).find(user => 
        user.email.toLowerCase() === userEmail.toLowerCase()
    );
    
    if (existingUser) {
        showNotification('Этот email уже зарегистрирован!', 'error');
        return;
    }
    
    const existingVoter = checkExistingVote();
    if (existingVoter) {
        showNotification(`Вы уже голосовали как: ${existingVoter.name}`, 'error');
        return;
    }
    
    const browserFingerprint = saveBrowserFingerprint();
    
    currentUser = {
        name: userName,
        email: userEmail,
        id: Date.now().toString(),
        registeredAt: new Date().toISOString(),
        browserFingerprint: browserFingerprint
    };
    
    allUsers[currentUser.id] = {
        name: currentUser.name,
        email: currentUser.email,
        registeredAt: currentUser.registeredAt,
        browserFingerprint: currentUser.browserFingerprint
    };
    saveAllUsers(allUsers);
    
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    
    showVotingSection();
    showNotification(`Добро пожаловать, ${userName}!`, 'success');
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
    if (nomination.isMain) {
        if (nomination.gender === 'male') {
            card.className = 'nomination-card male-card';
        } else {
            card.className = 'nomination-card female-card';
        }
    } else {
        card.className = 'nomination-card other-card';
    }
    
    const allVotes = getAllVotes();
    const userVotes = allVotes[currentUser?.id] || {};
    const selectedStudent = userVotes[nomination.id];
    
    let description = nomination.description;
    if (isMobile && description.length > 80) {
        description = description.substring(0, 80) + '...';
    }
    
    card.innerHTML = `
        <h3>${nomination.title}</h3>
        <p>${description}</p>
        <div class="selected-student" id="selected-${nomination.id}" 
             style="${selectedStudent ? 'display: flex' : 'display: none'}">
            <span id="selected-name-${nomination.id}">${selectedStudent || ''}</span>
        </div>
        <button class="vote-button" onclick="openStudentSelection('${nomination.id}')">
            <span class="button-text">${selectedStudent ? 'Изменить выбор' : 'Выбрать студента'}</span>
            <span class="button-arrow"></span>
        </button>
    `;
    
    return card;
}

function openStudentSelection(nominationId) {
    currentNomination = nominationId;
    selectedStudentName = null;
    selectedElement = null;
    
    const modal = document.getElementById('studentModal');
    const modalTitle = document.getElementById('modalTitle');
    const desktopGrid = document.getElementById('desktopStudentsGrid');
    const mobileList = document.getElementById('mobileStudentsList');
    const confirmBtn = document.getElementById('confirmBtn');
    
    if (!modal || !modalTitle || !confirmBtn) return;

    const nomination = nominations.find(n => n.id === nominationId);
    if (nomination) modalTitle.textContent = nomination.title;
    
    desktopGrid.innerHTML = '';
    mobileList.innerHTML = '';

    const allVotes = getAllVotes();
    const userVotes = allVotes[currentUser?.id] || {};
    const currentSelection = userVotes[nominationId];

    let filteredStudents;
    if (nomination.gender) {
        filteredStudents = students.filter(student => student.gender === nomination.gender);
    } else {
        filteredStudents = [...students].sort((a, b) => a.name.localeCompare(b.name));
    }

    filteredStudents.forEach((student) => {
        // Desktop version
        const desktopCard = document.createElement('div');
        desktopCard.className = 'student-card';
        
        if (currentSelection === student.name) {
            desktopCard.classList.add('selected');
            selectedStudentName = student.name;
            selectedElement = desktopCard;
        }
        
        const photoContainer = document.createElement('div');
        photoContainer.className = 'student-photo';
        
        const img = document.createElement('img');
        img.alt = student.name;
        img.loading = 'lazy';
        
        const tryImageLoad = (src) => {
            return new Promise((resolve) => {
                img.onload = () => {
                    resolve(true);
                };
                
                img.onerror = () => {
                    img.style.display = 'none';
                    const initials = document.createElement('div');
                    initials.className = 'student-initials';
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
                    resolve(false);
                };
                
                img.src = src;
            });
        };
        
        tryImageLoad(student.photo);
        
        photoContainer.appendChild(img);
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'student-name';
        nameDiv.textContent = student.name;
        
        desktopCard.appendChild(photoContainer);
        desktopCard.appendChild(nameDiv);
        
        desktopCard.addEventListener('click', () => selectStudent(student.name, desktopCard));
        
        desktopGrid.appendChild(desktopCard);
        
        // Mobile version
        const mobileItem = document.createElement('div');
        mobileItem.className = 'mobile-student-item';
        
        if (currentSelection === student.name) {
            mobileItem.classList.add('selected');
            selectedStudentName = student.name;
            selectedElement = mobileItem;
        }
        
        const mobilePhotoContainer = document.createElement('div');
        mobilePhotoContainer.className = 'mobile-student-photo';
        
        const mobileImg = document.createElement('img');
        mobileImg.alt = student.name;
        mobileImg.loading = 'lazy';
        
        const tryMobileImageLoad = (src) => {
            return new Promise((resolve) => {
                mobileImg.onload = () => {
                    resolve(true);
                };
                
                mobileImg.onerror = () => {
                    mobileImg.style.display = 'none';
                    const initials = document.createElement('div');
                    initials.className = 'mobile-student-initials';
                    initials.textContent = getInitials(student.name);
                    mobilePhotoContainer.appendChild(initials);
                    resolve(false);
                };
                
                mobileImg.src = src;
            });
        };
        
        tryMobileImageLoad(student.photo);
        
        mobilePhotoContainer.appendChild(mobileImg);
        
        const mobileInfoDiv = document.createElement('div');
        mobileInfoDiv.className = 'mobile-student-info';
        
        const mobileNameDiv = document.createElement('div');
        mobileNameDiv.className = 'mobile-student-name';
        mobileNameDiv.textContent = student.name;
        
        mobileInfoDiv.appendChild(mobileNameDiv);
        
        mobileItem.appendChild(mobilePhotoContainer);
        mobileItem.appendChild(mobileInfoDiv);
        
        if (isTouchDevice) {
            // Улучшенная обработка для мобильных
            mobileItem.addEventListener('touchstart', function(e) {
                e.preventDefault();
                selectStudent(student.name, mobileItem);
            }, { passive: false });
            
            mobileItem.addEventListener('click', function(e) {
                e.preventDefault();
                selectStudent(student.name, mobileItem);
            });
        } else {
            mobileItem.addEventListener('click', () => selectStudent(student.name, mobileItem));
        }
        
        mobileList.appendChild(mobileItem);
    });

    // Обновляем кнопку подтверждения
    confirmBtn.disabled = !selectedStudentName;
    
    // Показываем модальное окно
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Блокируем скролл на основной странице
    isModalOpen = true;
    
    // Улучшаем скроллинг для мобильных
    if (isMobile) {
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.overflowY = 'auto';
            modalContent.style.webkitOverflowScrolling = 'touch';
            modalContent.style.touchAction = 'pan-y';
        }
        
        setTimeout(() => {
            modal.scrollTop = 0;
        }, 50);
    }
}

function getInitials(name) {
    return name.split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

function selectStudent(studentName, element) {
    const desktopGrid = document.getElementById('desktopStudentsGrid');
    const mobileList = document.getElementById('mobileStudentsList');
    const confirmBtn = document.getElementById('confirmBtn');
    
    if ((desktopGrid || mobileList) && confirmBtn) {
        // Убираем галочку с предыдущего выбранного элемента
        if (selectedElement) {
            selectedElement.classList.remove('selected');
        }
        
        // Ставим галочку на новый элемент
        element.classList.add('selected');
        selectedStudentName = studentName;
        selectedElement = element;
        
        // Активируем кнопку подтверждения
        confirmBtn.disabled = false;
        
        // Вибрация на мобильных
        if (isTouchDevice && navigator.vibrate) {
            navigator.vibrate(20);
        }
    }
}

function confirmSelection() {
    if (!currentNomination || !currentUser || !selectedStudentName) return;
    
    saveVoteToFirebase(currentNomination, selectedStudentName);
    updateNominationDisplay(currentNomination, selectedStudentName);
    
    showNotification(`Вы выбрали: ${selectedStudentName}`, 'success');
    
    closeStudentModal();
}

function closeStudentModal() {
    const modal = document.getElementById('studentModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Восстанавливаем скролл
    }
    currentNomination = null;
    selectedStudentName = null;
    selectedElement = null;
    isModalOpen = false;
}

function updateNominationDisplay(nominationId, studentName) {
    const selectedDiv = document.getElementById(`selected-${nominationId}`);
    const selectedName = document.getElementById(`selected-name-${nominationId}`);
    const buttons = document.querySelectorAll(`button[onclick="openStudentSelection('${nominationId}')"]`);
    
    if (selectedDiv && selectedName) {
        selectedName.textContent = studentName;
        selectedDiv.style.display = 'flex';
    }
    
    buttons.forEach(button => {
        const buttonText = button.querySelector('.button-text');
        if (buttonText) buttonText.textContent = 'Изменить выбор';
    });
}

function showNotification(message, type = 'info') {
    const oldNotifications = document.querySelectorAll('.notification');
    oldNotifications.forEach(notif => notif.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        ${isMobile ? 'top: 15px; right: 15px; left: 15px;' : 'top: 25px; right: 25px; max-width: 350px;'}
        padding: ${isMobile ? '14px 18px' : '18px 24px'};
        border-radius: 12px;
        color: #f0f0ff;
        font-weight: 600;
        z-index: 10000;
        background: ${type === 'error' ? 'linear-gradient(135deg, #d32f2f, #b71c1c)' : 
                     type === 'success' ? 'linear-gradient(135deg, #388e3c, #1b5e20)' : 
                     'linear-gradient(135deg, #5e35b1, #4527a0)'};
        border: 2px solid ${type === 'error' ? '#ff5252' : 
                         type === 'success' ? '#69f0ae' : 
                         '#a89bdc'};
        font-size: ${isMobile ? '0.95em' : '1.05em'};
        text-align: center;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
        animation: slideIn 0.3s ease;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateY(-100px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            to {
                transform: translateY(-100px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

function showPasswordModal() {
    const modal = document.getElementById('passwordModal');
    const passwordInput = document.getElementById('adminPassword');
    
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        isModalOpen = true;
        if (passwordInput) {
            passwordInput.value = '';
            setTimeout(() => passwordInput.focus(), 100);
        }
    }
}

function closePasswordModal() {
    const modal = document.getElementById('passwordModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
    isModalOpen = false;
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
    if (adminPanel) {
        adminPanel.style.display = 'block';
        document.body.style.overflow = 'hidden';
        isModalOpen = true;
    }
}

function hideAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    if (adminPanel) {
        adminPanel.style.display = 'none';
        document.body.style.overflow = '';
    }
    isModalOpen = false;
}

async function showLiveResults() {
    const modal = document.getElementById('resultsModal');
    const resultsGrid = document.getElementById('resultsGrid');
    const resultsTitle = document.getElementById('resultsTitle');
    
    if (!modal || !resultsGrid || !resultsTitle) return;
    
    resultsTitle.textContent = 'РЕЗУЛЬТАТЫ ГОЛОСОВАНИЯ';
    resultsGrid.innerHTML = '<div class="loading">Загрузка данных...</div>';
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    isModalOpen = true;
    hideAdminPanel();
    
    try {
        const votes = await getAllVotesFromFirebase();
        const results = calculateResults(votes);
        
        let html = `
            <div class="results-stats" style="text-align: center; margin-bottom: 25px; font-size: 1.2em;">
                <strong>Всего голосов: ${Object.values(votes).reduce((acc, user) => acc + Object.values(user).length, 0)}</strong>
            </div>
        `;
        
        nominations.forEach(nomination => {
            const nominationResults = results[nomination.id] || {};
            const totalVotes = Object.values(nominationResults).reduce((sum, count) => sum + count, 0);
            
            html += `
                <div class="result-item">
                    <h4>${nomination.title}</h4>
                    <div class="results-stats">Всего голосов: ${totalVotes}</div>
                    <ul class="result-list">
            `;
            
            if (totalVotes > 0) {
                const sortedResults = Object.entries(nominationResults)
                    .sort(([,a], [,b]) => b - a);
                
                sortedResults.forEach(([student, votes], index) => {
                    const percentage = totalVotes > 0 ? (votes / totalVotes * 100).toFixed(1) : 0;
                    html += `
                        <li>
                            <span class="student-result-name">${student}</span>
                            <div class="result-details">
                                <span style="margin-right: 12px; color: #f0f0ff; font-weight: 600;">${percentage}%</span>
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
    }
}

async function showAllVoters() {
    const modal = document.getElementById('resultsModal');
    const resultsGrid = document.getElementById('resultsGrid');
    const resultsTitle = document.getElementById('resultsTitle');
    
    if (!modal || !resultsGrid || !resultsTitle) return;
    
    resultsTitle.textContent = 'ВСЕ ПРОГОЛОСОВАВШИЕ';
    resultsGrid.innerHTML = '<div class="loading">Загрузка данных...</div>';
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    isModalOpen = true;
    hideAdminPanel();
    
    try {
        const votes = await getDetailedVotesFromFirebase();
        const voters = groupVotesByUser(votes);
        
        let html = `
            <div class="results-stats" style="text-align: center; margin-bottom: 25px; font-size: 1.2em;">
                <strong>Всего проголосовало: ${voters.length} человек</strong>
            </div>
        `;
        
        if (voters.length === 0) {
            html += '<div class="no-votes" style="text-align: center;">Пока никто не проголосовал</div>';
        } else {
            voters.forEach((voter, index) => {
                const shortName = isMobile 
                    ? voter.userName.split(' ')[0] + ' ' + voter.userName.split(' ')[1]?.[0] + '.'
                    : voter.userName;
                
                html += `
                    <div class="result-item">
                        <h4>${index + 1}. ${shortName}</h4>
                        <div class="results-stats">
                            Email: ${voter.userEmail}<br>
                            Проголосовал в ${Object.keys(voter.votes).length} номинациях
                        </div>
                        <ul class="result-list">
                `;
                
                Object.entries(voter.votes).forEach(([nominationId, studentName]) => {
                    const nomination = nominations.find(n => n.id === nominationId);
                    const shortNomination = nomination?.title.length > 30 
                        ? nomination.title.substring(0, 30) + '...' 
                        : nomination?.title || nominationId;
                    
                    html += `
                        <li>
                            <span class="student-result-name">${shortNomination}</span>
                            <div class="result-details">
                                <span style="color: #f0f0ff; font-weight: 500;">→ ${studentName}</span>
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
    }
}

function closeResults() {
    const modal = document.getElementById('resultsModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
    isModalOpen = false;
}

async function downloadResultsImage() {
    try {
        showNotification('Генерация изображения...', 'info');
        
        const votes = await getAllVotesFromFirebase();
        const results = calculateResults(votes);
        
        const tempDiv = document.createElement('div');
        tempDiv.style.cssText = `
            position: fixed;
            top: -9999px;
            left: -9999px;
            width: 800px;
            background: linear-gradient(135deg, #15132b, #0c0a1a);
            color: #f0f0ff;
            padding: 40px;
            font-family: 'Inter', sans-serif;
            border: 3px solid #5e35b1;
            border-radius: 20px;
        `;
        
        let html = `
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #f0f0ff; margin-bottom: 10px; font-size: 2.2em; font-weight: 700;">
                    Антипремия "Так себе достижения"
                </h1>
                <div style="color: #a89bdc; font-size: 1.2em; margin-bottom: 20px;">
                    Результаты голосования
                </div>
                <div style="background: linear-gradient(135deg, #5e35b1, #4527a0); 
                            padding: 8px 20px; border-radius: 20px; display: inline-block; font-weight: 600;">
                    Всего голосов: ${Object.values(votes).reduce((acc, user) => acc + Object.values(user).length, 0)}
                </div>
            </div>
        `;
        
        nominations.forEach((nomination, index) => {
            const nominationResults = results[nomination.id] || {};
            const totalVotes = Object.values(nominationResults).reduce((sum, count) => sum + count, 0);
            
            html += `
                <div style="margin-bottom: 25px; background: rgba(94, 53, 177, 0.1); 
                           padding: 20px; border-radius: 15px; border-left: 4px solid #5e35b1;">
                    <h3 style="color: #f0f0ff; margin-bottom: 15px; font-size: 1.3em; font-weight: 600;">
                        ${index + 1}. ${nomination.title}
                    </h3>
            `;
            
            if (totalVotes > 0) {
                const sortedResults = Object.entries(nominationResults)
                    .sort(([,a], [,b]) => b - a);
                
                sortedResults.forEach(([student, votes], i) => {
                    const percentage = totalVotes > 0 ? (votes / totalVotes * 100).toFixed(1) : 0;
                    html += `
                        <div style="display: flex; justify-content: space-between; align-items: center; 
                                    padding: 12px 0; border-bottom: 1px solid rgba(168, 155, 220, 0.2);">
                            <span style="color: #f0f0ff; font-size: 1.1em; font-weight: 500;">
                                ${i + 1}. ${student}
                            </span>
                            <div style="display: flex; align-items: center; gap: 15px;">
                                <span style="color: #a89bdc; font-weight: 600;">${percentage}%</span>
                                <span style="background: linear-gradient(135deg, #5e35b1, #4527a0); 
                                           padding: 4px 12px; border-radius: 15px; font-weight: bold; font-size: 0.9em;">
                                    ${votes} гол.
                                </span>
                            </div>
                        </div>
                    `;
                });
            } else {
                html += '<div style="color: rgba(168, 155, 220, 0.7); text-align: center; padding: 20px;">Голосов пока нет</div>';
            }
            
            html += '</div>';
        });
        
        html += `
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; 
                        border-top: 1px solid rgba(94, 53, 177, 0.3); 
                        color: rgba(168, 155, 220, 0.7); font-size: 0.9em;">
                Сгенерировано: ${new Date().toLocaleDateString('ru-RU')} ${new Date().toLocaleTimeString('ru-RU')}
            </div>
        `;
        
        tempDiv.innerHTML = html;
        document.body.appendChild(tempDiv);
        
        const canvas = await html2canvas(tempDiv, {
            scale: 2,
            backgroundColor: null,
            useCORS: true,
            logging: false
        });
        
        const link = document.createElement('a');
        link.download = `результаты_антипремии_${new Date().toLocaleDateString('ru-RU')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        document.body.removeChild(tempDiv);
        
        showNotification('Изображение скачано!', 'success');
        
    } catch (error) {
        showNotification('Ошибка генерации изображения', 'error');
    }
}

async function getAllVotesFromFirebase() {
    try {
        const snapshot = await db.collection('votes').get();
        const votes = {};
        snapshot.forEach(doc => {
            const vote = doc.data();
            if (!votes[vote.userId]) votes[vote.userId] = {};
            votes[vote.userId][vote.nominationId] = vote.studentName;
        });
        return votes;
    } catch (error) {
        return getAllVotes();
    }
}

async function getDetailedVotesFromFirebase() {
    try {
        const snapshot = await db.collection('votes').get();
        const votes = [];
        snapshot.forEach(doc => {
            votes.push({
                id: doc.id,
                ...doc.data()
            });
        });
        return votes;
    } catch (error) {
        return [];
    }
}

function calculateResults(votes) {
    const results = {};
    
    nominations.forEach(nomination => {
        results[nomination.id] = {};
    });
    
    Object.values(votes).forEach(userVotes => {
        Object.entries(userVotes).forEach(([nominationId, studentName]) => {
            if (studentName && results[nominationId]) {
                if (!results[nominationId][studentName]) {
                    results[nominationId][studentName] = 0;
                }
                results[nominationId][studentName]++;
            }
        });
    });
    
    return results;
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

async function resetVoting() {
    if (confirm('ВНИМАНИЕ! Это действие сбросит ВСЕ данные голосования. Все голоса будут удалены без возможности восстановления. Продолжить?')) {
        try {
            const votesSnapshot = await db.collection('votes').get();
            
            if (votesSnapshot.size > 0) {
                const batch = db.batch();
                votesSnapshot.docs.forEach(doc => {
                    batch.delete(doc.ref);
                });
                await batch.commit();
            }

            localStorage.removeItem(ALL_VOTES_KEY);
            localStorage.removeItem(ALL_USERS_KEY);
            
            showNotification('Данные голосования сброшены!', 'success');
            
            setTimeout(() => {
                location.reload();
            }, 1500);
            
        } catch (error) {
            showNotification('Ошибка сброса данных', 'error');
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (isTouchDevice) {
        // Улучшенная обработка касаний для мобильных
        document.addEventListener('touchstart', function(e) {
            // Разрешаем все касания
        }, {passive: true});
        
        // Убираем блокировку двойного касания
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(event) {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        // Улучшаем скроллинг
        document.body.style.overflowY = 'auto';
        document.body.style.webkitOverflowScrolling = 'touch';
        
        // Разрешаем масштабирование
        document.addEventListener('touchmove', function(e) {
            // Разрешаем все движения касаниями
        }, {passive: true});
    }
    
    initApp();
});

// Глобальные функции
window.registerUser = registerUser;
window.openStudentSelection = openStudentSelection;
window.downloadResultsImage = downloadResultsImage;
window.showPasswordModal = showPasswordModal;
window.closePasswordModal = closePasswordModal;
window.checkAdminPassword = checkAdminPassword;
window.showAdminPanel = showAdminPanel;
window.hideAdminPanel = hideAdminPanel;
window.showLiveResults = showLiveResults;
window.showAllVoters = showAllVoters;
window.closeResults = closeResults;
window.resetVoting = resetVoting;
window.confirmSelection = confirmSelection;
window.closeStudentModal = closeStudentModal;