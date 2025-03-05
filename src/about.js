function updateLanguage(lang) {
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        element.innerHTML = translations[lang][key];
    });
    document.documentElement.lang = lang === 'be' ? 'be' : 'ru';
    document.querySelectorAll('.lang-switcher button').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
}

function initSlider() {
    const slides = document.querySelector('.slides');
    const slideItems = document.querySelectorAll('.slides a');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentIndex = 0;
    let isMobile = window.innerWidth <= 768;

    function updateSlider(index) {
        if (typeof index === 'number') currentIndex = index;
        const slideWidth = slides.clientWidth;
        slides.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        slideItems.forEach((item, i) => {
            item.classList.toggle('active', i === currentIndex);
        });
    }

    function scrollToSection(index) {
        const sectionId = slideItems[index].getAttribute('href').substring(1);
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    if (isMobile) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slideItems.length - 1;
            updateSlider();
            scrollToSection(currentIndex);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex < slideItems.length - 1) ? currentIndex + 1 : 0;
            updateSlider();
            scrollToSection(currentIndex);
        });

        slideItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                currentIndex = index;
                updateSlider();
                scrollToSection(index);
            });
        });
    }

    function syncSliderWithScroll() {
        if (!isMobile) return;
        const sections = document.querySelectorAll('section');
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });
        slideItems.forEach((link, index) => {
            if (link.getAttribute('href') === `#${currentSection}` && index !== currentIndex) {
                currentIndex = index;
                updateSlider();
            }
        });
    }

    window.addEventListener('resize', () => {
        isMobile = window.innerWidth <= 768;
        updateSlider();
    });

    window.addEventListener('scroll', syncSliderWithScroll);
    updateSlider();
}

document.addEventListener('DOMContentLoaded', () => {
    updateLanguage('be');

    document.querySelectorAll('.lang-switcher button').forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.getAttribute('data-lang');
            updateLanguage(lang);
        });
    });

    initSlider();

    window.addEventListener('scroll', () => {
        const parallax = document.querySelector('.parallax-bg');
        const scrollPosition = window.scrollY;
        parallax.style.transform = `translateY(${scrollPosition * 0.5}px)`;
    });

    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });
    sections.forEach(section => observer.observe(section));

    if (window.innerWidth > 768) {
        const navLinks = document.querySelectorAll('.desktop-nav a');
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
});