/* Smooth Scroll */
function goto(id) {
    const el = document.querySelector(id);
    if(el) el.scrollIntoView({ behavior: 'smooth' });
}

/* =========================================
   DARK MODE TOGGLE
   ========================================= */
(function initDarkMode() {
    // Create theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    themeToggle.innerHTML = `
        <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
        <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
    `;
    document.body.appendChild(themeToggle);
    
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    // Toggle theme on click
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme === 'dark' ? 'dark' : '');
        localStorage.setItem('theme', newTheme);
        
        // Add animation effect
        themeToggle.style.transform = 'scale(0.9) rotate(180deg)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 300);
    });
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : '');
        }
    });
})();

/* =========================================
   SCROLL PROGRESS INDICATOR
   ========================================= */
(function initScrollProgress() {
    // Create scroll progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.prepend(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
})();

/* =========================================
   DYNAMIC ISLAND NAVBAR ANIMATION
   ========================================= */
(function initDynamicIslandNav() {
    const header = document.querySelector('header');
    const nav = document.querySelector('.nav');
    let lastScrollY = 0;
    let ticking = false;
    
    // Scroll threshold for transformation
    const SCROLL_THRESHOLD = 100;
    
    function updateHeader() {
        const scrollY = window.scrollY;
        
        if (scrollY > SCROLL_THRESHOLD) {
            header.classList.add('scrolled');
            
            // Add subtle scale effect based on scroll direction
            if (scrollY > lastScrollY) {
                // Scrolling down
                header.style.transform = 'translateX(-50%) scale(0.98)';
            } else {
                // Scrolling up
                header.style.transform = 'translateX(-50%) scale(1)';
            }
        } else {
            header.classList.remove('scrolled');
            header.style.transform = '';
        }
        
        lastScrollY = scrollY;
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });
    
    // Initial check
    updateHeader();
})();

/* =========================================
   ANIMATIONS ON SCROLL (Enhanced)
   ========================================= */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            
            // Stagger children animations
            if (entry.target.classList.contains('stagger')) {
                const children = entry.target.children;
                Array.from(children).forEach((child, index) => {
                    child.style.animationDelay = `${index * 100}ms`;
                    child.classList.add('show');
                });
            }
            
            // Animate grid children with stagger
            const gridChildren = entry.target.querySelectorAll('.grid > *');
            gridChildren.forEach((child, index) => {
                child.style.animationDelay = `${index * 0.1}s`;
            });
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* =========================================
   COUNTER ANIMATION (Enhanced)
   ========================================= */
const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = +el.dataset.to;
            const duration = 2000;
            const start = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out quart for smooth deceleration
                const ease = 1 - Math.pow(1 - progress, 4);
                
                const current = Math.floor(target * ease);
                el.innerText = current.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    el.innerText = target.toLocaleString();
                    // Add a subtle bounce effect at the end
                    el.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        el.style.transform = 'scale(1)';
                    }, 150);
                }
            };
            
            requestAnimationFrame(animate);
            obs.unobserve(el);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

/* Mobile Nav Toggle */
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navClose = document.querySelector('.nav-close');

// Function to close mobile menu
function closeMobileMenu() {
    if(navLinks && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        if(navToggle) {
            navToggle.textContent = '☰';
            navToggle.setAttribute('aria-expanded', 'false');
        }
    }
}

// Function to open mobile menu
function openMobileMenu() {
    if(navLinks) {
        navLinks.classList.add('open');
        if(navToggle) {
            navToggle.textContent = '☰';
            navToggle.setAttribute('aria-expanded', 'true');
        }
    }
}

if(navToggle) {
    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.contains('open');
        if(isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
}

// Close button inside sidebar
if(navClose) {
    navClose.addEventListener('click', () => {
        closeMobileMenu();
    });
}

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        closeMobileMenu();
    });
});

// Close mobile menu when clicking on overlay (the ::before pseudo-element area)
if(navLinks) {
    navLinks.addEventListener('click', (e) => {
        // Only close if clicking directly on nav-links (the overlay area)
        if(e.target === navLinks) {
            closeMobileMenu();
        }
    });
}

/* Dropdown Support for Touch/Mobile */
const dropdowns = document.querySelectorAll('.dropdown');
dropdowns.forEach(dropdown => {
    const btn = dropdown.querySelector('.dropbtn');
    if(btn) {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            
            // Close other open dropdowns
            dropdowns.forEach(d => {
                if(d !== dropdown) d.classList.remove('active');
            });

            dropdown.classList.toggle('active');
        });
    }
});

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if(!e.target.closest('.dropdown')) {
        dropdowns.forEach(d => d.classList.remove('active'));
    }
});

/* =========================================
   CHESS SCROLL ANIMATION
   ========================================= */
const chessSection = document.getElementById('scroll-chess');
const chessboard = document.getElementById('chessboard');
const moveHistory = document.getElementById('moveHistory');

if (chessSection && chessboard) {
    // Initial Board State (Standard Setup)
    // Using simple char representation:
    // r=rook, n=knight, b=bishop, q=queen, k=king, p=pawn (lowercase black)
    // R=Rook, N=Knight, B=Bishop, Q=Queen, K=King, P=Pawn (uppercase white)
    const initialBoard = [
        ['r','n','b','q','k','b','n','r'],
        ['p','p','p','p','p','p','p','p'],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['P','P','P','P','P','P','P','P'],
        ['R','N','B','Q','K','B','N','R']
    ];

    const piecesMap = {
        'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
        'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
    };

    // Game moves sequence (simple simplified scholar's mateish or common opening)
    // Format: [fromRow, fromCol, toRow, toCol, description]
    const moves = [
        // e4
        [6, 4, 4, 4, "1. e4"],
        // e5
        [1, 4, 3, 4, "1... e5"],
        // Nf3
        [7, 6, 5, 5, "2. Nf3"],
        // Nc6
        [0, 1, 2, 2, "2... Nc6"],
        // Bc4
        [7, 5, 4, 2, "3. Bc4"],
        // d6
        [1, 3, 2, 3, "3... d6"],
        // O-O (Simulated as King move only for simplicity in this demo)
        [7, 4, 7, 6, "4. O-O (White Castles)"],
        // Bg4
        [0, 2, 4, 6, "4... Bg4"],
         // h3
        [6, 7, 5, 7, "5. h3"],
        // Bh5
        [4, 6, 3, 5, "5... Bh5"]
    ];

    // Helper to create board
    function createBoard() {
        chessboard.innerHTML = '';
        for(let r=0; r<8; r++) {
            for(let c=0; c<8; c++) {
                const sq = document.createElement('div');
                sq.className = `square ${(r+c)%2===0 ? 'white' : 'black'}`;
                sq.dataset.row = r;
                sq.dataset.col = c;
                
                const pieceChar = initialBoard[r][c];
                if(pieceChar) {
                    const piece = document.createElement('div');
                    piece.className = `piece ${pieceChar === pieceChar.toUpperCase() ? 'w' : 'b'}`;
                    piece.innerText = piecesMap[pieceChar];
                    piece.dataset.type = pieceChar;
                    // Position absolute relative to board could be better for animation,
                    // but for grid layout we place inside.
                    // To animate, we'll transform translate.
                    sq.appendChild(piece);
                }
                
                chessboard.appendChild(sq);
            }
        }
    }

    createBoard();

    // Continuous Animation Logic
    let currentMove = 0;
    let isAutoPlaying = false;
    let lastTime = 0;
    const moveInterval = 1500; // ms per move

    function animateGame(timestamp) {
        if (!isAutoPlaying) return;

        if (timestamp - lastTime > moveInterval) {
            updateBoardState(currentMove);
            
            currentMove++;
            if (currentMove > moves.length) {
                currentMove = 0; // Loop back to start
            }
            lastTime = timestamp;
        }
        requestAnimationFrame(animateGame);
    }

    // Start animation when section is visible
    const chessObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!isAutoPlaying) {
                    isAutoPlaying = true;
                    requestAnimationFrame(animateGame);
                }
            } else {
                isAutoPlaying = false;
            }
        });
    });
    chessObserver.observe(chessSection);

    function updateBoardState(targetMoveIndex) {
        // Clear all pieces to initial
        const squares = document.querySelectorAll('.square');
        squares.forEach(sq => {
            sq.innerHTML = '';
            sq.classList.remove('highlight');
        });

        // Place initial
        for(let r=0; r<8; r++) {
            for(let c=0; c<8; c++) {
                const pieceChar = initialBoard[r][c];
                if(pieceChar) {
                    const sq = chessboard.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                    const piece = document.createElement('div');
                    piece.className = `piece ${pieceChar === pieceChar.toUpperCase() ? 'w' : 'b'}`;
                    piece.innerText = piecesMap[pieceChar];
                    sq.appendChild(piece);
                }
            }
        }

        // Apply moves up to index
        let lastMoveText = "Start Game";
        
        for(let i=0; i < targetMoveIndex && i < moves.length; i++) {
            const [fr, fc, tr, tc, text] = moves[i];
            const fromSq = chessboard.querySelector(`[data-row="${fr}"][data-col="${fc}"]`);
            const toSq = chessboard.querySelector(`[data-row="${tr}"][data-col="${tc}"]`);
            
            // Move piece
            if(fromSq.firstChild) {
                // If capture, remove victim
                toSq.innerHTML = '';
                toSq.appendChild(fromSq.firstChild);
            }
            
            // Special case: Castling (Rook move logic simplified)
            if(text.includes("O-O")) {
                // If King went g1 (7,6), Rook f1 (7,5)
                // We hardcoded the King move in the array, let's just manually move Rook for visual
                const rookFrom = chessboard.querySelector(`[data-row="7"][data-col="7"]`);
                const rookTo = chessboard.querySelector(`[data-row="7"][data-col="5"]`);
                if(rookFrom.firstChild) rookTo.appendChild(rookFrom.firstChild);
            }

            lastMoveText = text;
            
            // Highlight last move only
            if(i === targetMoveIndex - 1) {
                fromSq.classList.add('highlight');
                toSq.classList.add('highlight');
            }
        }
        
        moveHistory.querySelector('.move-text').innerText = lastMoveText;
    }
}

/* =========================================
   BUTTON RIPPLE EFFECT
   ========================================= */
(function initRippleEffect() {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            ripple.style.cssText = `
                position: absolute;
                background: rgba(255, 255, 255, 0.4);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple-animation 0.6s ease-out;
                pointer-events: none;
                left: ${x}px;
                top: ${y}px;
                width: 10px;
                height: 10px;
                margin-left: -5px;
                margin-top: -5px;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add ripple animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple-animation {
            to {
                transform: scale(40);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
})();

/* =========================================
   PARALLAX EFFECT FOR HERO
   ========================================= */
(function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                const heroHeight = hero.offsetHeight;
                
                if (scrolled < heroHeight) {
                    // Parallax background
                    hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
                    
                    // Fade out content as you scroll
                    const opacity = 1 - (scrolled / heroHeight) * 0.5;
                    const heroContent = hero.querySelector('.container');
                    if (heroContent) {
                        heroContent.style.opacity = Math.max(opacity, 0.3);
                        heroContent.style.transform = `translateY(${scrolled * 0.2}px)`;
                    }
                }
                ticking = false;
            });
            ticking = true;
        }
    });
})();

