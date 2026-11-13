/* ==========================================================================
   COMPUTER SCIENCE PORTFOLIO - JAVASCRIPT APPLICATION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initTypewriter();
  initTerminal();
  initSkillsMatrix();
  initProjectsShowcase();
  initModalSystem();
  initThemeToggle();
  initContactTools();
  initMobileMenu();
});

/* --------------------------------------------------------------------------
   1. Interactive Particle Network Canvas
   -------------------------------------------------------------------------- */
function initParticleCanvas() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor(width / 15), 80);
  const mouse = { x: null, y: null, radius: 150 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.5 ? '#38bdf8' : '#8b5cf6';
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interactivity
      if (mouse.x && mouse.y) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          this.x -= (dx / distance) * force * 2;
          this.y -= (dy / distance) * force * 2;
        }
      }
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.18 - dist / 700})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   2. Typewriter Effect
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const target = document.getElementById('typewriter');
  if (!target) return;

  const roles = [
    "Full-Stack Engineer",
    "Distributed Systems Dev",
    "AI & ML Researcher",
    "Competitive Programmer"
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function type() {
    const currentRole = roles[roleIdx];
    
    if (isDeleting) {
      target.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
    } else {
      target.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
    }

    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIdx === currentRole.length) {
      speed = 1800; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      speed = 400;
    }

    setTimeout(type, speed);
  }

  type();
}

/* --------------------------------------------------------------------------
   3. Interactive Terminal Command Runner
   -------------------------------------------------------------------------- */
function initTerminal() {
  const output = document.getElementById('terminalOutput');
  const input = document.getElementById('terminalInput');
  const presetBtns = document.querySelectorAll('.term-preset-btn');

  if (!output || !input) return;

  const commandHandler = (cmd) => {
    const cleanCmd = cmd.trim().toLowerCase();
    const commandLine = document.createElement('div');
    commandLine.innerHTML = `<span class="term-prompt">alex@cs-workstation:~$</span> ${escapeHtml(cmd)}`;
    output.appendChild(commandLine);

    const result = document.createElement('pre');
    
    switch(cleanCmd) {
      case 'help':
        result.textContent = `Available Terminal Commands:
- cat bio.json        : View developer profile & summary
- system_info         : Display workstation & stack details
- ls skills/          : List core technical competencies
- npm test projects   : Run test suite against portfolio apps
- contact --email     : Output direct email contact
- sudo hire_alex      : Run priority recruitment procedure
- clear               : Clear terminal screen`;
        break;

      case 'cat bio.json':
        result.textContent = JSON.stringify({
          name: "Alex Chen",
          degree: "B.Tech Computer Science & Engineering",
          expected_graduation: "May 2026",
          gpa: "3.92 / 4.00",
          status: "Open for Full-Time SWE Roles & Graduate Research",
          interests: ["Distributed Systems", "Applied AI/ML", "High-Performance Web Applications"]
        }, null, 2);
        break;

      case 'system_info':
        result.textContent = `[SYSTEM TELEMETRY]
OS: Arch Linux x86_64 / macOS Sonoma
Kernel: 6.8.9-zen-1-zen
Shell: zsh 5.9 (x86_64-pc-linux-gnu)
RAM: 32 GB DDR5 6000MHz
IDE: Neovim / VSCode (Vim Bindings)
Main Stack: Python, C++, Go, TypeScript, PyTorch, Docker`;
        break;

      case 'ls skills/':
        result.textContent = `drwxr-xr-x  Languages/    (Python, C++, Java, JS/TS, Go, SQL)
drwxr-xr-x  Systems/      (Node.js, Docker, Redis, PostgreSQL, WebSockets)
drwxr-xr-x  AI_Data/      (PyTorch, OpenCV, NumPy, Scikit-Learn)
drwxr-xr-x  CS_Core/      (Data Structures, OS, Computer Networks, System Design)`;
        break;

      case 'npm test projects':
        result.textContent = `> cs-portfolio@2026 test
> jest --coverage --verbose

 PASS  tests/code_auditor.test.js
 PASS  tests/cloud_monitor.test.js
 PASS  tests/collab_ide.test.js
 PASS  tests/neural_vision.test.js

Test Suites: 4 passed, 4 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        1.42s
Coverage:    98.4% Statements (Clean Build!)`;
        break;

      case 'contact --email':
        result.textContent = `Direct Email: alex.chen.cs2026@email.com\nLinkedIn: linkedin.com/in/alexchen-dev`;
        break;

      case 'sudo hire_alex':
        result.textContent = `[SUCCESS] Authentication granted.
Executing offer letter pipeline...
Recruitment Status: Highly Interested!
Please scroll to #contact section or email alex.chen.cs2026@email.com immediately!`;
        break;

      case 'clear':
        output.innerHTML = '';
        return;

      default:
        result.textContent = `zsh: command not found: ${cleanCmd}. Type 'help' for valid options.`;
    }

    output.appendChild(result);
    output.scrollTop = output.scrollHeight;
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value;
      if (val) {
        commandHandler(val);
        input.value = '';
      }
    }
  });

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) commandHandler(cmd);
    });
  });

  // Initial greeting
  commandHandler('cat bio.json');
}

