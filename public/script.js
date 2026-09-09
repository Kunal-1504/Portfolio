/**
 * ═══════════════════════════════════════════════════════════════════
 *  APPLE.COM PRO & APPLE INTELLIGENCE INTERACTIVE ENGINE
 *  Kunal Deshmukh — AI/ML & Agentic Systems Engineer
 * ═══════════════════════════════════════════════════════════════════
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ─── 1. SPOTLIGHT CURSOR HOVER + SUBTLE 3D TILT ───────────────── */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  /* ─── 1b. MAGNETIC PRIMARY CTAs ─────────────────────────────────── */
  if (!prefersReducedMotion) {
    const magneticRadius = 70;
    document.querySelectorAll('.apple-btn-primary, .apple-btn-secondary').forEach((btn) => {
      document.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);

        if (dist < magneticRadius) {
          const pull = (1 - dist / magneticRadius) * 0.35;
          btn.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`;
        } else {
          btn.style.transform = '';
        }
      });
    });
  }

  /* ─── 1c. SCROLL-LINKED REVEAL ANIMATIONS ───────────────────────── */
  const revealTargets = document.querySelectorAll(
    '.apple-card, .case-study-card, .info-box, .estimator-wrapper, .game-chassis, .github-project-card'
  );
  revealTargets.forEach((el) => el.classList.add('reveal'));

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
  } else {
    revealTargets.forEach((el) => el.classList.add('in-view'));
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

  /* ─── 3. HERO INTERACTIVE 3D NEURAL CORE VISUALIZER ───────────── */
  let triggerNeuralSurge = () => {};
  const canvas = document.getElementById('neuralCoreCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0, isOver: false };

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left - width / 2;
      mouse.targetY = e.clientY - rect.top - height / 2;
      mouse.isOver = true;
    });

    canvas.addEventListener('mouseleave', () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
      mouse.isOver = false;
    });

    // Generate 3D Spherical Node Lattice
    const nodeCount = 84;
    const nodes = [];
    const radius = 130;

    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      nodes.push({
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi),
        baseX: radius * Math.cos(theta) * Math.sin(phi),
        baseY: radius * Math.sin(theta) * Math.sin(phi),
        baseZ: radius * Math.cos(phi),
        origX: radius * Math.cos(theta) * Math.sin(phi),
        origY: radius * Math.sin(theta) * Math.sin(phi),
        origZ: radius * Math.cos(phi),
        phase: Math.random() * Math.PI * 2,
        color: ['#6366f1', '#06b6d4', '#ec4899', '#ffffff'][i % 4]
      });
    }

    let angleX = 0;
    let angleY = 0;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let surge = 0; // decays over time — boosted by clicks / easter-egg triggers

    // Expanding energy-ripple rings, spawned on click
    const ripples = [];
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      ripples.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, r: 4, alpha: 0.9 });
      surge = 1;
    });
    triggerNeuralSurge = () => {
      ripples.push({ x: width / 2, y: height / 2, r: 4, alpha: 0.9 });
      surge = 1;
    };

    let heroCanvasInView = true;
    if ('IntersectionObserver' in window) {
      const heroObserver = new IntersectionObserver(
        (entries) => { heroCanvasInView = entries[0].isIntersecting; },
        { threshold: 0 }
      );
      heroObserver.observe(canvas);
    }

    const renderNeuralCore = () => {
      requestAnimationFrame(renderNeuralCore);
      if (!width || !height || !heroCanvasInView) return;

      ctx.clearRect(0, 0, width, height);

      const time = performance.now() * 0.001;

      // Smooth mouse interpolation + velocity (drives the "repel/attract" breathing)
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;
      const velocity = Math.min(1, Math.hypot(mouse.x - prevMouseX, mouse.y - prevMouseY) / 14);
      prevMouseX = mouse.x;
      prevMouseY = mouse.y;

      angleY += 0.006 + mouse.x * 0.00003;
      angleX += 0.004 + mouse.y * 0.00003;
      surge *= 0.94;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      const fov = 340;
      const centerX = width / 2;
      const centerY = height / 2;

      // Harmonic sine-wave drift: each node breathes along its own radial normal,
      // amplified by cursor velocity (repel) and by click/easter-egg surges (ripple).
      nodes.forEach((node) => {
        const wobble = 1 + Math.sin(time * 0.7 + node.phase) * 0.025 + velocity * 0.06 + surge * 0.18;
        node.origX = node.baseX * wobble;
        node.origY = node.baseY * wobble;
        node.origZ = node.baseZ * wobble;
      });

      // Project 3D to 2D
      const projected = nodes.map((node) => {
        // Rotate around Y
        let x1 = node.origX * cosY - node.origZ * sinY;
        let z1 = node.origZ * cosY + node.origX * sinY;

        // Rotate around X
        let y2 = node.origY * cosX - z1 * sinX;
        let z2 = z1 * cosX + node.origY * sinX;

        // Perspective scale
        const scale = fov / (fov + z2);
        return {
          x: centerX + x1 * scale,
          y: centerY + y2 * scale,
          scale,
          z: z2,
          color: node.color
        };
      });

      // Sort by depth (painters algorithm)
      projected.sort((a, b) => a.z - b.z);

      // Draw Connections
      ctx.lineWidth = 0.8;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 65) {
            const alpha = (1 - dist / 65) * 0.28 * Math.min(p1.scale, p2.scale);
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw expanding energy-ripple rings (from clicks / easter egg)
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += 6.5;
        rp.alpha *= 0.955;
        if (rp.alpha < 0.02) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(6, 182, 212, ${rp.alpha})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Glowing Nodes
      projected.forEach((p) => {
        const r = Math.max(1.8, 3.2 * p.scale);
        const alpha = Math.min(1, Math.max(0.2, (p.z + radius) / (radius * 2)));

        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.scale > 0.9 ? 6 : 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.shadowBlur = 0;
    };

    renderNeuralCore();
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
    let touchStart = null;
    gameCanvas.addEventListener('touchmove', (e) => {
      if (!isPlaying || e.touches.length === 0) return;
      const rect = gameCanvas.getBoundingClientRect();
      const tx = e.touches[0].clientX - rect.left;
      const ty = e.touches[0].clientY - rect.top;
      agent.x += (tx - agent.x) * 0.2;
      agent.y += (ty - agent.y) * 0.2;
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
        gCtx.fillStyle = `rgba(6, 182, 212, ${alpha})`;
        gCtx.beginPath();
        gCtx.arc(pt.x, pt.y, agent.radius * 0.7, 0, Math.PI * 2);
        gCtx.fill();
      });

      // Draw Agent Core
      gCtx.fillStyle = '#ffffff';
      gCtx.shadowColor = '#06b6d4';
      gCtx.shadowBlur = 14;
      gCtx.beginPath();
      gCtx.arc(agent.x, agent.y, agent.radius, 0, Math.PI * 2);
      gCtx.fill();

      // Outer Agent Ring
      gCtx.strokeStyle = '#6366f1';
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

  const setStatusMsg = (text, kind) => {
    formStatusMsg.innerHTML = '';
    formStatusMsg.className = 'form-feedback-msg';
    if (!text) return;
    formStatusMsg.classList.add(kind);
    const icon = document.createElement('span');
    icon.className = 'status-icon';
    icon.innerHTML = kind === 'success' ? CHECK_ICON_SVG : ERROR_ICON_SVG;
    const label = document.createElement('span');
    label.textContent = text;
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

      const fullMessage = `[CONFIGURED SCOPE: ${scopeInput ? scopeInput.value : 'N/A'}]\n\n${messageInput.value.trim()}`;

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            message: fullMessage
          })
        });

        const data = await res.json();
        if (data.success) {
          setStatusMsg('Inquiry received successfully. Kunal will respond within 24 hours.', 'success');
          appleContactForm.reset();
          validators.forEach((v) => v.input.classList.remove('invalid', 'valid'));
        } else {
          setStatusMsg(`Submission error: ${data.error || 'Please email deshmukhkunal556@gmail.com directly.'}`, 'error');
        }
      } catch (err) {
        setStatusMsg('Connection error: Please email deshmukhkunal556@gmail.com directly.', 'error');
      } finally {
        if (submitBtnText) submitBtnText.textContent = 'Submit Project Inquiry';
        if (btnSubmitProposal) btnSubmitProposal.disabled = false;
      }
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

  fetch('/api/content')
    .then((r) => (r.ok ? r.json() : null))
    .then((res) => {
      if (res && res.success && res.data) applyContentData(res.data);
    })
    .catch(() => {});

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

  showGithubSkeleton();
  fetch('/api/projects')
    .then((r) => (r.ok ? r.json() : null))
    .then((res) => {
      // Skip the fallback case — those are the same 3 repos already shown as case studies above.
      if (res && res.success && Array.isArray(res.projects) && res.source !== 'fallback') {
        renderGithubProjects(res.projects);
      } else {
        hideGithubSection();
      }
    })
    .catch(() => hideGithubSection());

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