/* =========================================
   MAGNETIC BUTTON EFFECT
   ========================================= */
(function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.btn-primary');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.02)`;
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
})();

/* =========================================
   TILT EFFECT FOR CARDS
   ========================================= */
(function initTiltEffect() {
    const cards = document.querySelectorAll('.card, .price-card, .testimonial-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
})();

/* =========================================
   TYPING EFFECT FOR HERO TITLE
   ========================================= */
(function initTypingEffect() {
    const heroTitle = document.querySelector('.hero h1');
    if (!heroTitle) return;
    
    const originalText = heroTitle.textContent;
    const words = originalText.split(' ');
    
    // Only apply on first load
    if (sessionStorage.getItem('heroAnimated')) return;
    sessionStorage.setItem('heroAnimated', 'true');
    
    heroTitle.innerHTML = '';
    heroTitle.style.visibility = 'visible';
    
    words.forEach((word, wordIndex) => {
        const wordSpan = document.createElement('span');
        wordSpan.style.display = 'inline-block';
        wordSpan.style.opacity = '0';
        wordSpan.style.transform = 'translateY(20px)';
        wordSpan.style.transition = `all 0.5s ease ${wordIndex * 0.1 + 0.5}s`;
        wordSpan.textContent = word + ' ';
        heroTitle.appendChild(wordSpan);
        
        setTimeout(() => {
            wordSpan.style.opacity = '1';
            wordSpan.style.transform = 'translateY(0)';
        }, 100);
    });
})();

/* =========================================
   SMOOTH SCROLL WITH EASING
   ========================================= */
(function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
})();