/* --------------------------------------------------------------------------
   4. CS Competency Matrix
   -------------------------------------------------------------------------- */
const SKILLS_DATA = [
  {
    category: 'languages',
    icon: 'fa-code',
    title: 'Programming Languages',
    skills: ['Python', 'C++ (C++17/20)', 'TypeScript', 'JavaScript (ES6+)', 'Java', 'SQL (PostgreSQL/MySQL)', 'Go (Golang)']
  },
  {
    category: 'systems',
    icon: 'fa-server',
    title: 'Backend & Systems',
    skills: ['Node.js & Express', 'RESTful & gRPC APIs', 'Docker & Containers', 'Redis Caching', 'PostgreSQL', 'WebSockets / Socket.io', 'Linux / Bash Scripting']
  },
  {
    category: 'frontend',
    icon: 'fa-desktop',
    title: 'Web & Frontend',
    skills: ['React.js', 'HTML5 & Modern CSS3', 'Glassmorphic UI / Tailwind', 'Canvas API', 'State Management (Redux/Zustand)', 'Responsive Design', 'Web Performance']
  },
  {
    category: 'aiml',
    icon: 'fa-robot',
    title: 'AI & Data Science',
    skills: ['PyTorch Framework', 'OpenCV Computer Vision', 'NumPy & Pandas', 'Scikit-Learn', 'AST & Static Analysis', 'Model Evaluation & Metrics', 'Jupyter Lab']
  },
  {
    category: 'core',
    icon: 'fa-book-bookmark',
    title: 'CS Core Fundamentals',
    skills: ['Data Structures & Algorithms', 'Operating Systems (Concurrency/Threads)', 'Computer Networks (TCP/IP, HTTP/3)', 'Database Management Systems', 'System Architecture & OO Design', 'Git & CI/CD Pipelines']
  }
];

function initSkillsMatrix() {
  const grid = document.getElementById('skillsGrid');
  const tabs = document.querySelectorAll('.skill-tab');
  if (!grid) return;

  function renderSkills(categoryFilter = 'all') {
    grid.innerHTML = '';

    const filtered = categoryFilter === 'all' 
      ? SKILLS_DATA 
      : SKILLS_DATA.filter(item => item.category === categoryFilter);

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'skill-card glass-card';
      card.innerHTML = `
        <div class="skill-card-header">
          <div class="skill-card-icon"><i class="fa-solid ${item.icon}"></i></div>
          <h3 class="skill-card-title">${item.title}</h3>
        </div>
        <div class="skill-tags">
          ${item.skills.map(s => `<span class="skill-badge">${s}</span>`).join('')}
        </div>
      `;
      grid.appendChild(card);
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.getAttribute('data-category');
      renderSkills(cat);
    });
  });

  renderSkills('all');
}

/* --------------------------------------------------------------------------
   5. Projects Showcase Engine
   -------------------------------------------------------------------------- */
