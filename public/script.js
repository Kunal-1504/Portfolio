/**
 * ═══════════════════════════════════════════════════════════════════
 *  OPENAI GPT-6 ASTRA — INTERACTIVE ENGINE
 *  Kunal Deshmukh — AI/ML & Agentic Systems Engineer
 * ═══════════════════════════════════════════════════════════════════
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let triggerNeuralSurge = () => {};

  /* ─── 00. OPENAI ASTRA CINEMATIC OPENING SEQUENCE ───────────────── */
  const introCurtain = document.getElementById('introCurtain');
  const introProgressFill = document.getElementById('introProgressFill');
  const introCounter = document.getElementById('introCounter');
  const introStatusText = document.getElementById('introStatusText');
  const heroWords = document.querySelectorAll('.hero-word');
  const heroLines = document.querySelectorAll('.hero-line-inner');
  const heroBadge = document.querySelector('.hero-badge-wrap');
  const heroSubhead = document.querySelector('.hero-subhead');
  const heroCtas = document.querySelector('.hero-cta-group');
  const globalNav = document.getElementById('globalNav');
  const badgeTextEl = document.getElementById('heroBadgeText');

  const startBadgeTypewriter = () => {
    if (!badgeTextEl || prefersReducedMotion) return;
    const originalText = badgeTextEl.textContent.trim();
    badgeTextEl.textContent = '';
    let idx = 0;
    const typeNextChar = () => {
      if (idx < originalText.length) {
        badgeTextEl.textContent += originalText[idx];
        idx++;
        setTimeout(typeNextChar, 24);
      }
    };
    setTimeout(typeNextChar, 200);
  };

  const triggerHeroEntrance = () => {
    // 1. Shockwave burst in 3D neural core
    if (typeof triggerNeuralSurge === 'function') {
      triggerNeuralSurge();
    }
    // 2. Navbar drops down into view
    if (globalNav) globalNav.classList.add('nav-revealed');
    // 3. Hero badge pops in & starts typewriter
    if (heroBadge) heroBadge.classList.add('revealed');
    startBadgeTypewriter();
    // 4. Staggered hero headline word fade-up-and-blur reveal (50-80ms delay)
    if (heroWords.length > 0) {
      heroWords.forEach((word, i) => {
        setTimeout(() => {
          word.classList.add('revealed');
        }, 80 + i * 65);
      });
    } else {
      heroLines.forEach((line, i) => {
        setTimeout(() => {
          line.classList.add('revealed');
        }, 80 + i * 140);
      });
    }
    // 5. Subhead and CTA button fade in after the headline with slight delay
    const subheadDelay = heroWords.length > 0 ? (80 + heroWords.length * 65 + 140) : 380;
    setTimeout(() => {
      if (heroSubhead) heroSubhead.classList.add('revealed');
    }, subheadDelay);
    // 6. CTAs pop in
    setTimeout(() => {
      if (heroCtas) heroCtas.classList.add('revealed');
    }, subheadDelay + 200);
  };

  if (introCurtain && !prefersReducedMotion) {
    let progress = 0;
    let finished = false;

    const completeIntro = () => {
      if (finished) return;
      finished = true;
      if (introProgressFill) introProgressFill.style.width = '100%';
      if (introCounter) introCounter.textContent = '100%';
      if (introStatusText) introStatusText.textContent = 'SYSTEM ONLINE // ASTRA CORE READY';

      setTimeout(() => {
        introCurtain.classList.add('open');
        triggerHeroEntrance();
        setTimeout(() => {
          introCurtain.classList.add('hidden');
        }, 1100);
      }, 250);
    };

    const statusMessages = [
      { at: 0, msg: 'INITIALIZING NEURAL WEIGHTS...' },
      { at: 35, msg: 'CALIBRATING TENSOR MESH...' },
      { at: 70, msg: 'CONNECTING AGENTIC GRAPHS...' },
      { at: 92, msg: 'SYSTEM ONLINE // ASTRA CORE' }
    ];

    const stepInterval = setInterval(() => {
      if (finished) {
        clearInterval(stepInterval);
        return;
      }
      progress += Math.floor(Math.random() * 8) + 4;
      if (progress >= 100) {
        progress = 100;
        clearInterval(stepInterval);
        completeIntro();
      } else {
        if (introProgressFill) introProgressFill.style.width = `${progress}%`;
        if (introCounter) introCounter.textContent = `${progress}%`;
        const currentMsg = statusMessages.slice().reverse().find((s) => progress >= s.at);
        if (currentMsg && introStatusText) {
          introStatusText.textContent = currentMsg.msg;
        }
      }
    }, 28);

    introCurtain.addEventListener('click', () => {
      clearInterval(stepInterval);
      completeIntro();
    });
  } else {
    if (introCurtain) introCurtain.style.display = 'none';
    triggerHeroEntrance();
  }

  /* ─── 0a. CURSOR GLOW INTERACTION ─────────────────────────────── */
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && !prefersReducedMotion) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let active = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!active) {
        cursorGlow.style.opacity = '1';
        active = true;
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
      active = false;
    });

    const renderCursorGlow = () => {
      currentX += (mouseX - currentX) * 0.14;
      currentY += (mouseY - currentY) * 0.14;
      cursorGlow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(renderCursorGlow);
    };
    renderCursorGlow();
  }

  /* ─── 0b. NAVBAR SCROLL GLASSMORPHISM ───────────────────────────── */
  if (globalNav) {
    const handleNavScroll = () => {
      if (window.scrollY > 30) {
        globalNav.classList.add('scrolled');
      } else {
        globalNav.classList.remove('scrolled');
      }
    };
    handleNavScroll();
    window.addEventListener('scroll', handleNavScroll, { passive: true });
  }

  /* ─── 0d. WORD-BY-WORD HEADLINE REVEAL ──────────────────────────── */
  const setupWordReveal = () => {
    if (prefersReducedMotion) return;
    const titleElements = document.querySelectorAll('.section-title');
    titleElements.forEach((title) => {
      const words = title.innerText.trim().split(/\s+/);
      title.innerHTML = words
        .map((w) => `<span class="word-wrap"><span class="word-inner">${w}</span></span>`)
        .join(' ');
    });

    if ('IntersectionObserver' in window) {
      const wordObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const inners = entry.target.querySelectorAll('.word-inner');
              inners.forEach((inner, i) => {
                setTimeout(() => {
                  inner.classList.add('revealed');
                }, i * 55);
              });
              wordObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
      );
      titleElements.forEach((t) => wordObserver.observe(t));
    } else {
      document.querySelectorAll('.word-inner').forEach((el) => el.classList.add('revealed'));
    }
  };
  setupWordReveal();

  /* ─── 0e. MULTI-TIER SCROLL-DRIVEN PARALLAX (0.3x, 0.6x, 1.0x) ──── */
  if (!prefersReducedMotion) {
    const parallaxElements = document.querySelectorAll(
      '[data-parallax-speed], .case-mockup-frame, .game-canvas-wrapper'
    );
    const onScrollParallax = () => {
      const vh = window.innerHeight;
      parallaxElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < vh && rect.bottom > 0) {
          if (el.classList.contains('unmask-reveal') && !el.classList.contains('in-view')) {
            return;
          }
          const speed = parseFloat(el.dataset.parallaxSpeed) || 0.35;
          const progress = (rect.top + rect.height / 2 - vh / 2) / (vh / 2);
          const offsetY = progress * -32 * speed;
          el.style.transform = `translate3d(0, ${offsetY.toFixed(1)}px, 0)`;
        }
      });
    };
    window.addEventListener('scroll', onScrollParallax, { passive: true });
  }

  /* ─── 0f. TEXT SCRAMBLE REVEAL ──────────────────────────────────── */
  const scrambleTargets = document.querySelectorAll('[data-scramble]');
  if (scrambleTargets.length && !prefersReducedMotion) {
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&';
    const scrambleEl = (el) => {
      const target = el.dataset.scramble;
      const len = target.length;
      let frame = 0;
      const totalFrames = len * 3.5;

      const tick = () => {
        let output = '';
        for (let i = 0; i < len; i++) {
          if (frame > i * 3) {
            output += target[i];
          } else {
            output += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }
        el.textContent = output;
        frame++;
        if (frame <= totalFrames) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = target;
        }
      };

      setTimeout(() => requestAnimationFrame(tick), 400);
    };

    scrambleTargets.forEach(scrambleEl);
  }

  /* ─── 0g. NUMBER COUNTER ANIMATION ──────────────────────────────── */
  const counterEls = document.querySelectorAll('[data-count-to]');
  if (counterEls.length && 'IntersectionObserver' in window) {
    const animateCounter = (el) => {
      const target = parseFloat(el.dataset.countTo);
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();
      const isNeg = target < 0;
      const absTarget = Math.abs(target);

      el.classList.add('counting');

      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = absTarget * eased;
        const display = isNeg ? `-${current.toFixed(decimals)}` : current.toFixed(decimals);
        el.textContent = `${display}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = `${isNeg ? '-' : ''}${absTarget.toFixed(decimals)}${suffix}`;
          el.classList.remove('counting');
        }
      };

      requestAnimationFrame(tick);
    };

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counterEls.forEach((el) => counterObserver.observe(el));
  }


  const addSpotlightEffect = (card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      if (!prefersReducedMotion) {
        const midX = rect.width / 2;
        const midY = rect.height / 2;
        const rotateY = ((x - midX) / midX) * 3.5;
        const rotateX = -((y - midY) / midY) * 3.5;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  };
  document.querySelectorAll('.spotlight-card').forEach(addSpotlightEffect);

  /* ─── 1b. MAGNETIC PRIMARY & SECONDARY CTAs ──────────────────────── */
  if (!prefersReducedMotion) {
    document.querySelectorAll('.apple-btn-primary, .apple-btn-secondary').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px) scale(1.04)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ─── 1c. SCROLL-LINKED REVEAL ANIMATIONS ───────────────────────── */
  const revealTargets = document.querySelectorAll(
    '.apple-card, .case-study-card, .info-box, .estimator-wrapper, .game-chassis, .github-project-card, .section-header'
  );
  revealTargets.forEach((el) => el.classList.add('reveal'));

  const unmaskTargets = document.querySelectorAll('.unmask-reveal');

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
    unmaskTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('in-view'));
    unmaskTargets.forEach((el) => el.classList.add('in-view'));
  }

  /* ─── 1d. LIVE TELEMETRY PILL (nav) ─────────────────────────────── */
  const telemetryClock = document.getElementById('telemetryClock');
  const telemetryLatency = document.getElementById('telemetryLatency');
  if (telemetryClock) {
    const tickClock = () => {
      const now = new Date();
      const hh = String(now.getUTCHours()).padStart(2, '0');
      const mm = String(now.getUTCMinutes()).padStart(2, '0');
      const ss = String(now.getUTCSeconds()).padStart(2, '0');
      telemetryClock.textContent = `${hh}:${mm}:${ss} UTC`;
    };
    tickClock();
    setInterval(tickClock, 1000);
  }
  if (telemetryLatency) {
    setInterval(() => {
      const simulatedMs = 9 + Math.floor(Math.random() * 8);
      telemetryLatency.textContent = `${simulatedMs}ms`;
    }, 2400);
  }

  /* ─── 1e. SCROLL PROGRESS BAR + ACTIVE NAV LINK ─────────────────── */
  const scrollProgressEl = document.getElementById('scrollProgress');
  if (scrollProgressEl) {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
      scrollProgressEl.style.width = `${pct}%`;
    };
    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress);
  }

  const navLinksByHash = {};
  document.querySelectorAll('.nav-link[href^="#"]').forEach((link) => {
    navLinksByHash[link.getAttribute('href').slice(1)] = link;
  });
  const trackedSections = Object.keys(navLinksByHash)
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (trackedSections.length && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = navLinksByHash[entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            Object.values(navLinksByHash).forEach((l) => l.classList.remove('active'));
            link.classList.add('active');
          }
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );
    trackedSections.forEach((section) => navObserver.observe(section));
  }

  /* ─── 2. MOBILE NAVIGATION DRAWER ─────────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });

    mobileMenu.querySelectorAll('[data-close-nav]').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* ─── 3. OPENAI ASTRA 3D SPIRAL GALAXY VORTEX ENGINE ─────────── */
  const canvas = document.getElementById('neuralCoreCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0, isOver: false };
    const heroSection = document.getElementById('hero') || canvas;

    const resizeCanvas = () => {
      const rect = heroSection.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left - width / 2;
      mouse.targetY = e.clientY - rect.top - height / 2;
      mouse.isOver = true;
    });

    heroSection.addEventListener('mouseleave', () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
      mouse.isOver = false;
    });

    // Generate high-performance offscreen particle sprites with glowing halos
    const createSprite = (radius, stops) => {
      const sCanvas = document.createElement('canvas');
      const size = radius * 2;
      sCanvas.width = size;
      sCanvas.height = size;
      const sCtx = sCanvas.getContext('2d');
      const grad = sCtx.createRadialGradient(radius, radius, 0, radius, radius, radius);
      stops.forEach(([offset, color]) => grad.addColorStop(offset, color));
      sCtx.fillStyle = grad;
      sCtx.beginPath();
      sCtx.arc(radius, radius, radius, 0, Math.PI * 2);
      sCtx.fill();
      return sCanvas;
    };

    const sprites = {
      core: createSprite(22, [
        [0.0, 'rgba(255, 255, 255, 1.0)'],
        [0.25, 'rgba(255, 255, 255, 0.95)'],
        [0.55, 'rgba(224, 242, 254, 0.55)'],
        [0.8, 'rgba(56, 189, 248, 0.20)'],
        [1.0, 'rgba(0, 0, 0, 0)']
      ]),
      white: createSprite(16, [
        [0.0, 'rgba(255, 255, 255, 1.0)'],
        [0.3, 'rgba(255, 255, 255, 0.85)'],
        [0.6, 'rgba(240, 249, 255, 0.35)'],
        [1.0, 'rgba(0, 0, 0, 0)']
      ]),
      cyan: createSprite(18, [
        [0.0, 'rgba(255, 255, 255, 1.0)'],
        [0.25, 'rgba(103, 232, 249, 0.95)'],
        [0.6, 'rgba(56, 189, 248, 0.45)'],
        [0.85, 'rgba(14, 165, 233, 0.15)'],
        [1.0, 'rgba(0, 0, 0, 0)']
      ]),
      amber: createSprite(18, [
        [0.0, 'rgba(255, 255, 255, 1.0)'],
        [0.25, 'rgba(254, 215, 170, 0.95)'],
        [0.6, 'rgba(245, 158, 11, 0.50)'],
        [0.85, 'rgba(217, 119, 6, 0.15)'],
        [1.0, 'rgba(0, 0, 0, 0)']
      ]),
      dust: createSprite(8, [
        [0.0, 'rgba(255, 255, 255, 0.85)'],
        [0.45, 'rgba(200, 225, 255, 0.35)'],
        [1.0, 'rgba(0, 0, 0, 0)']
      ])
    };

    // Build the 3D Logarithmic Spiral Galaxy Particle System
    const totalStars = 2200;
    const galaxyStars = [];
    const numArms = 2;
    const maxRadius = 390;

    for (let i = 0; i < totalStars; i++) {
      const isCore = i < 460;
      if (isCore) {
        // High density central galactic core
        const r = 58 * Math.pow(Math.random(), 1.6);
        const theta = Math.random() * Math.PI * 2;
        const y = (Math.random() - 0.5) * 26 * (1 - r / 60);
        let sprite = sprites.core;
        if (Math.random() < 0.25) sprite = sprites.amber;
        else if (Math.random() < 0.25) sprite = sprites.cyan;
        else if (Math.random() < 0.35) sprite = sprites.white;

        galaxyStars.push({
          r,
          baseR: r,
          theta,
          baseTheta: theta,
          spreadX: 0,
          spreadZ: 0,
          y,
          sprite,
          baseSize: 10 + Math.random() * 16,
          isCore: true,
          rotSpeed: 0.0075 / (1 + r * 0.02)
        });
      } else {
        // Spiral Arms with Clustered Stellar Nurseries
        const armIndex = i % numArms;
        const armOffset = armIndex * Math.PI;
        const t = Math.pow(Math.random(), 0.82);
        const r = 36 + (maxRadius - 36) * t;
        const theta = armOffset + 3.25 * Math.pow(t, 0.72) + (Math.random() - 0.5) * 0.28;
        const spreadMag = (10 + 36 * t) * (Math.random() - 0.5);
        const y = (Math.random() - 0.5) * (14 + 32 * t);

        // Color palette based on radial position
        let sprite = sprites.white;
        const roll = Math.random();
        if (t < 0.35) {
          sprite = roll < 0.45 ? sprites.amber : (roll < 0.75 ? sprites.white : sprites.cyan);
        } else {
          sprite = roll < 0.52 ? sprites.cyan : (roll < 0.82 ? sprites.white : (roll < 0.94 ? sprites.amber : sprites.dust));
        }

        const baseSize = roll < 0.08 ? 16 + Math.random() * 12 : (roll < 0.5 ? 8 + Math.random() * 9 : 4 + Math.random() * 6);

        galaxyStars.push({
          r,
          baseR: r,
          theta,
          baseTheta: theta,
          spreadX: spreadMag * Math.cos(theta + Math.PI / 2),
          spreadZ: spreadMag * Math.sin(theta + Math.PI / 2),
          y,
          sprite,
          baseSize,
          isCore: false,
          rotSpeed: 0.0048 / (1 + r * 0.0075)
        });
      }
    }

    // Distant Deep-Space Background Stars
    const bgStars = [];
    for (let i = 0; i < 180; i++) {
      bgStars.push({
        x: (Math.random() - 0.5) * 1600,
        y: (Math.random() - 0.5) * 1000,
        size: 1 + Math.random() * 2.2,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.02 + Math.random() * 0.03,
        baseAlpha: 0.25 + Math.random() * 0.65
      });
    }

    // Supernova energy shockwaves
    const ripples = [];
    heroSection.addEventListener('click', (e) => {
      if (e.target.closest('a, button')) return;
      ripples.push({ r: 6, maxR: 480, alpha: 1.0, speed: 12 });
    });
    triggerNeuralSurge = () => {
      ripples.push({ r: 6, maxR: 480, alpha: 1.0, speed: 12 });
    };

    let heroCanvasInView = true;
    if ('IntersectionObserver' in window) {
      const heroObserver = new IntersectionObserver(
        (entries) => { heroCanvasInView = entries[0].isIntersecting; },
        { threshold: 0 }
      );
      heroObserver.observe(canvas);
    }

    // Camera angles & tilt
    let currentTiltX = 0;
    let currentTiltY = 0;
    const basePitch = 0.98; // ~56 degrees tilt
    const baseRoll = -0.22; // ~-13 degrees roll

    const renderGalaxy = () => {
      requestAnimationFrame(renderGalaxy);
      if (!width || !height || !heroCanvasInView) return;

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse tilt interpolation
      currentTiltX += ((mouse.targetX / width) * 0.45 - currentTiltX) * 0.05;
      currentTiltY += ((mouse.targetY / height) * 0.35 - currentTiltY) * 0.05;

      const pitch = basePitch + currentTiltY;
      const roll = baseRoll + currentTiltX;
      const cosB = Math.cos(pitch);
      const sinB = Math.sin(pitch);
      const cosG = Math.cos(roll);
      const sinG = Math.sin(roll);

      const centerX = width / 2;
      const centerY = height / 2;
      const responsiveScale = Math.min(1.25, Math.min(width, height) / 640);
      const fov = 520;
      const cameraZ = 560;

      // 1. Draw Distant Background Starfield
      ctx.fillStyle = '#ffffff';
      bgStars.forEach((star) => {
        star.twinklePhase += star.twinkleSpeed;
        const alpha = Math.max(0.1, Math.min(1, star.baseAlpha + Math.sin(star.twinklePhase) * 0.3));
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(centerX + star.x * responsiveScale, centerY + star.y * responsiveScale, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // Switch to additive blending for brilliant stellar luminescence
      ctx.globalCompositeOperation = 'lighter';

      // 2. Draw Radiant Galactic Core Bloom
      const coreRadius = 210 * responsiveScale;
      const coreBloom = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreRadius);
      coreBloom.addColorStop(0.0, 'rgba(255, 255, 255, 0.95)');
      coreBloom.addColorStop(0.14, 'rgba(255, 255, 255, 0.85)');
      coreBloom.addColorStop(0.35, 'rgba(224, 242, 254, 0.50)');
      coreBloom.addColorStop(0.60, 'rgba(56, 189, 248, 0.22)');
      coreBloom.addColorStop(0.82, 'rgba(245, 158, 11, 0.08)');
      coreBloom.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = coreBloom;
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
      ctx.fill();

      // 3. Render and Update Expanding Energy Supernova Shockwaves
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += rp.speed;
        rp.alpha *= 0.96;
        if (rp.alpha < 0.02 || rp.r > rp.maxR * responsiveScale) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(103, 232, 249, ${rp.alpha * 0.7})`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, rp.r, rp.r * 0.58, roll, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = `rgba(255, 255, 255, ${rp.alpha * 0.9})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // 4. Update and Project 3D Galaxy Particles
      const projected = [];
      const len = galaxyStars.length;

      for (let i = 0; i < len; i++) {
        const p = galaxyStars[i];

        // Differential rotation: inner stars orbit faster
        p.theta += p.rotSpeed;

        // Position on disc plane
        const px = (p.r * Math.cos(p.theta) + p.spreadX) * responsiveScale;
        const pz = (p.r * Math.sin(p.theta) + p.spreadZ) * responsiveScale;
        const py = p.y * responsiveScale;

        // 3D Pitch tilt (around X)
        const y2 = py * cosB - pz * sinB;
        const z2 = pz * cosB + py * sinB;

        // 3D Roll tilt (around Z)
        const x3 = px * cosG - y2 * sinG;
        const y3 = y2 * cosG + px * sinG;
        const z3 = z2;

        // Camera perspective projection
        const depth = z3 + cameraZ;
        const scale = fov / (fov + depth);
        const screenX = centerX + x3 * scale;
        const screenY = centerY + y3 * scale;

        projected.push({
          x: screenX,
          y: screenY,
          z: depth,
          scale,
          sprite: p.sprite,
          size: p.baseSize * scale * responsiveScale
        });
      }

      // Depth sort (render farther stars first)
      projected.sort((a, b) => b.z - a.z);

      // 5. Draw All Stars Using Offscreen Sprites
      const pLen = projected.length;
      for (let i = 0; i < pLen; i++) {
        const pt = projected[i];
        const s = pt.size;
        ctx.drawImage(pt.sprite, pt.x - s / 2, pt.y - s / 2, s, s);
      }

      // Reset composite operation
      ctx.globalCompositeOperation = 'source-over';
    };

    renderGalaxy();
  }

  /* ─── 4. HANDS-ON DEMO: MULTI-AGENT STEP SIMULATOR ─────────────── */
  const btnRunAgentDemo = document.getElementById('btnRunAgentDemo');
  const agentStepsFlow = document.getElementById('agentStepsFlow');

  if (btnRunAgentDemo && agentStepsFlow) {
    const simulationSteps = [
      {
        badge: 'INGEST',
        class: 'running',
        text: 'Orchestrator ingests the task and initializes a LangGraph state machine for EU-West telemetry.'
      },
      {
        badge: 'VECTOR DB QUERY',
        class: 'running',
        text: 'Queries a vector database for similar historical cost-variance patterns.'
      },
      {
        badge: 'LLAMA 3 INFERENCE',
        class: 'running',
        text: 'Llama 3 reasons over the retrieved context to identify likely root causes.'
      },
      {
        badge: 'TOOL CALL',
        class: 'running',
        text: 'Agent invokes a remediation tool call and drafts a pull request for review.'
      },
      {
        badge: 'VERIFIED OUTPUT',
        class: 'done',
        text: 'Output verified and handed back with a human-readable audit trail.'
      }
    ];

    let isRunning = false;
    btnRunAgentDemo.addEventListener('click', () => {
      if (isRunning) return;
      isRunning = true;
      btnRunAgentDemo.disabled = true;
      btnRunAgentDemo.querySelector('span').textContent = 'Executing...';
      agentStepsFlow.innerHTML = '';

      simulationSteps.forEach((step, idx) => {
        setTimeout(() => {
          const stepEl = document.createElement('div');
          stepEl.className = 'console-step';
          stepEl.innerHTML = `
            <span class="step-badge ${step.class}">${step.badge}</span>
            <span class="step-text">${step.text}</span>
          `;
          agentStepsFlow.appendChild(stepEl);

          if (idx === simulationSteps.length - 1) {
            isRunning = false;
            btnRunAgentDemo.disabled = false;
            btnRunAgentDemo.querySelector('span').textContent = 'Simulate Again';
          }
        }, (idx + 1) * 700);
      });
    });
  }

  /* ─── 5. CLOUD COST DYNAMIC ROI CALCULATOR ─────────────────────── */
  const spendSlider = document.getElementById('spendSlider');
  const spendDisplay = document.getElementById('spendDisplay');
  const savingsDisplay = document.getElementById('savingsDisplay');
  const hoursDisplay = document.getElementById('hoursDisplay');

  if (spendSlider && spendDisplay && savingsDisplay && hoursDisplay) {
    const updateROI = () => {
      const val = parseInt(spendSlider.value, 10);
      spendDisplay.textContent = `$${val.toLocaleString()} / mo`;
      // Calculated 60% manual effort & anomaly reduction
      const annualSavings = Math.round(val * 12 * 0.60);
      savingsDisplay.textContent = `$${annualSavings.toLocaleString()}`;
      const hoursSaved = Math.round(val / 310);
      hoursDisplay.textContent = `${hoursSaved} Hours`;
    };

    spendSlider.addEventListener('input', updateROI);
    updateROI();
  }

  /* ─── 6. INTERACTIVE FREELANCE SCOPE & COST ESTIMATOR ──────────── */
  const domainOptions = document.querySelectorAll('#domainOptions .config-chip');
  const scopeOptions = document.querySelectorAll('#scopeOptions .config-chip');
  const deliverablesOptions = document.querySelectorAll('#deliverablesOptions .deliv-tag');

  const sumArch = document.getElementById('sumArch');
  const sumTimeline = document.getElementById('sumTimeline');
  const projectScopeSelected = document.getElementById('projectScopeSelected');

  let currentDomain = 'Autonomous AI Agents';
  let currentScope = 'Proof-of-Concept / Sprint MVP';
  let baseWeeks = 2;
  let multiplier = 1;

  const archMap = {
    agent: 'LangGraph Multi-Agent + Llama 3 + Hybrid RAG + FastAPI',
    vision: 'OpenCV + MediaPipe 33-Landmark Pose Stream + React Overlay',
    predict: 'Prophet + XGBoost Ensemble + Automated FinOps Risk Desk',
    fullstack: 'Autonomous Agent Engine + FastAPI + React Interactive Dashboard'
  };

  const updateEstimatorSummary = () => {
    const totalWeeksMin = Math.max(1, Math.round(baseWeeks * multiplier));
    const totalWeeksMax = totalWeeksMin + 1;
    const timelineStr = `${totalWeeksMin} – ${totalWeeksMax} Weeks`;

    if (sumTimeline) sumTimeline.textContent = timelineStr;
    const combinedScope = `${currentDomain} — ${currentScope} (${timelineStr})`;
    if (projectScopeSelected) {
      projectScopeSelected.value = combinedScope;
    }
  };

  // Domain selection
  domainOptions.forEach((chip) => {
    chip.addEventListener('click', () => {
      domainOptions.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      const domainKey = chip.dataset.domain;
      currentDomain = chip.querySelector('.chip-title').textContent;
      baseWeeks = parseInt(chip.dataset.time, 10) || 2;
      if (sumArch && archMap[domainKey]) {
        sumArch.textContent = archMap[domainKey];
      }
      updateEstimatorSummary();
    });
  });

  // Scope selection
  scopeOptions.forEach((chip) => {
    chip.addEventListener('click', () => {
      scopeOptions.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      currentScope = chip.querySelector('.chip-title').textContent;
      multiplier = parseFloat(chip.dataset.multiplier) || 1;
      updateEstimatorSummary();
    });
  });

  // Deliverables toggle
  deliverablesOptions.forEach((tag) => {
    tag.addEventListener('click', () => {
      tag.classList.toggle('active');
    });
  });

  updateEstimatorSummary();

  /* ─── 7. NEURAL AGENT SPEED RUN (APPLE ARCADE MINI-GAME) ────────── */
  const gameCanvas = document.getElementById('agentGameCanvas');
  const gameScoreEl = document.getElementById('gameScore');
  const gameHealthFill = document.getElementById('gameHealthFill');
  const gameHighScoreEl = document.getElementById('gameHighScore');
  const gameActionBtn = document.getElementById('gameActionBtn');
  const gameActionBtnText = document.getElementById('gameActionBtnText');
  const gameOverOverlay = document.getElementById('gameOverOverlay');
  const overlayMsg = document.getElementById('overlayMsg');
  const btnRestartGame = document.getElementById('btnRestartGame');

  if (gameCanvas) {
    const gCtx = gameCanvas.getContext('2d');
    let gWidth = 0;
    let gHeight = 0;

    const resizeGame = () => {
      const rect = gameCanvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      gWidth = rect.width;
      gHeight = rect.height;
      gameCanvas.width = gWidth * dpr;
      gameCanvas.height = gHeight * dpr;
      gCtx.scale(dpr, dpr);
    };

    resizeGame();
    window.addEventListener('resize', resizeGame);

    let isPlaying = false;
    let score = 0;
    let health = 100;
    let highScore = parseInt(localStorage.getItem('kd_game_highscore') || '0', 10);
    if (gameHighScoreEl) gameHighScoreEl.textContent = highScore;

    // Player Agent
    const agent = {
      x: 100,
      y: 190,
      radius: 12,
      vx: 0,
      vy: 0,
      speed: 4.8,
      trail: []
    };

    // Items
    let tokens = [];
    let anomalies = [];
    let spawnTimer = 0;

    const keys = {};
    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', ' '].includes(e.key)) {
        keys[e.key.toLowerCase()] = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (keys[e.key.toLowerCase()] !== undefined) {
        keys[e.key.toLowerCase()] = false;
      }
    });

    // Touch / Drag controls for mobile
    gameCanvas.addEventListener('touchstart', (e) => {
      if (!isPlaying && e.touches.length > 0) {
        startNewGame();
      }
    }, { passive: true });

    gameCanvas.addEventListener('touchmove', (e) => {
      if (!isPlaying || e.touches.length === 0) return;
      const rect = gameCanvas.getBoundingClientRect();
      const tx = e.touches[0].clientX - rect.left;
      const ty = e.touches[0].clientY - rect.top;
      agent.x += (tx - agent.x) * 0.25;
      agent.y += (ty - agent.y) * 0.25;
      e.preventDefault();
    }, { passive: false });

    const startNewGame = () => {
      score = 0;
      health = 100;
      tokens = [];
      anomalies = [];
      agent.x = 80;
      agent.y = gHeight / 2;
      agent.trail = [];
      isPlaying = true;
      if (gameOverOverlay) gameOverOverlay.style.display = 'none';
      if (gameScoreEl) gameScoreEl.textContent = '0';
      if (gameHealthFill) {
        gameHealthFill.style.width = '100%';
        gameHealthFill.style.background = 'var(--aura-green)';
      }
      if (gameActionBtnText) gameActionBtnText.textContent = 'Active...';
    };

    const endGame = () => {
      isPlaying = false;
      if (score > highScore) {
        highScore = score;
        localStorage.setItem('kd_game_highscore', highScore);
        if (gameHighScoreEl) gameHighScoreEl.textContent = highScore;
      }
      if (overlayMsg) {
        overlayMsg.innerHTML = `You processed <strong>${score}</strong> clean data tokens. High score: <strong>${highScore}</strong>.`;
      }
      if (gameOverOverlay) gameOverOverlay.style.display = 'flex';
      if (gameActionBtnText) gameActionBtnText.textContent = 'Restart Run';
    };

    if (gameActionBtn) {
      gameActionBtn.addEventListener('click', () => {
        startNewGame();
      });
    }

    if (btnRestartGame) {
      btnRestartGame.addEventListener('click', () => {
        startNewGame();
      });
    }

    let gameCanvasInView = true;
    if ('IntersectionObserver' in window) {
      const gameObserver = new IntersectionObserver(
        (entries) => { gameCanvasInView = entries[0].isIntersecting; },
        { threshold: 0 }
      );
      gameObserver.observe(gameCanvas);
    }

    // Game loop
    const gameLoop = () => {
      requestAnimationFrame(gameLoop);
      if (!gWidth || !gHeight || !gameCanvasInView) return;

      // Dark background
      gCtx.fillStyle = '#050508';
      gCtx.fillRect(0, 0, gWidth, gHeight);

      // Subtle background grid
      gCtx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      gCtx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < gWidth; x += gridSize) {
        gCtx.beginPath();
        gCtx.moveTo(x, 0);
        gCtx.lineTo(x, gHeight);
        gCtx.stroke();
      }
      for (let y = 0; y < gHeight; y += gridSize) {
        gCtx.beginPath();
        gCtx.moveTo(0, y);
        gCtx.lineTo(gWidth, y);
        gCtx.stroke();
      }

      if (isPlaying) {
        // Player movement
        let moveX = 0;
        let moveY = 0;
        if (keys['arrowup'] || keys['w']) moveY -= 1;
        if (keys['arrowdown'] || keys['s']) moveY += 1;
        if (keys['arrowleft'] || keys['a']) moveX -= 1;
        if (keys['arrowright'] || keys['d']) moveX += 1;

        if (moveX !== 0 && moveY !== 0) {
          moveX *= 0.7071;
          moveY *= 0.7071;
        }

        agent.x += moveX * agent.speed;
        agent.y += moveY * agent.speed;

        // Boundaries
        agent.x = Math.max(agent.radius, Math.min(gWidth - agent.radius, agent.x));
        agent.y = Math.max(agent.radius, Math.min(gHeight - agent.radius, agent.y));

        // Trail
        agent.trail.push({ x: agent.x, y: agent.y });
        if (agent.trail.length > 8) agent.trail.shift();

        // Spawn items
        spawnTimer++;
        if (spawnTimer % 45 === 0) {
          // Token (Green clean data)
          tokens.push({
            x: gWidth + 20,
            y: Math.random() * (gHeight - 40) + 20,
            radius: 8,
            speed: 2.8 + Math.random() * 1.5
          });
        }
        if (spawnTimer % 80 === 0) {
          // Anomaly (Red hallucination glitch)
          anomalies.push({
            x: gWidth + 20,
            y: Math.random() * (gHeight - 40) + 20,
            radius: 12,
            speed: 3.2 + Math.random() * 2
          });
        }
      }

      // Update & Draw Tokens
      tokens.forEach((t, i) => {
        if (isPlaying) t.x -= t.speed;
        gCtx.fillStyle = '#10b981';
        gCtx.shadowColor = '#10b981';
        gCtx.shadowBlur = 10;
        gCtx.beginPath();
        gCtx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
        gCtx.fill();

        // Collision with agent
        if (isPlaying) {
          const dist = Math.hypot(agent.x - t.x, agent.y - t.y);
          if (dist < agent.radius + t.radius) {
            tokens.splice(i, 1);
            score += 10;
            if (gameScoreEl) gameScoreEl.textContent = score;
          }
        }
      });

      // Update & Draw Anomalies
      anomalies.forEach((a, i) => {
        if (isPlaying) a.x -= a.speed;
        gCtx.fillStyle = '#ff4455';
        gCtx.shadowColor = '#ff4455';
        gCtx.shadowBlur = 12;
        gCtx.beginPath();
        gCtx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
        gCtx.fill();

        // Collision with agent
        if (isPlaying) {
          const dist = Math.hypot(agent.x - a.x, agent.y - a.y);
          if (dist < agent.radius + a.radius) {
            anomalies.splice(i, 1);
            health = Math.max(0, health - 25);
            if (gameHealthFill) {
              gameHealthFill.style.width = `${health}%`;
              if (health < 40) gameHealthFill.style.background = '#ff4455';
            }
            if (health <= 0) {
              endGame();
            }
          }
        }
      });

      // Cleanup offscreen items
      tokens = tokens.filter((t) => t.x > -30);
      anomalies = anomalies.filter((a) => a.x > -30);

      // Draw Agent Trail
      gCtx.shadowBlur = 0;
      agent.trail.forEach((pt, idx) => {
        const alpha = (idx + 1) / agent.trail.length * 0.4;
        gCtx.fillStyle = `rgba(16, 163, 127, ${alpha})`;
        gCtx.beginPath();
        gCtx.arc(pt.x, pt.y, agent.radius * 0.7, 0, Math.PI * 2);
        gCtx.fill();
      });

      // Draw Agent Core
      gCtx.fillStyle = '#ffffff';
      gCtx.shadowColor = '#10a37f';
      gCtx.shadowBlur = 14;
      gCtx.beginPath();
      gCtx.arc(agent.x, agent.y, agent.radius, 0, Math.PI * 2);
      gCtx.fill();

      // Outer Agent Ring
      gCtx.strokeStyle = '#10a37f';
      gCtx.lineWidth = 2;
      gCtx.beginPath();
      gCtx.arc(agent.x, agent.y, agent.radius + 4, 0, Math.PI * 2);
      gCtx.stroke();
      gCtx.shadowBlur = 0;
    };

    gameLoop();
  }

  /* ─── 7b. POSE ESTIMATION PLAYGROUND (draggable joint-angle demo) ── */
  const poseSvg = document.getElementById('poseSvg');
  if (poseSvg) {
    const shoulderEl = document.getElementById('poseShoulder');
    const elbowEl = document.getElementById('poseElbow');
    const wristEl = document.getElementById('poseWrist');
    const upperArmEl = document.getElementById('poseUpperArm');
    const forearmEl = document.getElementById('poseForearm');
    const angleLabelEl = document.getElementById('poseAngleLabel');
    const angleValEl = document.getElementById('poseAngleVal');
    const repValEl = document.getElementById('poseRepVal');
    const exerciseButtons = document.querySelectorAll('.pose-exercise-btn');

    // Preset joint layouts — shoulder/elbow/wrist doubles as hip/knee/ankle for the squat.
    const presets = {
      curl: { shoulder: { x: 60, y: 60 }, elbow: { x: 120, y: 90 }, wrist: { x: 90, y: 150 } },
      squat: { shoulder: { x: 90, y: 40 }, elbow: { x: 100, y: 120 }, wrist: { x: 90, y: 195 } }
    };

    let joints = {
      shoulder: { ...presets.curl.shoulder },
      elbow: { ...presets.curl.elbow },
      wrist: { ...presets.curl.wrist }
    };
    let repPhase = 'down';
    let repCount = 0;
    let draggingKey = null;

    const angleAt = (a, b, c) => {
      const v1 = { x: a.x - b.x, y: a.y - b.y };
      const v2 = { x: c.x - b.x, y: c.y - b.y };
      const mag1 = Math.hypot(v1.x, v1.y) || 1;
      const mag2 = Math.hypot(v2.x, v2.y) || 1;
      const cos = Math.max(-1, Math.min(1, (v1.x * v2.x + v1.y * v2.y) / (mag1 * mag2)));
      return Math.acos(cos) * (180 / Math.PI);
    };

    const svgPoint = (clientX, clientY) => {
      const pt = poseSvg.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      const ctm = poseSvg.getScreenCTM();
      if (!ctm) return { x: 0, y: 0 };
      const transformed = pt.matrixTransform(ctm.inverse());
      return { x: transformed.x, y: transformed.y };
    };

    const renderPose = () => {
      shoulderEl.setAttribute('cx', joints.shoulder.x);
      shoulderEl.setAttribute('cy', joints.shoulder.y);
      elbowEl.setAttribute('cx', joints.elbow.x);
      elbowEl.setAttribute('cy', joints.elbow.y);
      wristEl.setAttribute('cx', joints.wrist.x);
      wristEl.setAttribute('cy', joints.wrist.y);

      upperArmEl.setAttribute('x1', joints.shoulder.x);
      upperArmEl.setAttribute('y1', joints.shoulder.y);
      upperArmEl.setAttribute('x2', joints.elbow.x);
      upperArmEl.setAttribute('y2', joints.elbow.y);

      forearmEl.setAttribute('x1', joints.elbow.x);
      forearmEl.setAttribute('y1', joints.elbow.y);
      forearmEl.setAttribute('x2', joints.wrist.x);
      forearmEl.setAttribute('y2', joints.wrist.y);

      const angle = angleAt(joints.shoulder, joints.elbow, joints.wrist);
      angleLabelEl.setAttribute('x', joints.elbow.x + 12);
      angleLabelEl.setAttribute('y', joints.elbow.y - 4);
      angleLabelEl.textContent = `${Math.round(angle)}°`;
      if (angleValEl) angleValEl.textContent = `${Math.round(angle)}°`;
      const angleText = `${Math.round(angle)} degrees`;
      elbowEl.setAttribute('aria-valuetext', angleText);
      wristEl.setAttribute('aria-valuetext', angleText);

      // Simple down→up→down rep detection, mirroring a real rep-counter's threshold logic.
      if (angle < 60 && repPhase !== 'up') {
        repPhase = 'up';
      } else if (angle > 150 && repPhase === 'up') {
        repPhase = 'down';
        repCount += 1;
        if (repValEl) repValEl.textContent = String(repCount);
      }
    };

    const startDrag = (key) => (e) => {
      draggingKey = key;
      e.preventDefault();
    };

    elbowEl.addEventListener('pointerdown', startDrag('elbow'));
    wristEl.addEventListener('pointerdown', startDrag('wrist'));

    // Keyboard alternative to dragging: focus a joint (Tab), then use arrow keys.
    const nudgeJoint = (key) => (e) => {
      const step = e.shiftKey ? 12 : 4;
      let handled = true;
      if (e.key === 'ArrowUp') joints[key].y -= step;
      else if (e.key === 'ArrowDown') joints[key].y += step;
      else if (e.key === 'ArrowLeft') joints[key].x -= step;
      else if (e.key === 'ArrowRight') joints[key].x += step;
      else handled = false;
      if (handled) {
        e.preventDefault();
        renderPose();
      }
    };
    elbowEl.addEventListener('keydown', nudgeJoint('elbow'));
    wristEl.addEventListener('keydown', nudgeJoint('wrist'));

    window.addEventListener('pointermove', (e) => {
      if (!draggingKey) return;
      joints[draggingKey] = svgPoint(e.clientX, e.clientY);
      renderPose();
    });
    window.addEventListener('pointerup', () => {
      draggingKey = null;
    });

    exerciseButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        exerciseButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const preset = presets[btn.dataset.exercise] || presets.curl;
        joints = {
          shoulder: { ...preset.shoulder },
          elbow: { ...preset.elbow },
          wrist: { ...preset.wrist }
        };
        repPhase = 'down';
        repCount = 0;
        if (repValEl) repValEl.textContent = '0';
        renderPose();
      });
    });

    renderPose();
  }

  /* ─── 8. EXECUTIVE CONTACT FORM SUBMISSION ─────────────────────── */
  const appleContactForm = document.getElementById('appleContactForm');
  const submitBtnText = document.getElementById('submitBtnText');
  const btnSubmitProposal = document.getElementById('btnSubmitProposal');
  const formStatusMsg = document.getElementById('formStatusMsg');

  const CHECK_ICON_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  const ERROR_ICON_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  const setStatusMsg = (content, kind, isHtml = false) => {
    formStatusMsg.innerHTML = '';
    formStatusMsg.className = 'form-feedback-msg';
    if (!content) return;
    formStatusMsg.classList.add(kind);
    const icon = document.createElement('span');
    icon.className = 'status-icon';
    icon.innerHTML = kind === 'success' ? CHECK_ICON_SVG : ERROR_ICON_SVG;
    const label = document.createElement('span');
    if (isHtml) {
      label.innerHTML = content;
    } else {
      label.textContent = content;
    }
    formStatusMsg.appendChild(icon);
    formStatusMsg.appendChild(label);
  };

  if (appleContactForm) {
    const nameInput = document.getElementById('clientName');
    const emailInput = document.getElementById('clientEmail');
    const scopeInput = document.getElementById('projectScopeSelected');
    const messageInput = document.getElementById('clientMessage');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');

    // Field-level validators, reused for both live (on blur) and on-submit validation.
    const validators = [
      {
        input: nameInput,
        errorEl: nameError,
        check: (v) => v.trim().length > 0,
        message: 'Please enter your name or company.'
      },
      {
        input: emailInput,
        errorEl: emailError,
        check: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
        message: 'Please provide a valid work email address.'
      },
      {
        input: messageInput,
        errorEl: messageError,
        check: (v) => v.trim().length > 0,
        message: 'Please share a brief overview of your project requirements.'
      }
    ];

    const validateOne = (v) => {
      const ok = v.check(v.input.value);
      v.errorEl.textContent = ok ? '' : v.message;
      v.input.classList.toggle('invalid', !ok);
      v.input.classList.toggle('valid', ok && v.input.value.trim().length > 0);
      return ok;
    };

    validators.forEach((v) => {
      v.input.addEventListener('blur', () => validateOne(v));
      v.input.addEventListener('input', () => {
        // Once a field has been marked invalid, clear that state as soon as it becomes valid.
        if (v.input.classList.contains('invalid') && v.check(v.input.value)) {
          validateOne(v);
        }
      });
    });

    appleContactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      setStatusMsg('', null);

      const isValid = validators.map(validateOne).every(Boolean);
      if (!isValid) return;

      if (submitBtnText) {
        submitBtnText.innerHTML = '';
        const spinner = document.createElement('span');
        spinner.className = 'btn-spinner';
        const label = document.createElement('span');
        label.textContent = 'Transmitting...';
        submitBtnText.appendChild(spinner);
        submitBtnText.appendChild(label);
      }
      if (btnSubmitProposal) btnSubmitProposal.disabled = true;

      const senderName = nameInput.value.trim();
      const senderEmail = emailInput.value.trim();
      const chosenScope = scopeInput ? scopeInput.value.trim() : 'Project Inquiry';
      const userBrief = messageInput.value.trim();
      const fullMessage = `[CONFIGURED SCOPE: ${chosenScope}]\n\n${userBrief}`;

      const openEmailClientFallback = () => {
        const subject = encodeURIComponent(`[Portfolio Inquiry] ${senderName} — ${chosenScope}`);
        const body = encodeURIComponent(
          `Hi Kunal,\n\nName: ${senderName}\nEmail: ${senderEmail}\nScope: ${chosenScope}\n\nProject Requirements:\n${userBrief}\n`
        );
        const mailtoUrl = `mailto:deshmukhkunal556@gmail.com?subject=${subject}&body=${body}`;

        setStatusMsg(
          `Inquiry prepared! Launching your mail client... If it doesn't open automatically, <a href="${mailtoUrl}" style="color:var(--apple-accent,#2997ff);text-decoration:underline;font-weight:600;">click here to send email</a>.`,
          'success',
          true
        );

        setTimeout(() => {
          window.location.href = mailtoUrl;
        }, 400);
      };

      let sentSuccessfully = false;

      // 1. If running on local server, try the local Node.js /api/contact endpoint
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isLocalhost) {
        try {
          const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: senderName,
              email: senderEmail,
              message: fullMessage
            })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success) {
              sentSuccessfully = true;
            }
          }
        } catch (_) {
          // Fall through to FormSubmit
        }
      }

      // 2. If not local or if local failed (e.g. static hosting on GitHub Pages), dispatch via FormSubmit.co
      if (!sentSuccessfully) {
        try {
          const fsRes = await fetch('https://formsubmit.co/ajax/deshmukhkunal556@gmail.com', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              name: senderName,
              email: senderEmail,
              scope: chosenScope,
              message: userBrief,
              _subject: `[Portfolio Inquiry] ${senderName} — ${chosenScope}`,
              _template: 'table',
              _captcha: 'false'
            })
          });

          const rawText = await fsRes.text();
          let fsData = {};
          try {
            fsData = JSON.parse(rawText);
          } catch (_) {}

          const isOk = fsData.success === true || fsData.success === 'true';
          const isActivationNotice = fsData.message && fsData.message.toLowerCase().includes('activation');

          if (isOk || isActivationNotice) {
            sentSuccessfully = true;
          }
        } catch (_) {
          // Network error or adblocker blocking third-party forms
        }
      }

      // 3. UI feedback
      if (sentSuccessfully) {
        setStatusMsg('Inquiry received successfully! Kunal will respond within 24 hours.', 'success');
        appleContactForm.reset();
        validators.forEach((v) => v.input.classList.remove('invalid', 'valid'));
      } else {
        openEmailClientFallback();
      }

      if (submitBtnText) submitBtnText.textContent = 'Submit Project Inquiry';
      if (btnSubmitProposal) btnSubmitProposal.disabled = false;
    });
  }

  // Auto-focus the name field when a visitor lands on the contact form via any CTA link.
  document.querySelectorAll('a[href="#contact"]').forEach((cta) => {
    cta.addEventListener('click', () => {
      const nameField = document.getElementById('clientName');
      if (!nameField) return;
      setTimeout(() => nameField.focus({ preventScroll: true }), 500);
    });
  });

  /* ─── 9. DYNAMIC CONTENT (from content.json via /api/content) ──── */
  const footerYearEl = document.getElementById('footerYear');
  if (footerYearEl) footerYearEl.textContent = new Date().getFullYear();

  const applyContentData = (data) => {
    const emailEl = document.getElementById('contactEmailDisplay');
    if (emailEl && data.about && data.about.email) {
      emailEl.textContent = data.about.email;
    }

    const phoneEl = document.getElementById('contactPhoneDisplay');
    if (phoneEl && data.about && data.about.phone) {
      phoneEl.textContent = data.about.phone;
      phoneEl.href = `tel:${data.about.phone.replace(/[^\d+]/g, '')}`;
    }

    const locationEl = document.getElementById('contactLocationDisplay');
    if (locationEl && data.social && data.social.location) {
      locationEl.textContent = data.social.location;
    }

    const availabilityEls = [
      document.getElementById('contactAvailabilityDisplay'),
      document.getElementById('footerAvailabilityText'),
    ];
    availabilityEls.forEach((el) => {
      if (el && data.about && data.about.availability) el.textContent = data.about.availability;
    });

    const githubLinks = [
      document.getElementById('socialGithubLink'),
      document.getElementById('footerGithubLink'),
    ];
    githubLinks.forEach((el) => {
      if (el && data.social && data.social.github) el.href = data.social.github;
    });

    const linkedinLinks = [
      document.getElementById('socialLinkedinLink'),
      document.getElementById('footerLinkedinLink'),
    ];
    linkedinLinks.forEach((el) => {
      if (el && data.social && data.social.linkedin) el.href = data.social.linkedin;
    });
  };

  const loadDynamicContent = async () => {
    try {
      const r = await fetch('/api/content');
      if (r.ok) {
        const res = await r.json();
        if (res && res.success && res.data) {
          applyContentData(res.data);
          return;
        }
      }
    } catch (_) {}

    try {
      const rStatic = await fetch('./content.json');
      if (rStatic.ok) {
        const data = await rStatic.json();
        applyContentData(data);
      }
    } catch (_) {}
  };
  loadDynamicContent();

  /* ─── 10. LIVE GITHUB PROJECTS ("More on GitHub" grid) ─────────── */
  const FEATURED_REPO_NAMES = new Set([
    'cloud-cost-forecasting-engine',
    'midc-project-approval-risk-predictor',
  ]);

  const showGithubSkeleton = () => {
    const wrap = document.getElementById('githubMoreProjects');
    const grid = document.getElementById('githubProjectsGrid');
    if (!wrap || !grid) return;
    grid.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const sk = document.createElement('div');
      sk.className = 'github-project-skeleton';
      sk.innerHTML = '<div class="skeleton-line short"></div><div class="skeleton-line tall"></div><div class="skeleton-line"></div><div class="skeleton-line" style="width:80%"></div>';
      grid.appendChild(sk);
    }
    wrap.hidden = false;
  };

  const hideGithubSection = () => {
    const wrap = document.getElementById('githubMoreProjects');
    const grid = document.getElementById('githubProjectsGrid');
    if (grid) grid.innerHTML = '';
    if (wrap) wrap.hidden = true;
  };

  const renderGithubProjects = (projects) => {
    const wrap = document.getElementById('githubMoreProjects');
    const grid = document.getElementById('githubProjectsGrid');
    if (!wrap || !grid) return;

    const extra = projects.filter((p) => p.name && !FEATURED_REPO_NAMES.has(p.name.toLowerCase()));
    if (extra.length === 0) {
      hideGithubSection();
      return;
    }

    grid.innerHTML = '';
    extra.forEach((p) => {
      const card = document.createElement('div');
      card.className = 'apple-card spotlight-card github-project-card';

      const badge = document.createElement('span');
      badge.className = 'card-badge';
      badge.textContent = p.language || 'Code';
      card.appendChild(badge);

      const title = document.createElement('h4');
      title.className = 'github-project-title';
      title.textContent = p.name;
      card.appendChild(title);

      const desc = document.createElement('p');
      desc.className = 'github-project-desc';
      desc.textContent = p.description || '';
      card.appendChild(desc);

      if (typeof p.stars === 'number' && p.stars > 0) {
        const stars = document.createElement('span');
        stars.className = 'github-project-stars';
        stars.textContent = `★ ${p.stars}`;
        card.appendChild(stars);
      }

      const link = document.createElement('a');
      link.href = p.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.className = 'apple-btn-pill';
      const linkLabel = document.createElement('span');
      linkLabel.textContent = 'View Repository';
      const linkArrow = document.createElement('span');
      linkArrow.className = 'btn-arrow';
      linkArrow.textContent = '↗';
      link.appendChild(linkLabel);
      link.appendChild(linkArrow);
      card.appendChild(link);

      grid.appendChild(card);
      addSpotlightEffect(card);
    });

    wrap.hidden = false;
  };

  const loadGithubProjects = async () => {
    showGithubSkeleton();
    try {
      const r = await fetch('/api/projects');
      if (r.ok) {
        const res = await r.json();
        if (res && res.success && Array.isArray(res.projects) && res.source !== 'fallback') {
          renderGithubProjects(res.projects);
          return;
        }
      }
    } catch (_) {}

    try {
      const ghRes = await fetch('https://api.github.com/users/Kunal-1504/repos?per_page=100&sort=updated', {
        headers: { Accept: 'application/vnd.github.v3+json' }
      });
      if (ghRes.ok) {
        const repos = await ghRes.json();
        if (Array.isArray(repos)) {
          const usable = repos
            .filter((r) => !r.fork && r.description && r.description.trim().length > 5)
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            .slice(0, 9)
            .map((r) => ({
              name: r.name,
              description: r.description,
              language: r.language || 'Python',
              stars: r.stargazers_count,
              forks: r.forks_count,
              url: r.html_url
            }));
          if (usable.length > 0) {
            renderGithubProjects(usable);
            return;
          }
        }
      }
    } catch (_) {}

    hideGithubSection();
  };
  loadGithubProjects();

  /* ─── 11. DEVELOPER TERMINAL DRAWER (easter egg) ────────────────── */
  const terminalDrawer = document.getElementById('terminalDrawer');
  const terminalClose = document.getElementById('terminalClose');
  const terminalUptimeEl = document.getElementById('terminalUptime');

  if (terminalDrawer) {
    const sessionStart = performance.now();
    let uptimeInterval = null;

    const openTerminal = () => {
      terminalDrawer.classList.add('open');
      triggerNeuralSurge();
      if (!uptimeInterval) {
        uptimeInterval = setInterval(() => {
          if (terminalUptimeEl) {
            terminalUptimeEl.textContent = `${Math.floor((performance.now() - sessionStart) / 1000)}s`;
          }
        }, 1000);
      }
    };

    const closeTerminal = () => {
      terminalDrawer.classList.remove('open');
    };

    if (terminalClose) terminalClose.addEventListener('click', closeTerminal);

    // Trigger: Shift+A, or typing the word "agent" anywhere on the page.
    let typedBuffer = '';
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && terminalDrawer.classList.contains('open')) {
        closeTerminal();
        return;
      }

      if (e.shiftKey && e.key.toLowerCase() === 'a' && !e.metaKey && !e.ctrlKey) {
        const tag = (e.target && e.target.tagName) || '';
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
          openTerminal();
          return;
        }
      }

      if (e.key.length === 1 && /[a-z]/i.test(e.key)) {
        const tag = (e.target && e.target.tagName) || '';
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        typedBuffer = (typedBuffer + e.key.toLowerCase()).slice(-5);
        if (typedBuffer === 'agent') {
          openTerminal();
          typedBuffer = '';
        }
      }
    });
  }
});
