/**
 * 六楼小站 - 主交互脚本
 * 功能：主题切换、移动端菜单、滚动动画、导航高亮
 */

(function () {
    'use strict';

    // ============================================
    // 主题切换
    // ============================================
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // 从 localStorage 读取主题设置，默认暗色
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
        html.classList.remove('dark');
    } else {
        html.classList.add('dark');
    }

    // 主题切换事件
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = html.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                html.classList.add('dark');
            } else {
                html.classList.remove('dark');
            }
        }
    });

    // ============================================
    // 移动端菜单
    // ============================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            mobileMenu.classList.toggle('hidden');
        });

        // 点击导航链接后关闭菜单
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // ============================================
    // 导航栏滚动效果
    // ============================================
    const navbar = document.getElementById('navbar');

    function updateNavbar() {
        if (window.scrollY > 10) {
            navbar.classList.add('shadow-sm');
            navbar.style.borderColor = 'var(--tw-border-opacity, 1)';
        } else {
            navbar.classList.remove('shadow-sm');
        }
    }

    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();

    // ============================================
    // 导航高亮（滚动监听）
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const scrollSpyDots = document.querySelectorAll('.scroll-spy-dot');

    function highlightNav() {
        const scrollPos = window.scrollY + 100;
        let currentSection = '';

        // Check if scrolled to bottom - highlight last section
        const pageBottom = document.documentElement.scrollHeight - window.innerHeight;
        if (window.scrollY >= pageBottom - 100) {
            const lastSection = sections[sections.length - 1];
            currentSection = lastSection.getAttribute('id');
        } else {
            sections.forEach(section => {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                const id = section.getAttribute('id');

                if (scrollPos >= top && scrollPos < top + height) {
                    currentSection = id;
                }
            });
        }

        // Update nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });

        // Update scroll spy dots
        scrollSpyDots.forEach(dot => {
            if (dot.dataset.section === currentSection) {
                dot.classList.add('!bg-primary-500', 'dark:!bg-primary-300', '!w-3.5', '!h-3.5');
                dot.classList.remove('bg-light-muted/40', 'dark:bg-dark-muted/40');
            } else {
                dot.classList.remove('!bg-primary-500', 'dark:!bg-primary-300', '!w-3.5', '!h-3.5');
                dot.classList.add('bg-light-muted/40', 'dark:bg-dark-muted/40');
            }
        });
    }

    window.addEventListener('scroll', highlightNav, { passive: true });
    highlightNav();

    // ============================================
    // 滚动显示动画（IntersectionObserver）
    // ============================================
    const revealElements = document.querySelectorAll(
        '.project-card, .tool-card, .blog-item'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // 添加延迟，让元素依次出现
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // ============================================
    // 平滑滚动（为不支持 CSS scroll-behavior 的浏览器兜底）
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 64; // 减去导航栏高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // 当前年份（页脚版权）
    // ============================================
    const yearElements = document.querySelectorAll('.current-year');
    yearElements.forEach(el => {
        el.textContent = new Date().getFullYear();
    });

    // ============================================
    // 建站天数（从 2015-06-14 开始计算，格式：XX年XX天）
    // ============================================
    const siteDaysEl = document.getElementById('site-days');
    if (siteDaysEl) {
        const start = new Date('2015-06-14T00:00:00');
        const now = new Date();

        let years = now.getFullYear() - start.getFullYear();
        const monthDiff = now.getMonth() - start.getMonth();
        const dayDiff = now.getDate() - start.getDate();
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            years--;
        }

        const thisYearStart = new Date(now.getFullYear(), start.getMonth(), start.getDate());
        let days;
        if (now >= thisYearStart) {
            days = Math.floor((now - thisYearStart) / (1000 * 60 * 60 * 24));
        } else {
            const lastYearStart = new Date(now.getFullYear() - 1, start.getMonth(), start.getDate());
            days = Math.floor((now - lastYearStart) / (1000 * 60 * 60 * 24));
        }

        siteDaysEl.textContent = '\u5df2\u5efa\u7ad9 ' + years + '\u5e74' + days + '\u5929';
    }

    // ============================================
    // 炫酷视觉效果：粒子背景 + 视差滚动 + 鼠标轨迹
    // ============================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    if (!prefersReducedMotion) {

        // ---- 1. 粒子背景系统 ----
        const canvas = document.getElementById('particle-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            let particles = [];
            let mouseX = -1000;
            let mouseY = -1000;
            let animationId;
            let isDark = html.classList.contains('dark');

            const PARTICLE_COUNT = isTouchDevice ? 25 : 60;
            const CONNECTION_DISTANCE = 120;
            const MOUSE_RADIUS = 150;

            function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }

            class Particle {
                constructor() {
                    this.reset();
                }

                reset() {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.vx = (Math.random() - 0.5) * 0.6;
                    this.vy = (Math.random() - 0.5) * 0.6;
                    this.radius = Math.random() * 2 + 1;
                    this.opacity = Math.random() * 0.5 + 0.3;
                }

                update() {
                    this.x += this.vx;
                    this.y += this.vy;

                    // Bounce off edges
                    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                    // Mouse repulsion
                    const dx = this.x - mouseX;
                    const dy = this.y - mouseY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < MOUSE_RADIUS && dist > 0) {
                        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
                        this.x += (dx / dist) * force * 2;
                        this.y += (dy / dist) * force * 2;
                    }
                }

                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.fillStyle = isDark
                        ? `rgba(94, 234, 212, ${this.opacity})`
                        : `rgba(13, 148, 136, ${this.opacity})`;
                    ctx.fill();
                }
            }

            function initParticles() {
                particles = [];
                for (let i = 0; i < PARTICLE_COUNT; i++) {
                    particles.push(new Particle());
                }
            }

            function drawConnections() {
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < CONNECTION_DISTANCE) {
                            const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.2;
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.strokeStyle = isDark
                                ? `rgba(94, 234, 212, ${opacity})`
                                : `rgba(13, 148, 136, ${opacity})`;
                            ctx.lineWidth = 1;
                            ctx.stroke();
                        }
                    }
                }
            }

            function animateParticles() {
                isDark = html.classList.contains('dark');
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                particles.forEach(p => {
                    p.update();
                    p.draw();
                });

                drawConnections();
                animationId = requestAnimationFrame(animateParticles);
            }

            // Mouse tracking for particles
            window.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });

            window.addEventListener('resize', () => {
                resizeCanvas();
                initParticles();
            });

            // Observe theme changes
            const themeObserver = new MutationObserver(() => {
                isDark = html.classList.contains('dark');
            });
            themeObserver.observe(html, { attributes: true, attributeFilter: ['class'] });

            resizeCanvas();
            initParticles();
            animateParticles();
        }

        // ---- 2. 浮动气泡背景 ----
        const bubbleBg = document.getElementById('bubble-bg');
        if (bubbleBg && !isTouchDevice) {
            const BUBBLE_COUNT = 15;
            for (let i = 0; i < BUBBLE_COUNT; i++) {
                const bubble = document.createElement('div');
                bubble.classList.add('bubble');
                const size = Math.random() * 80 + 30;
                const left = Math.random() * 100;
                const duration = Math.random() * 12 + 10;
                const delay = Math.random() * 20;
                bubble.style.cssText = `
                    width: ${size}px;
                    height: ${size}px;
                    left: ${left}%;
                    animation-duration: ${duration}s;
                    animation-delay: ${delay}s;
                `;
                bubbleBg.appendChild(bubble);
            }
        }

        // ---- 3. 3D 视差滚动 ----
        const parallaxElements = document.querySelectorAll('[data-parallax-speed]');
        if (parallaxElements.length > 0) {
            let ticking = false;

            function updateParallax() {
                const scrollY = window.scrollY;
                parallaxElements.forEach(el => {
                    const speed = parseFloat(el.dataset.parallaxSpeed) || 0.1;
                    const rect = el.getBoundingClientRect();
                    const elementCenter = rect.top + rect.height / 2 + scrollY;
                    const viewportCenter = scrollY + window.innerHeight / 2;
                    const distance = elementCenter - viewportCenter;
                    const offset = distance * speed * -0.5;
                    el.style.transform = `translateY(${offset}px)`;
                });
                ticking = false;
            }

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(updateParallax);
                    ticking = true;
                }
            }, { passive: true });

            updateParallax();
        }

        // ---- 3. 鼠标轨迹特效 ----
        const trailContainer = document.getElementById('mouse-trail');
        if (trailContainer && !isTouchDevice) {
            const MAX_TRAIL_PARTICLES = 30;
            let trailParticles = [];
            let trailIndex = 0;

            function createTrailParticle(x, y) {
                const particle = document.createElement('div');
                const size = Math.random() * 6 + 3;
                const isDark = html.classList.contains('dark');

                particle.style.cssText = `
                    position: absolute;
                    left: ${x}px;
                    top: ${y}px;
                    width: ${size}px;
                    height: ${size}px;
                    border-radius: 50%;
                    background: ${isDark ? 'rgba(94, 234, 212, 0.8)' : 'rgba(13, 148, 136, 0.6)'};
                    pointer-events: none;
                    transform: translate(-50%, -50%);
                    animation: trailFade 1s ease-out forwards;
                    box-shadow: 0 0 ${size * 2}px ${isDark ? 'rgba(94, 234, 212, 0.5)' : 'rgba(13, 148, 136, 0.4)'};
                `;

                trailContainer.appendChild(particle);

                // Remove after animation
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.remove();
                    }
                }, 1000);
            }

            // Add trail animation keyframes dynamically
            if (!document.getElementById('trail-keyframes')) {
                const style = document.createElement('style');
                style.id = 'trail-keyframes';
                style.textContent = `
                    @keyframes trailFade {
                        0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                        100% { opacity: 0; transform: translate(-50%, -80px) scale(0); }
                    }
                `;
                document.head.appendChild(style);
            }

            let lastTrailX = 0;
            let lastTrailY = 0;
            const TRAIL_THRESHOLD = 8;

            window.addEventListener('mousemove', (e) => {
                const dx = e.clientX - lastTrailX;
                const dy = e.clientY - lastTrailY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist > TRAIL_THRESHOLD) {
                    createTrailParticle(e.clientX, e.clientY);
                    lastTrailX = e.clientX;
                    lastTrailY = e.clientY;
                }
            });
        }

        // ============================================
        // 4. 打字机效果
        // ============================================
        const typewriterEl = document.getElementById('typewriter');
        if (typewriterEl) {
            const text = typewriterEl.dataset.text || '';
            const textSpan = typewriterEl.querySelector('.typewriter-text');
            const cursor = typewriterEl.querySelector('.typewriter-cursor');
            let index = 0;

            function typeChar() {
                if (index < text.length) {
                    const char = text.charAt(index);
                    // "\u516d\u697c\u7684\u96e8" starts at index 5, wrap the name in colored span
                    if (char === '\u516d' && index === 5) {
                        const before = text.substring(0, index);
                        const colored = text.substring(index);
                        const isDark = html.classList.contains('dark');
                        textSpan.innerHTML = before + '<span class="' + (isDark ? 'text-primary-300' : 'text-primary-600') + '">' + colored + '</span>';
                        index = text.length;
                        // Hide cursor after typing completes
                        setTimeout(() => {
                            if (cursor) {
                                cursor.style.opacity = '0';
                                cursor.style.transition = 'opacity 0.3s ease';
                            }
                        }, 800);
                    } else {
                        textSpan.textContent = text.substring(0, index + 1);
                        index++;
                        setTimeout(typeChar, 120);
                    }
                }
            }

            if (cursor) cursor.style.animation = 'none';
            setTimeout(typeChar, 800);
        }

        // ============================================
        // 5. 霓虹发光边框
        // ============================================
        const glowCards = document.querySelectorAll('.project-card, .tool-card, .blog-item, .about-card, #contact a');
        glowCards.forEach(card => {
            card.classList.add('neon-glow');
        });

        // ============================================
        // 6. 光线扫过卡片
        // ============================================
        const shineCards = document.querySelectorAll('.project-card, .tool-card, .blog-item, .about-card, #contact a');
        shineCards.forEach(card => {
            card.classList.add('card-shine');
            if (!card.classList.contains('overflow-hidden')) {
                card.classList.add('overflow-hidden');
            }
        });

        // ============================================
        // 7. 数字滚动动画（建站天数）
        // ============================================
        function animateValue(id, start, end, duration, suffix) {
            const el = document.getElementById(id);
            if (!el) return;
            const range = end - start;
            const startTime = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(start + range * easeOut);
                el.textContent = '\u5df2\u5efa\u7ad9 ' + current + (suffix || '');
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }

            requestAnimationFrame(update);
        }

        // Animate site days counter when scrolled into view
        const siteDaysElAnim = document.getElementById('site-days');
        if (siteDaysElAnim) {
            const text = siteDaysElAnim.textContent;
            const yearMatch = text.match(/(\d+)\u5e74/);
            const dayMatch = text.match(/(\d+)\u5929/);
            if (yearMatch && dayMatch) {
                const years = parseInt(yearMatch[1]);
                const days = parseInt(dayMatch[1]);
                siteDaysElAnim.textContent = '\u5df2\u5efa\u7ad9 0\u5e740\u5929';

                const counterObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            counterObserver.unobserve(entry.target);
                            let start = 0;
                            const total = years * 365 + days;
                            const duration = 1500;
                            const startTime = performance.now();

                            function updateCounter(currentTime) {
                                const elapsed = currentTime - startTime;
                                const progress = Math.min(elapsed / duration, 1);
                                const easeOut = 1 - Math.pow(1 - progress, 3);
                                const current = Math.floor(total * easeOut);
                                const showYears = Math.floor(current / 365);
                                const showDays = current % 365;
                                siteDaysElAnim.textContent = '\u5df2\u5efa\u7ad9 ' + showYears + '\u5e74' + showDays + '\u5929';
                                if (progress < 1) {
                                    requestAnimationFrame(updateCounter);
                                } else {
                                    siteDaysElAnim.textContent = '\u5df2\u5efa\u7ad9 ' + years + '\u5e74' + days + '\u5929';
                                }
                            }
                            requestAnimationFrame(updateCounter);
                        }
                    });
                }, { threshold: 0.5 });
                counterObserver.observe(siteDaysElAnim);
            }
        }
    }

})();
