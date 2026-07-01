/* ============================================
   魏家诚个人主页 - 交互脚本
   星空流动粒子 · 鼠标视差 · 动态图标
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

    // ========== DOM ELEMENTS ==========
    const nav = document.querySelector('.nav');
    const navItems = document.querySelectorAll('.nav-menu .nav-item');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navGroups = document.querySelectorAll('.nav-item-group');
    const backToTop = document.querySelector('.back-to-top');
    const starBg = document.getElementById('starfield');
    const particleCanvas = document.getElementById('particleCanvas');
    const hobbyImgs = document.querySelectorAll('.hobby-imgs img, .bounce-cards img');
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
       STARFIELD FLOW PARTICLES (首页粒子流动)
       ============================================ */
    if (particleCanvas) {
        const ctx = particleCanvas.getContext('2d');
        let particles = [];
        const PARTICLE_COUNT = 100;
        let width, height;
        let animationId;

        function resizeCanvas() {
            width = window.innerWidth;
            height = window.innerHeight;
            particleCanvas.width = width;
            particleCanvas.height = height;
        }

        function createParticles() {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    size: Math.random() * 2.5 + 0.5,
                    speedX: (Math.random() - 0.5) * 0.4,
                    speedY: (Math.random() - 0.5) * 0.4,
                    opacity: Math.random() * 0.7 + 0.2,
                    twinkleSpeed: Math.random() * 0.03 + 0.008,
                    twinkleOffset: Math.random() * Math.PI * 2,
                    color: Math.random() < 0.4 ? '255,255,255' : (Math.random() < 0.5 ? '200,220,255' : '255,220,240')
                });
            }
        }

        function drawParticles() {
            ctx.clearRect(0, 0, width, height);

            // Smooth mouse tracking
            mouseX += (targetMouseX - mouseX) * 0.04;
            mouseY += (targetMouseY - mouseY) * 0.04;

            var flowX = (mouseX - 0.5) * 25;
            var flowY = (mouseY - 0.5) * 25;

            var time = Date.now() * 0.001;

            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];

                // Move particle
                p.x += p.speedX + flowX * 0.015;
                p.y += p.speedY + flowY * 0.015;

                // Wrap around
                if (p.x < -20) p.x = width + 20;
                if (p.x > width + 20) p.x = -20;
                if (p.y < -20) p.y = height + 20;
                if (p.y > height + 20) p.y = -20;

                // Twinkle
                var twinkle = Math.sin(time * p.twinkleSpeed * 50 + p.twinkleOffset) * 0.4 + 0.6;
                var alpha = p.opacity * twinkle;

                // Glow
                if (p.size > 1.8 && twinkle > 0.85) {
                    var glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5);
                    glow.addColorStop(0, 'rgba(' + p.color + ',' + (alpha * 0.4) + ')');
                    glow.addColorStop(1, 'rgba(' + p.color + ',0)');
                    ctx.fillStyle = glow;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Star with cross sparkle
                ctx.fillStyle = 'rgba(' + p.color + ',' + alpha + ')';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                // Bright sparkle
                if (twinkle > 0.9 && p.size > 1.5) {
                    ctx.strokeStyle = 'rgba(' + p.color + ',' + (alpha * 0.6) + ')';
                    ctx.lineWidth = 0.4;
                    ctx.beginPath();
                    ctx.moveTo(p.x - p.size * 5, p.y);
                    ctx.lineTo(p.x + p.size * 5, p.y);
                    ctx.moveTo(p.x, p.y - p.size * 5);
                    ctx.lineTo(p.x, p.y + p.size * 5);
                    ctx.stroke();
                }
            }

            // Occasional shooting star
            if (Math.random() < 0.006) {
                var sx = Math.random() * width;
                var sy = Math.random() * height * 0.5;
                var slen = 60 + Math.random() * 100;
                var angle = Math.PI * 0.22;
                var grad = ctx.createLinearGradient(sx, sy, sx - slen * Math.cos(angle), sy + slen * Math.sin(angle));
                grad.addColorStop(0, 'rgba(255,255,255,0.75)');
                grad.addColorStop(1, 'rgba(255,255,255,0)');
                ctx.strokeStyle = grad;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(sx, sy);
                ctx.lineTo(sx - slen * Math.cos(angle), sy + slen * Math.sin(angle));
                ctx.stroke();
            }

            animationId = requestAnimationFrame(drawParticles);
        }

        resizeCanvas();
        createParticles();
        drawParticles();

        window.addEventListener('resize', function() {
            resizeCanvas();
            createParticles();
        });
    }

    /* ============================================
       MOUSE PARALLAX · 鼠标视差
       ============================================ */
    document.addEventListener('mousemove', function(e) {
        targetMouseX = e.clientX / window.innerWidth;
        targetMouseY = e.clientY / window.innerHeight;

        // Star background subtle parallax
        if (starBg && starBg.tagName === 'IMG') {
            var sx = (targetMouseX - 0.5) * 12;
            var sy = (targetMouseY - 0.5) * 12;
            starBg.style.transform = 'scale(1.08) translate(' + sx + 'px, ' + sy + 'px)';
        }

        // Hero card gentle tilt
        if (heroCard) {
            var tiltX = (targetMouseY - 0.5) * 5;
            var tiltY = (targetMouseX - 0.5) * 5;
            heroCard.style.transform = 'perspective(800px) rotateX(' + (-tiltX) + 'deg) rotateY(' + tiltY + 'deg)';
        }
        if (heroAvatar) {
            var at = (targetMouseX - 0.5) * 3;
            heroAvatar.style.transform = 'rotate(' + at + 'deg)';
        }
    });

    // Reset transform on mouse leave
    document.addEventListener('mouseleave', function() {
        if (heroCard) heroCard.style.transform = '';
        if (heroAvatar) heroAvatar.style.transform = '';
        if (starBg && starBg.tagName === 'IMG') starBg.style.transform = 'scale(1.05)';
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
        if (!navItems.length) return;
        navItems.forEach(function(link) {
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

    // ========== MOBILE DROPDOWN TOGGLE ==========
    if (navGroups.length && window.innerWidth <= 768) {
        navGroups.forEach(function(group) {
            var trigger = group.querySelector('.nav-item');
            if (!trigger) return;
            trigger.addEventListener('click', function(e) {
                if (window.innerWidth > 768) return;
                e.preventDefault();
                group.classList.toggle('expanded');
            });
        });
    }

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navGroups.forEach(function(g) { g.classList.remove('expanded'); });
        }
    });

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

    // ========== ANIMATE BARS ON SCROLL ==========
    var barsAnimated = false;
    var skillsAnimated = false;

    function animateBars() {
        if (barsAnimated || !barFills.length) return;
        barsAnimated = true;
        barFills.forEach(function(bar, i) {
            var w = bar.style.width || bar.dataset.width || '0%';
            bar.style.width = '0%';
            setTimeout(function() { bar.style.width = w; }, i * 150);
        });
    }

    function animateSkills() {
        if (skillsAnimated || !skillFills.length) return;
        skillsAnimated = true;
        skillFills.forEach(function(fill, i) {
            var w = fill.dataset.width || '0%';
            fill.style.width = '0%';
            setTimeout(function() { fill.style.width = w; }, i * 170);
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

    // ========== LIGHTBOX ==========
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

    /* ============================================
       SPLIT TEXT · 逐字入场动画
       ============================================ */
    function initSplitText() {
        var splitElements = document.querySelectorAll('.split-text');
        if (!splitElements.length) return;

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (!entry.isIntersecting) return;

                var container = entry.target;
                var chars = container.querySelectorAll('.char');
                if (!chars.length) return;

                chars.forEach(function(char, index) {
                    setTimeout(function() {
                        char.classList.add('visible');
                    }, index * 50); // 50ms delay per character
                });

                // Callback when all letters have animated
                var totalDuration = chars.length * 50 + 600;
                setTimeout(function() {
                    console.log('All letters have animated!');
                }, totalDuration);

                observer.unobserve(container);
            });
        }, {
            threshold: 0.1,
            rootMargin: '-100px'
        });

        splitElements.forEach(function(el) {
            // Skip if already processed
            if (el.querySelector('.char')) return;

            var text = el.textContent || '';
            var chars = text.split('');

            el.textContent = '';
            el.style.visibility = 'visible';

            chars.forEach(function(ch) {
                var span = document.createElement('span');
                span.className = 'char';
                span.textContent = ch === ' ' ? '\u00A0' : ch;
                span.style.transitionDelay = '0s'; // will be handled by setTimeout
                el.appendChild(span);
            });

            observer.observe(el);
        });
    }

    // Run after a short delay to ensure DOM is ready
    setTimeout(initSplitText, 100);

    /* ============================================
       BOUNCE CARDS · 扇形堆叠入场动画
       ============================================ */
    function initBounceCards() {
        var containers = document.querySelectorAll('.bounce-cards');
        if (!containers.length) return;

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (!entry.isIntersecting) return;

                var items = entry.target.querySelectorAll('.bounce-card-item');
                if (!items.length) return;

                items.forEach(function(item, i) {
                    setTimeout(function() {
                        item.classList.add('visible');
                    }, 100 + i * 80); // stagger: 80ms per card
                });

                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.1,
            rootMargin: '-50px'
        });

        containers.forEach(function(container) {
            observer.observe(container);
        });
    }

    initBounceCards();

    /* ============================================
       GRAINIENT · 动态渐变 + 噪点背景
       ============================================ */
    const grainientCanvas = document.querySelector('.grainient-bg');
    if (grainientCanvas) {
        const ctx = grainientCanvas.getContext('2d');
        let w, h, t = 0;

        function resize() {
            w = grainientCanvas.width = window.innerWidth;
            h = grainientCanvas.height = window.innerHeight;
        }

        // 简易 2D 噪声 (sin 组合, 类 simplex warp)
        const noise = (x, y, s) =>
            Math.sin(x * 1.3 + s) * Math.cos(y * 1.7 + s * 0.7)
          + Math.sin(x * 2.1 - s * 0.5) * Math.cos(y * 1.1 + s * 0.4) * 0.6
          + Math.cos(x * 0.8 + y * 1.4 + s * 0.3) * 0.4;

        // 预渲染噪点纹理 (256×256, 复用避免逐帧生成)
        const grainSize = 256;
        const grainCanvas = document.createElement('canvas');
        grainCanvas.width = grainCanvas.height = grainSize;
        const gctx = grainCanvas.getContext('2d');
        const gd = gctx.createImageData(grainSize, grainSize);
        for (let i = 0; i < gd.data.length; i += 4) {
            const v = 127 + (Math.random() - 0.5) * 50;  // grain amount ~0.1
            gd.data[i] = gd.data[i + 1] = gd.data[i + 2] = v;
            gd.data[i + 3] = 25; // low alpha
        }
        gctx.putImageData(gd, 0, 0);
        const grainPattern = ctx.createPattern(grainCanvas, 'repeat');

        function draw() {
            t += 0.002; // timeSpeed ≈ 0.5

            // 动态渐变色标位置, 受 warp 驱动
            const p1 = (noise(0.3, 0.2, t * 1.0) * 0.12 + 0.15);
            const p2 = (noise(0.6, 0.4, t * 0.8) * 0.12 + 0.42);
            const p3 = (noise(0.9, 0.3, t * 1.2) * 0.12 + 0.68);

            const grad = ctx.createLinearGradient(0, 0, w, h);
            grad.addColorStop(0,      '#F43F5E');  // color1
            grad.addColorStop(p1,     '#EAB308');  // color2
            grad.addColorStop(p2,     '#EC4899');  // color3
            grad.addColorStop(p3,     '#F43F5E');  // back to color1
            grad.addColorStop(1,      '#EAB308');

            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);

            // 噪点叠加
            ctx.fillStyle = grainPattern;
            ctx.fillRect(0, 0, w, h);

            requestAnimationFrame(draw);
        }

        resize();
        window.addEventListener('resize', resize);
        draw();
    }


});
