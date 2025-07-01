document.addEventListener('DOMContentLoaded', () => {

    // --- Logica pentru comutarea meniului ---
    const menuButton = document.getElementById('menu-button');
    const sideMenu = document.getElementById('side-menu');
    const closeButton = document.getElementById('close-button');
    const menuOverlay = document.getElementById('menu-overlay');
    const menuLinks = document.querySelectorAll('.side-menu ul li a');

    function openMenu() {
        sideMenu.classList.add('active');
        menuOverlay.classList.add('active');
        menuButton.style.opacity = '0';
        menuButton.style.visibility = 'hidden';
    }

    function closeMenu() {
        sideMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        menuButton.style.opacity = '1';
        menuButton.style.visibility = 'visible';
    }

    menuButton.addEventListener('click', openMenu);
    closeButton.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);

    // Închide meniul la clic pe un link
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Închide meniul cu tasta 'Escape'
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && sideMenu.classList.contains('active')) {
            closeMenu();
        }
    });


    // --- Derulare lină pentru link-urile de tip ancoră ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });


    // --- Animații la derulare (reveal) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target); // Oprește observarea după ce a fost afișat
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });


    // --- Animație de contor pentru statistici ---
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace('+', ''), 10);
            let current = 0;
            const increment = Math.max(1, target / 100); // Calculează un increment potrivit
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.ceil(current) + (counter.textContent.includes('+') ? '+' : '');
                    requestAnimationFrame(updateCounter); // Folosește requestAnimationFrame pentru animații mai fluide
                } else {
                    counter.textContent = target + (counter.textContent.includes('+') ? '+' : '');
                }
            };
            updateCounter();
        });
    }

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(animateCounters, 300); // O mică întârziere pentru efect
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 }); // Declanșează când 50% din secțiune este vizibilă
        statsObserver.observe(statsSection);
    }


    // --- Logica pentru schimbarea limbii ---
    const langRoBtn = document.getElementById('lang-ro');
    const langRuBtn = document.getElementById('lang-ru');
    const translatableElements = document.querySelectorAll('[data-ro], [data-ru]');

    function setLanguage(lang) {
        translatableElements.forEach(element => {
            const text = element.dataset[lang];
            if (text) {
                element.innerHTML = text;
            }
        });

        if (lang === 'ro') {
            langRoBtn.classList.add('active');
            langRuBtn.classList.remove('active');
        } else {
            langRuBtn.classList.add('active');
            langRoBtn.classList.remove('active');
        }
        document.documentElement.lang = lang;
        localStorage.setItem('selectedLanguage', lang);
    }

    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang) {
        setLanguage(savedLang);
    } else {
        setLanguage('ro'); // Limbă implicită: Română
    }

    langRoBtn.addEventListener('click', () => setLanguage('ro'));
    langRuBtn.addEventListener('click', () => setLanguage('ru'));

});