const PROJECTS_DATA = [
  {
    id: 'ai-code-auditor',
    title: 'AI-Powered Code Auditor & Bug Detector',
    category: 'aiml',
    badge: 'AI / ML & Tools',
    img: 'assets/ai_code_auditor.jpg',
    description: 'Static code analysis framework leveraging AST parsing and PyTorch Transformer models to detect memory leaks, race conditions, and vulnerability anti-patterns.',
    tags: ['Python', 'PyTorch', 'Tree-sitter AST', 'React', 'FastAPI'],
    metrics: '94.6% Vulnerability Detection Precision • 4x Speedup',
    demoUrl: '#',
    githubUrl: 'https://github.com',
    details: `
      <h4>Problem Statement & Motivation</h4>
      <p>Traditional static code analysis tools rely heavily on rigid regular expression matching, leading to high false-positive rates and missed contextual bugs in complex asynchronous code bases.</p>
      
      <h4>Technical Architecture</h4>
      <p>Built a multi-stage parser pipeline using <strong>Tree-sitter</strong> to build normalized Abstract Syntax Trees (ASTs). The AST representations are vectorized into embeddings and processed by a specialized fine-tuned Transformer model to classify anti-patterns such as double-free errors, null pointer dereferences, and unhandled Promise rejections.</p>
      
      <h4>Key Benchmarks</h4>
      <ul>
        <li>Scanned 100,000+ lines of open-source C++ and Python code in under 12 seconds.</li>
        <li>Achieved 94.6% precision compared to standard rule-based linters.</li>
        <li>Includes an interactive Web UI for real-time code highlighting and fix suggestions.</li>
      </ul>
    `
  },
  {
    id: 'cloud-monitor',
    title: 'Distributed Microservices Cloud Monitor',
    category: 'systems',
    badge: 'Systems & Cloud',
    img: 'assets/cloud_monitor.jpg',
    description: 'High-throughput cluster observability platform featuring lightweight telemetry agents written in Go, Prometheus metrics export, and WebSockets live dashboard.',
    tags: ['Go (Golang)', 'Docker', 'WebSockets', 'Redis', 'Chart.js'],
    metrics: '10,000+ Telemetry Metrics / Sec • P99 < 15ms',
    demoUrl: '#',
    githubUrl: 'https://github.com',
    details: `
      <h4>Problem Statement & Motivation</h4>
      <p>Modern microservice clusters generate immense metric volume. Traditional polling monitoring tools introduce heavy CPU overhead on edge nodes.</p>

      <h4>Technical Architecture</h4>
      <p>Developed lightweight, low-footprint daemon agents in <strong>Go</strong> that stream CPU, memory, network socket, and HTTP latency metrics over gRPC / WebSockets to a central aggregator backed by <strong>Redis TimeSeries</strong> and PostgreSQL.</p>

      <h4>Key Features & Results</h4>
      <ul>
        <li>Low agent overhead (< 8MB RAM and < 0.5% CPU per node).</li>
        <li>Real-time alert engine firing webhooks on metric threshold spikes.</li>
        <li>Interactive graph dashboard rendering 60FPS live streaming metrics.</li>
      </ul>
    `
  },
  {
    id: 'collab-ide',
    title: 'Real-Time Collaborative Canvas & Web IDE',
    category: 'fullstack',
    badge: 'Full-Stack Web',
    img: 'assets/collab_ide.jpg',
    description: 'Web-based multi-user code editor and whiteboard application utilizing Operational Transformation (OT) and WebRTC for conflict-free real-time pair programming.',
    tags: ['TypeScript', 'Node.js', 'WebRTC', 'Canvas API', 'Socket.io'],
    metrics: 'Sub-50ms Sync Latency • Conflict-Free OT Engine',
    demoUrl: '#',
    githubUrl: 'https://github.com',
    details: `
      <h4>Problem Statement & Motivation</h4>
      <p>Remote software development teams require seamless synchronous collaboration toolsets for technical interviews, pair programming, and architectural whiteboarding.</p>

      <h4>Technical Architecture</h4>
      <p>Implemented an Operational Transformation (OT) sync engine over <strong>Socket.io</strong> and direct <strong>WebRTC data channels</strong>. The client application combines Monaco Code Editor with a custom HTML5 Canvas drawing engine for diagramming.</p>

      <h4>Key Features & Results</h4>
      <ul>
        <li>Supports up to 20 concurrent editors in a single shared room with multi-cursor position tracking.</li>
        <li>Includes integrated WebAssembly-based code sandbox runner for JavaScript and Python snippets.</li>
      </ul>
    `
  },
  {
    id: 'neural-vision',
    title: 'Neural Vision Medical Image Classifier',
    category: 'aiml',
    badge: 'AI / ML',
    img: 'assets/neural_vision.jpg',
    description: 'Deep convolutional network pipeline for MRI brain tumor classification and Grad-CAM visual explainability heatmap generation.',
    tags: ['PyTorch', 'OpenCV', 'ResNet-50', 'Grad-CAM', 'Flask'],
    metrics: '97.2% Accuracy on Benchmark Dataset',
    demoUrl: '#',
    githubUrl: 'https://github.com',
    details: `
      <h4>Problem Statement & Motivation</h4>
      <p>Computer-assisted diagnostics in medical imaging require high accuracy alongside visual explainability to assist radiologist decision-making.</p>

      <h4>Technical Architecture</h4>
      <p>Fine-tuned a <strong>ResNet-50 architecture</strong> with spatial attention layers. Implemented <strong>Grad-CAM (Gradient-weighted Class Activation Mapping)</strong> to generate heatmaps highlighting image regions influencing model predictions.</p>

      <h4>Key Features & Results</h4>
      <ul>
        <li>Achieved 97.2% validation accuracy across 3,000 test MRI scan samples.</li>
        <li>Generates visual diagnostic reports with confidence metrics in under 1 second.</li>
      </ul>
    `
  }
];

