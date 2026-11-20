/**
 * JonesPaella — Premium Catering Website
 * Interactive JavaScript Module
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. NAVIGATION — Scroll & Mobile Toggle
  // ==========================================
  const nav = document.getElementById('mainNav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const navItems = document.querySelectorAll('[data-nav]');

  // Scroll behavior
  let lastScroll = 0;
  const handleScroll = () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Mobile toggle
  const toggleMobileNav = () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  };

  navToggle.addEventListener('click', toggleMobileNav);
  mobileOverlay.addEventListener('click', toggleMobileNav);

  // Close mobile nav on link click
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        toggleMobileNav();
      }
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const onSectionScroll = () => {
    const scrollY = window.scrollY + 200;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  };

  window.addEventListener('scroll', onSectionScroll, { passive: true });

  // ==========================================
  // 2. FIRE PARTICLES — Hero Background
  // ==========================================
  const particlesContainer = document.getElementById('heroParticles');
  const particleCount = 25;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = Math.random() * 100 + '%';
    particle.style.bottom = Math.random() * 30 + '%';
    particle.style.animationDelay = Math.random() * 4 + 's';
    particle.style.animationDuration = (3 + Math.random() * 3) + 's';
    particle.style.width = (2 + Math.random() * 4) + 'px';
    particle.style.height = particle.style.width;
    particle.style.opacity = 0.3 + Math.random() * 0.5;

    // Random warm colors
    const colors = ['#ff6f00', '#ff9800', '#ffc107', '#ffca28', '#ffab40'];
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

    particlesContainer.appendChild(particle);
  }

  // ==========================================
  // 3. SCROLL REVEAL ANIMATIONS
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================
  // 4. LIGHTBOX — Gallery
  // ==========================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const galleryItems = document.querySelectorAll('[data-lightbox]');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const imgSrc = item.getAttribute('data-lightbox');
      lightboxImg.src = imgSrc;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      lightboxImg.src = '';
    }, 300);
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightbox.classList.contains('active')) closeLightbox();
      if (navLinks.classList.contains('open')) toggleMobileNav();
    }
  });

  // ==========================================
  // 5. SMOOTH SCROLL — Anchor Links
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        const navHeight = nav.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================
  // 6. COUNTER ANIMATION — Hero Stats
  // ==========================================
  const statNumbers = document.querySelectorAll('.hero-stat-number');
  let statsAnimated = false;

  const animateCounter = (element, target, suffix = '') => {
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current) + suffix;
    }, 20);
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        statNumbers.forEach(stat => {
          const text = stat.textContent;
          if (text.includes('+')) {
            const num = parseInt(text);
            animateCounter(stat, num, '+');
          } else if (text.includes('%')) {
            const num = parseInt(text);
            animateCounter(stat, num, '%');
          }
          // Leave "5★" as-is
        });
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

  // ==========================================
  // 7. PARALLAX — Subtle hero image movement
  // ==========================================
  const heroBgImg = document.querySelector('.hero-bg img');
  
  const handleParallax = () => {
    if (window.innerWidth > 768) {
      const scrolled = window.scrollY;
      const rate = scrolled * 0.3;
      if (heroBgImg && scrolled < window.innerHeight) {
        heroBgImg.style.transform = `scale(1.05) translateY(${rate}px)`;
      }
    }
  };

  window.addEventListener('scroll', handleParallax, { passive: true });

  // ==========================================
  // 8. SERVICE CARDS — Tilt effect on hover
  // ==========================================
  const serviceCards = document.querySelectorAll('.service-card');

  serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth <= 768) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 25;
      const rotateY = (centerX - x) / 25;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ==========================================
  // 9. LOADING — Remove preloader feel
  // ==========================================
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });

  // Fallback if load already fired
  if (document.readyState === 'complete') {
    document.body.style.opacity = '1';
  }
});
