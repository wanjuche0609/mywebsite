/* ============================================
   魏家诚个人主页 - 交互脚本 (五页版)
   Starfield Engine + Mouse Parallax + Dynamic Icons
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

    // ========== DOM ELEMENTS ==========
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-links a');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-links');
    const backToTop = document.querySelector('.back-to-top');
    const starCanvas = document.getElementById('starfield');
    const hobbyImgs = document.querySelectorAll('.hobby-imgs img');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
    const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
    const lightboxPrev = lightbox ? lightbox.querySelector('.lightbox-prev') : null;
    const lightboxNext = lightbox ? lightbox.querySelector('.lightbox-next') : null;
    const barFills = document.querySelectorAll('.bar-fill');
    const skillFills = document.querySelectorAll('.skill-progress-fill');
    const heroCard = document.querySelector('.hero-card');
    const heroAvatar = document.querySelector('.hero-avatar');

    let lightboxImages = [];
    let lightboxIndex = 0;
    let mouseX = 0.5, mouseY = 0.5;
    let targetMouseX = 0.5, targetMouseY = 0.5;

    /* ============================================
       STARFIELD ENGINE (首页 Canvas 星空)
       ============================================ */
    if (starCanvas) {
        const ctx = starCanvas.getContext('2d');
        let stars = [];
        const STAR_COUNT = 180;
        let width, height;
        let animationId;

        function resizeStarfield() {
            width = window.innerWidth;
            height = window.innerHeight;
            starCanvas.width = width;
            starCanvas.height = height;
        }

        function createStars() {
            stars = [];
            for (let i = 0; i < STAR_COUNT; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    z: Math.random() * 0.9 + 0.1,  // depth: 0.1 (far) to 1 (near)
                    baseSize: Math.random() * 2.2 + 0.5,
                    twinkleSpeed: Math.random() * 0.02 + 0.005,
                    twinkleOffset: Math.random() * Math.PI * 2,
                    hue: Math.random() < 0.15 ? 210 + Math.random() * 40 : 260 + Math.random() * 30  // mostly purple-blue, some blue
                });
            }
            // Sort by z for depth layering
            stars.sort(function(a, b) { return a.z - b.z; });
        }

        function drawStars() {
            ctx.clearRect(0, 0, width, height);

            // Smooth mouse tracking
            mouseX += (targetMouseX - mouseX) * 0.05;
            mouseY += (targetMouseY - mouseY) * 0.05;

            var parallaxX = (mouseX - 0.5) * 60;
            var parallaxY = (mouseY - 0.5) * 60;

            var time = Date.now() * 0.001;

            for (var i = 0; i < stars.length; i++) {
                var s = stars[i];

                // Parallax: closer stars move more with mouse
                var px = s.x + parallaxX * s.z;
                var py = s.y + parallaxY * s.z;

                // Wrap around screen edges
                if (px < -20) px += width + 40;
                if (px > width + 20) px -= width + 40;
                if (py < -20) py += height + 40;
                if (py > height + 20) py -= height + 40;

                // Twinkle
                var twinkle = Math.sin(time * s.twinkleSpeed * 60 + s.twinkleOffset) * 0.35 + 0.65;
                var alpha = twinkle * (0.35 + s.z * 0.65);
                var size = s.baseSize * (0.7 + s.z * 0.5) * twinkle;

                // Glow effect for near stars
                if (s.z > 0.75) {
                    var glow = ctx.createRadialGradient(px, py, 0, px, py, size * 3);
                    var hueStr = 'hsla(' + s.hue + ', 70%, 75%, ' + (alpha * 0.35) + ')';
                    var transparentStr = 'hsla(' + s.hue + ', 70%, 75%, 0)';
                    glow.addColorStop(0, hueStr);
                    glow.addColorStop(1, transparentStr);
                    ctx.fillStyle = glow;
                    ctx.beginPath();
                    ctx.arc(px, py, size * 3, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Draw star
                ctx.fillStyle = 'hsla(' + s.hue + ', 60%, ' + (70 + s.z * 30) + '%, ' + alpha + ')';
                ctx.beginPath();
                ctx.arc(px, py, size, 0, Math.PI * 2);
                ctx.fill();

                // Cross sparkle for brightest stars
                if (s.z > 0.85 && twinkle > 0.85) {
                    ctx.strokeStyle = 'hsla(' + s.hue + ', 70%, 90%, ' + (alpha * 0.6) + ')';
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(px - size * 4, py);
                    ctx.lineTo(px + size * 4, py);
                    ctx.moveTo(px, py - size * 4);
                    ctx.lineTo(px, py + size * 4);
                    ctx.stroke();
                }
            }

            // Shooting star (occasional)
            if (Math.random() < 0.008) {
                var sx = Math.random() * width;
                var sy = Math.random() * height * 0.6;
                var len = 80 + Math.random() * 120;
                var angle = Math.PI * 0.25;
                ctx.strokeStyle = 'rgba(255,255,255,0.7)';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(sx, sy);
                ctx.lineTo(sx - len * Math.cos(angle), sy + len * Math.sin(angle));
                var grad = ctx.createLinearGradient(sx, sy,
                    sx - len * Math.cos(angle), sy + len * Math.sin(angle));
                grad.addColorStop(0, 'rgba(255,255,255,0.8)');
                grad.addColorStop(1, 'rgba(255,255,255,0)');
                ctx.strokeStyle = grad;
                ctx.stroke();
            }

            animationId = requestAnimationFrame(drawStars);
        }

        resizeStarfield();
        createStars();
        drawStars();

        window.addEventListener('resize', function() {
            resizeStarfield();
            createStars();
        });
    }

    /* ============================================
       MOUSE TRACKING (全局)
       ============================================ */
    document.addEventListener('mousemove', function(e) {
        targetMouseX = e.clientX / window.innerWidth;
        targetMouseY = e.clientY / window.innerHeight;

        // Hero card gentle tilt (首页)
        if (heroCard) {
            var tiltX = (targetMouseY - 0.5) * 6;
            var tiltY = (targetMouseX - 0.5) * 6;
            heroCard.style.transform = 'perspective(800px) rotateX(' + (-tiltX) + 'deg) rotateY(' + tiltY + 'deg) translateY(-4px)';
        }
        if (heroAvatar) {
            var atilt = (targetMouseX - 0.5) * 3;
            heroAvatar.style.transform = 'rotate(' + atilt + 'deg)';
        }
    });

    // ========== NAV SCROLL SHADOW ==========
    function updateNavShadow() {
        if (!nav) return;
        if (window.scrollY > 10) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    }

    // ========== ACTIVE NAV LINK ==========
    function getCurrentPage() {
        var path = window.location.pathname;
        var page = path.split('/').pop() || 'index.html';
        if (page === '' || page === '/') page = 'index.html';
        return page.replace('.html', '');
    }

    function setActiveNav() {
        var current = getCurrentPage();
        if (!navLinks.length) return;
        navLinks.forEach(function(link) {
            link.classList.remove('active');
            var href = link.getAttribute('href');
            if (href && href.includes(current + '.html')) link.classList.add('active');
            if (current === 'index' && href === 'index.html') link.classList.add('active');
        });
    }
    setActiveNav();

    // ========== MOBILE MENU ==========
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            this.classList.toggle('open');
            navMenu.classList.toggle('open');
        });
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('open') &&
                !navMenu.contains(e.target) &&
                !navToggle.contains(e.target)) {
                navMenu.classList.remove('open');
                navToggle.classList.remove('open');
            }
        });
    }

    // ========== BACK TO TOP ==========
    function updateBackToTop() {
        if (!backToTop) return;
        if (window.scrollY > 500) backToTop.classList.add('show');
        else backToTop.classList.remove('show');
    }
    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ========== ANIMATE BARS ON SCROLL (about.html / skill.html) ==========
    var barsAnimated = false;
    var skillsAnimated = false;

    function animateBars() {
        if (barsAnimated || !barFills.length) return;
        barsAnimated = true;
        barFills.forEach(function(bar, i) {
            var w = bar.style.width || bar.dataset.width || '0%';
            bar.style.width = '0%';
            setTimeout(function() { bar.style.width = w; }, i * 140);
        });
    }

    function animateSkills() {
        if (skillsAnimated || !skillFills.length) return;
        skillsAnimated = true;
        skillFills.forEach(function(fill, i) {
            var w = fill.dataset.width || '0%';
            fill.style.width = '0%';
            setTimeout(function() { fill.style.width = w; }, i * 160);
        });
    }

    function checkAnimations() {
        if (!barsAnimated && barFills.length) {
            var first = barFills[0];
            if (first) {
                var rect = first.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) animateBars();
            }
        }
        if (!skillsAnimated && skillFills.length) {
            var first = skillFills[0];
            if (first) {
                var rect = first.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) animateSkills();
            }
        }
    }

    // ========== LIGHTBOX (hobby.html) ==========
    function openLightbox(index) {
        if (!lightbox || !lightboxImg || !lightboxImages.length) return;
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
    }
    function nextImage() {
        lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
        lightboxImg.src = lightboxImages[lightboxIndex].src;
    }

    if (hobbyImgs.length > 0) {
        lightboxImages = Array.from(hobbyImgs);
        hobbyImgs.forEach(function(img, index) {
            img.addEventListener('click', function() { openLightbox(index); });
        });
    }
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);
    if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
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

    // ========== SCROLL HANDLER ==========
    function onScroll() {
        updateNavShadow();
        updateBackToTop();
        checkAnimations();
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    // ========== INIT ==========
    updateNavShadow();
    updateBackToTop();
    setTimeout(checkAnimations, 400);

});