/* =========================================
   INTERSECTION OBSERVER FOR ANIMATIONS
   ========================================= */
(function initScrollAnimations() {
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add stagger to children
                const children = entry.target.querySelectorAll('.card, .kpi, .gallery-item, .testimonial-card');
                children.forEach((child, index) => {
                    child.style.transitionDelay = `${index * 0.1}s`;
                    child.classList.add('animate-in');
                });
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    document.querySelectorAll('.section').forEach(section => {
        animateOnScroll.observe(section);
    });
})();

/* =========================================
   HOVER SOUND EFFECT (Optional - Subtle)
   ========================================= */
(function initHoverFeedback() {
    // Visual feedback only - no sound for better UX
    const interactiveElements = document.querySelectorAll('.btn, .card, .nav-links a, .filter-btn');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
    });
})();

/* =========================================
   LAZY LOAD IMAGES WITH FADE IN
   ========================================= */
(function initLazyLoadFade() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        
        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });
        }
    });
})();

/* =========================================
   FLOATING ELEMENTS ANIMATION
   ========================================= */
(function initFloatingElements() {
    // Add floating chess pieces as decorative elements
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const pieces = ['♔', '♕', '♖', '♗', '♘', '♙'];
    const container = document.createElement('div');
    container.className = 'floating-pieces';
    container.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
        z-index: 0;
    `;
    
    for (let i = 0; i < 6; i++) {
        const piece = document.createElement('span');
        piece.textContent = pieces[i % pieces.length];
        piece.style.cssText = `
            position: absolute;
            font-size: ${2 + Math.random() * 2}rem;
            opacity: 0.03;
            color: var(--text-primary);
            animation: floatPiece ${8 + Math.random() * 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        container.appendChild(piece);
    }
    
    hero.style.position = 'relative';
    hero.insertBefore(container, hero.firstChild);
    
    // Add keyframes for floating pieces
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatPiece {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-20px) rotate(5deg); }
            50% { transform: translateY(-10px) rotate(-5deg); }
            75% { transform: translateY(-25px) rotate(3deg); }
        }
    `;
    document.head.appendChild(style);
})();

/* =========================================
   GRID GLOW DOTS ANIMATION
   ========================================= */
(function initGridGlowDots() {
    const gridGlow = document.getElementById('gridGlow');
    if (!gridGlow) return;
    
    // Create glowing dots at random positions
    const numDots = 15;
    
    for (let i = 0; i < numDots; i++) {
        const dot = document.createElement('div');
        dot.className = 'grid-dot';
        
        // Random position aligned to grid (50px grid)
        const gridSize = 50;
        const maxX = Math.floor(window.innerWidth / gridSize);
        const maxY = Math.floor(500 / gridSize); // Hero height approx
        
        const x = Math.floor(Math.random() * maxX) * gridSize;
        const y = Math.floor(Math.random() * maxY) * gridSize;
        
        dot.style.left = x + 'px';
        dot.style.top = y + 'px';
        dot.style.animationDelay = (Math.random() * 4) + 's';
        
        gridGlow.appendChild(dot);
    }
    
    // Periodically reposition dots for variety
    setInterval(() => {
        const dots = gridGlow.querySelectorAll('.grid-dot');
        dots.forEach(dot => {
            const gridSize = 50;
            const maxX = Math.floor(window.innerWidth / gridSize);
            const maxY = Math.floor(500 / gridSize);
            
            const x = Math.floor(Math.random() * maxX) * gridSize;
            const y = Math.floor(Math.random() * maxY) * gridSize;
            
            dot.style.left = x + 'px';
            dot.style.top = y + 'px';
        });
    }, 8000);
})();

/* =========================================
   SECTION REVEAL ON SCROLL
   ========================================= */
(function initSectionReveal() {
    // Only apply reveal animation to sections that have the 'reveal' class
    // This prevents non-homepage pages (blog, leaderboard, youtube, blog posts)
    // from having their content hidden by opacity:0
    const sections = document.querySelectorAll('.section.reveal');
    
    const revealSection = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    sections.forEach(section => {
        // Check if the section is already in the viewport (e.g. near top of page)
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
            // Already visible, show immediately
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
            section.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        } else {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
        revealSection.observe(section);
    });
    
    // Make hero visible immediately
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.opacity = '1';
        hero.style.transform = 'none';
    }
})();
