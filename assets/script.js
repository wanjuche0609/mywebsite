/* ============================================
   魏家诚个人主页 - 交互脚本
   Personal Website - Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

    // ========== DOM Elements ==========
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-links a');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-links');
    const backToTop = document.querySelector('.back-to-top');
    const sections = document.querySelectorAll('.section');
    const revealElements = document.querySelectorAll('.reveal');
    const hobbyImgs = document.querySelectorAll('.hobby-imgs img');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
    const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
    const lightboxPrev = lightbox ? lightbox.querySelector('.lightbox-prev') : null;
    const lightboxNext = lightbox ? lightbox.querySelector('.lightbox-next') : null;
    const mbtiBarFills = document.querySelectorAll('.mbti-bar-fill');
    const skillProgressFills = document.querySelectorAll('.skill-progress-fill');

    let lightboxImages = [];
    let lightboxIndex = 0;

    // ========== Navigation Scroll Shadow ==========
    function updateNavShadow() {
        if (window.scrollY > 10) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    // ========== Active Nav Link on Scroll ==========
    function updateActiveNav() {
        let current = '';
        sections.forEach(function(section) {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    // ========== Smooth Scroll (fallback for browsers without smooth behavior) ==========
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                const navHeight = nav.offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                // Close mobile menu
                navMenu.classList.remove('open');
                navToggle.classList.remove('open');
            }
        });
    });

    // ========== Mobile Menu Toggle ==========
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            this.classList.toggle('open');
            navMenu.classList.toggle('open');
        });
    }
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('open') &&
            !navMenu.contains(e.target) &&
            !navToggle.contains(e.target)) {
            navMenu.classList.remove('open');
            navToggle.classList.remove('open');
        }
    });

    // ========== Back to Top ==========
    function updateBackToTop() {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }
    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ========== Scroll Reveal (Intersection Observer) ==========
    if ('IntersectionObserver' in window) {
        const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };
        const revealObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        revealElements.forEach(function(el) { revealObserver.observe(el); });
    } else {
        // Fallback: show all immediately
        revealElements.forEach(function(el) { el.classList.add('visible'); });
    }

    // ========== Animate MBTI Bars on Scroll ==========
    function animateBars(fills, widths) {
        fills.forEach(function(fill, i) {
            fill.style.width = '0%';
            setTimeout(function() {
                fill.style.width = widths[i];
            }, i * 150);
        });
    }

    let mbtiAnimated = false;
    function checkMBTIInView() {
        if (mbtiAnimated) return;
        var mbtiSection = document.getElementById('about');
        if (!mbtiSection) return;
        var rect = mbtiSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.7 && rect.bottom > 0) {
            mbtiAnimated = true;
            if (mbtiBarFills.length > 0) {
                var barWidths = [];
                mbtiBarFills.forEach(function(bar) { barWidths.push(bar.style.width || bar.dataset.width || '0%'); });
                animateBars(mbtiBarFills, barWidths);
            }
        }
    }

    // ========== Animate Skill Progress Bars ==========
    let skillsAnimated = false;
    function checkSkillsInView() {
        if (skillsAnimated) return;
        var skillsSection = document.getElementById('skills');
        if (!skillsSection) return;
        var rect = skillsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.7 && rect.bottom > 0) {
            skillsAnimated = true;
            if (skillProgressFills.length > 0) {
                var skillWidths = [];
                skillProgressFills.forEach(function(bar) { skillWidths.push(bar.dataset.width || '0%'); });
                skillProgressFills.forEach(function(fill, i) {
                    fill.style.width = '0%';
                    setTimeout(function() {
                        fill.style.width = skillWidths[i];
                    }, i * 180);
                });
            }
        }
    }

    // ========== Lightbox ==========
    function openLightbox(index) {
        if (!lightbox || !lightboxImg) return;
        lightboxIndex = index;
        lightboxImg.src = lightboxImages[lightboxIndex].src;
        lightboxImg.alt = lightboxImages[lightboxIndex].alt;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }
    function prevImage() {
        lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
        lightboxImg.src = lightboxImages[lightboxIndex].src;
        lightboxImg.alt = lightboxImages[lightboxIndex].alt;
    }
    function nextImage() {
        lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
        lightboxImg.src = lightboxImages[lightboxIndex].src;
        lightboxImg.alt = lightboxImages[lightboxIndex].alt;
    }

    if (hobbyImgs.length > 0) {
        lightboxImages = Array.from(hobbyImgs);
        hobbyImgs.forEach(function(img, index) {
            img.addEventListener('click', function() {
                openLightbox(index);
            });
        });
    }
    if (lightboxClose) { lightboxClose.addEventListener('click', closeLightbox); }
    if (lightboxPrev) { lightboxPrev.addEventListener('click', prevImage); }
    if (lightboxNext) { lightboxNext.addEventListener('click', nextImage); }
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) closeLightbox();
        });
    }
    document.addEventListener('keydown', function(e) {
        if (!lightbox || !lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
    });

    // ========== Combined Scroll Handler ==========
    function onScroll() {
        updateNavShadow();
        updateActiveNav();
        updateBackToTop();
        checkMBTIInView();
        checkSkillsInView();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial check
    onScroll();
    // Check animations after a small delay in case elements are already in view
    setTimeout(function() {
        checkMBTIInView();
        checkSkillsInView();
    }, 500);

});