function initProjectsShowcase() {
  const grid = document.getElementById('projectsGrid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('projectSearch');

  if (!grid) return;

  function renderProjects() {
    grid.innerHTML = '';

    const currentFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
    const searchQuery = searchInput?.value.toLowerCase().trim() || '';

    const filtered = PROJECTS_DATA.filter(proj => {
      const matchCat = currentFilter === 'all' || proj.category === currentFilter;
      const matchSearch = searchQuery === '' || 
        proj.title.toLowerCase().includes(searchQuery) ||
        proj.description.toLowerCase().includes(searchQuery) ||
        proj.tags.some(t => t.toLowerCase().includes(searchQuery));
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
          <i class="fa-solid fa-folder-open" style="font-size: 2.5rem; margin-bottom: 1rem;"></i>
          <p>No projects match your search criteria.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(proj => {
      const card = document.createElement('div');
      card.className = 'project-card glass-card';
      card.innerHTML = `
        <div class="project-img-wrapper">
          <img src="${proj.img}" alt="${proj.title}" class="project-img">
          <span class="project-badge-tag">${proj.badge}</span>
        </div>
        <div class="project-body">
          <h3 class="project-title">${proj.title}</h3>
          <p class="project-description">${proj.description}</p>
          <div class="project-tech-stack">
            ${proj.tags.map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>
          <div class="project-footer">
            <button class="btn btn-outline view-details-btn" data-id="${proj.id}">
              <i class="fa-solid fa-circle-info"></i> View Deep-Dive
            </button>
            <a href="${proj.githubUrl}" target="_blank" rel="noopener" class="project-link-btn">
              <i class="fa-brands fa-github"></i> Code
            </a>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });

    // Attach listener for modal details
    document.querySelectorAll('.view-details-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pId = btn.getAttribute('data-id');
        openProjectModal(pId);
      });
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjects();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', renderProjects);
  }

  renderProjects();
}

/* --------------------------------------------------------------------------
   6. Project Modal System
   -------------------------------------------------------------------------- */
function initModalSystem() {
  const modal = document.getElementById('projectModal');
  const closeBtn = document.getElementById('modalCloseBtn');

  if (!modal || !closeBtn) return;

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

function openProjectModal(projectId) {
  const modal = document.getElementById('projectModal');
  const content = document.getElementById('modalContent');
  if (!modal || !content) return;

  const proj = PROJECTS_DATA.find(p => p.id === projectId);
  if (!proj) return;

  content.innerHTML = `
    <div class="modal-header-meta">
      <span class="section-tag">${proj.badge}</span>
      <span class="term-dim">${proj.metrics}</span>
    </div>
    <h2>${proj.title}</h2>
    <img src="${proj.img}" alt="${proj.title}" class="modal-hero-img">
    <div class="modal-section-block">
      <p>${proj.description}</p>
    </div>
    <div class="modal-section-block">
      ${proj.details}
    </div>
    <div style="margin-top: 2rem; display: flex; gap: 1rem;">
      <a href="${proj.githubUrl}" target="_blank" rel="noopener" class="btn btn-primary">
        <i class="fa-brands fa-github"></i> View GitHub Repository
      </a>
      <button class="btn btn-secondary" onclick="closeModal()">
        Close Window
      </button>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('projectModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* --------------------------------------------------------------------------
   7. Theme Toggler
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  const html = document.documentElement;

  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  if (!btn) return;

  btn.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    showToast(`Switched to ${newTheme} mode`);
  });
}

/* --------------------------------------------------------------------------
   8. Contact & Interactive Tools
   -------------------------------------------------------------------------- */
function initContactTools() {
  // Copy Email Button
  const copyBtn = id => document.getElementById(id);
  const copyEmail = copyBtn('copyEmailBtn');
  if (copyEmail) {
    copyEmail.addEventListener('click', () => {
      const email = copyEmail.getAttribute('data-copy');
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email address copied to clipboard!');
      });
    });
  }

  // Coffee Chat Slots
  const slots = document.querySelectorAll('.slot-btn');
  slots.forEach(slot => {
    slot.addEventListener('click', () => {
      slots.forEach(s => s.classList.remove('selected'));
      slot.classList.add('selected');
      const time = slot.getAttribute('data-time');
      showToast(`Selected coffee chat slot: ${time}`);
    });
  });

  // Contact Form Submission
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('formName').value;
      showToast(`Thank you, ${name}! Your message has been sent.`);
      form.reset();
    });
  }

  // Download Resume Action
  const downloadBtn = document.getElementById('downloadResumeBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      showToast('Downloading Alex_Chen_Software_Engineer_Resume.pdf...');
    });
  }

  const previewBtn = document.getElementById('previewResumeBtn');
  if (previewBtn) {
    previewBtn.addEventListener('click', () => {
      const box = document.getElementById('resumePreviewBox');
      if (box) {
        box.scrollIntoView({ behavior: 'smooth' });
        showToast('Viewing Interactive Resume');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   9. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('navMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('active');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('active');
    });
  });
}

/* --------------------------------------------------------------------------
   10. Toast Notification System
   -------------------------------------------------------------------------- */
function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--accent-cyan);"></i> <span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m];
  });
}
