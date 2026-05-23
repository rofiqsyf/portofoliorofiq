/* ── LOADER ── */
    window.addEventListener('load', () => setTimeout(() => document.getElementById('loader').classList.add('out'), 2000));

    /* ── CURSOR & TRAIL ── */
    const cur = document.getElementById('cur'), ring = document.getElementById('cur-ring');
    let mx = 0, my = 0, rx = 0, ry = 0;
    const trails = Array.from({ length: 8 }, () => { const d = document.createElement('div'); d.className = 'cur-trail'; document.body.appendChild(d); return { el: d, x: 0, y: 0 }; });
    const updateCursor = (e) => {
      mx = e.clientX || (e.touches && e.touches[0].clientX) || mx;
      my = e.clientY || (e.touches && e.touches[0].clientY) || my;
      cur.style.cssText += `left:${mx}px;top:${my}px`;
    };
    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('touchmove', updateCursor, { passive: true });
    (function raf() {
      rx += (mx - rx) * .12; ry += (my - ry) * .12;
      ring.style.cssText = `left:${rx}px;top:${ry}px`;
      trails.forEach((t, i) => {
        const prev = i === 0 ? { x: mx, y: my } : trails[i - 1];
        t.x += (prev.x - t.x) * (0.35 - i * .03);
        t.y += (prev.y - t.y) * (0.35 - i * .03);
        t.el.style.cssText = `left:${t.x}px;top:${t.y}px;opacity:${(8 - i) / 14};width:${6 - i * .5}px;height:${6 - i * .5}px`;
      });
      requestAnimationFrame(raf);
    })();
    document.querySelectorAll('a,button,.porto-item').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cur-big'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cur-big'));
    });

    /* ── SCROLL PROGRESS ── */
    const prog = document.getElementById('prog');
    window.addEventListener('scroll', () => {
      const t = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.width = (window.scrollY / t * 100) + '%';
    }, { passive: true });

    /* ── NAV ── */
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => nav.classList.toggle('sticky', window.scrollY > 60), { passive: true });

    /* ── HAMBURGER ── */
    const ham = document.getElementById('ham'), mob = document.getElementById('mob-menu');
    ham.addEventListener('click', () => {
      const o = mob.classList.toggle('open');
      ham.classList.toggle('open', o);
      document.body.style.overflow = o ? 'hidden' : '';
    });
    document.querySelectorAll('.mob-lnk').forEach(l => l.addEventListener('click', () => {
      mob.classList.remove('open'); ham.classList.remove('open'); document.body.style.overflow = '';
    }));

    /* ── DARK MODE ── */
    const dmBtns = [document.getElementById('dm-btn'), document.getElementById('dm-btn-mob')];
    let dark = localStorage.getItem('theme') === 'dark';
    function applyTheme() {
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
      dark ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark');
      dmBtns.forEach(b => b && b.classList.toggle('on', dark));
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    }
    applyTheme();
    dmBtns.forEach(b => b && b.addEventListener('click', () => { dark = !dark; applyTheme(); }));

    /* ── TYPEWRITER ── */
    const roles = ['Frontend Developer', 'UI/UX Designer', 'Network Engineer', 'Problem Solver', 'Web Enthusiast'];
    let ri = 0, ci = 0, del = false;
    const tw = document.getElementById('tw');
    function type() {
      const s = roles[ri];
      if (!del) { tw.textContent = s.slice(0, ++ci); if (ci === s.length) { del = true; return setTimeout(type, 1800); } }
      else { tw.textContent = s.slice(0, --ci); if (ci === 0) { del = false; ri = (ri + 1) % roles.length; } }
      setTimeout(type, del ? 55 : 88);
    }
    setTimeout(type, 2300);

    /* ── PARTICLES ── */
    (function () {
      const c = document.getElementById('pc'), ctx = c.getContext('2d');
      let W, H, pts;
      const r = () => { W = c.width = c.offsetWidth; H = c.height = c.offsetHeight; };
      const mk = n => Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .45, vy: (Math.random() - .5) * .45, r: Math.random() * 2.2 + .8, a: Math.random() * .7 + .1 }));
      function draw() {
        ctx.clearRect(0, 0, W, H);
        pts.forEach(p => {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0) p.x = W; if (p.x > W) p.x = 0; if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(163,230,53,${p.a * .5})`; ctx.fill();
        });
        for (let i = 0; i < pts.length; i++)for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(163,230,53,${.09 * (1 - d / 110)})`; ctx.lineWidth = .8; ctx.stroke();
          }
        }
        requestAnimationFrame(draw);
      }
      r(); pts = mk(70); draw();
      window.addEventListener('resize', () => { r(); pts = mk(70); });
    })();

    /* ── INTERACTIVE GRID ── */
    const ss = document.getElementById('skills'), sbg = document.getElementById('sbg');
    ss.addEventListener('mousemove', e => {
      const r = ss.getBoundingClientRect();
      sbg.style.transform = `translate(${((e.clientX - r.left) / r.width - .5) * 28}px,${((e.clientY - r.top) / r.height - .5) * 28}px)`;
    });
    ss.addEventListener('mouseleave', () => sbg.style.transform = 'translate(0,0)');

    /* ── SCROLL REVEAL ── */
    function rev() { document.querySelectorAll('.reveal:not(.active)').forEach(el => { if (el.getBoundingClientRect().top < window.innerHeight - 70) el.classList.add('active'); }); }
    window.addEventListener('scroll', rev, { passive: true }); setTimeout(rev, 350);

    /* ── SKILL BARS ── */
    let bg = false;
    function tryBars() {
      if (bg) return; const el = document.getElementById('sbars');
      if (el && el.getBoundingClientRect().top < window.innerHeight - 80) {
        bg = true; el.querySelectorAll('.skill-bar-fill').forEach(b => b.style.width = b.dataset.w + '%');
      }
    }
    window.addEventListener('scroll', tryBars, { passive: true });

    /* ── COUNTERS ── */
    let cg = false;
    function tryC() {
      if (cg) return; const ab = document.getElementById('about');
      if (ab && ab.getBoundingClientRect().top < window.innerHeight) {
        cg = true;
        document.querySelectorAll('.counter').forEach(el => {
          const t = +el.dataset.target, st = t / 45; let c = 0;
          const tm = setInterval(() => { c += st; if (c >= t) { c = t; clearInterval(tm); } el.textContent = Math.floor(c); }, 35);
        });
      }
    }
    window.addEventListener('scroll', tryC, { passive: true });

    /* ── TIMELINE LINE ── */
    const tll = document.getElementById('tll');
    window.addEventListener('scroll', () => { if (tll && tll.getBoundingClientRect().top < window.innerHeight * .75) tll.classList.add('go'); }, { passive: true });

    /* ── 3D TILT CARDS ── */
    document.querySelectorAll('.tilt').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = `perspective(600px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) scale(1.02)`;
      });
      card.addEventListener('mouseleave', () => card.style.transform = '');
    });

    /* ── PORTFOLIO FILTER ── */
    document.querySelectorAll('.fbtn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.fbtn').forEach(b => {
          b.classList.remove('active', 'bg-electric', 'text-white', 'border-electric');
          b.classList.add('bg-transparent', 'text-on-muted', 'border-outline-dim');
        });
        btn.classList.remove('bg-transparent', 'text-on-muted', 'border-outline-dim');
        btn.classList.add('active', 'bg-electric', 'text-white', 'border-electric');
        const f = btn.dataset.f;
        document.querySelectorAll('.porto-item').forEach(item => {
          const show = f === 'all' || item.dataset.cat === f;
          item.style.transition = 'opacity .4s,transform .4s';
          item.style.opacity = show ? '1' : '.15';
          item.style.transform = show ? 'scale(1)' : 'scale(.95)';
          item.style.pointerEvents = show ? 'auto' : 'none';
        });
      });
    });

    /* ── LIGHTBOX ── */
    const lb = document.getElementById('lightbox'), lbImg = document.getElementById('lb-img'), lbTitle = document.getElementById('lb-title'), lbDesc = document.getElementById('lb-desc');
    document.querySelectorAll('.porto-item').forEach(item => {
      item.addEventListener('click', () => {
        lbImg.src = item.dataset.img || item.querySelector('img').src;
        lbTitle.textContent = item.dataset.title || '';
        lbDesc.textContent = item.dataset.desc || '';
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    function closeLB() { lb.classList.remove('open'); document.body.style.overflow = ''; }
    lb.addEventListener('click', e => { if (e.target === lb || e.target === lbImg) closeLB(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLB(); });

    /* ── CONTACT FORM ── */
    const cf = document.getElementById('cform'), sbtn = document.getElementById('sbtn'), smsg = document.getElementById('smsg');
    cf.addEventListener('submit', e => {
      e.preventDefault();
      const orig = sbtn.innerHTML;
      sbtn.innerHTML = '<span style="animation:sp .9s linear infinite" class="material-symbols-outlined">autorenew</span><span>Mengirim...</span>';
      sbtn.disabled = true;
      setTimeout(() => {
        sbtn.style.display = 'none'; smsg.style.display = 'block'; cf.reset();
        setTimeout(() => { sbtn.style.display = ''; sbtn.disabled = false; sbtn.innerHTML = orig; smsg.style.display = 'none'; }, 4000);
      }, 1600);
    });
    const ss2 = document.createElement('style'); ss2.textContent = '@keyframes sp{to{transform:rotate(360deg)}}'; document.head.appendChild(ss2);

    /* ── BACK TO TOP ── */
    const btt = document.getElementById('btt');
    window.addEventListener('scroll', () => btt.classList.toggle('show', window.scrollY > 500), { passive: true });

    /* ── MAGNETIC BUTTONS ── */
    document.querySelectorAll('.btn-neon,a[href="#"]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * .2, y = (e.clientY - r.top - r.height / 2) * .2;
        el.style.transform = `translate(${x}px,${y}px)`;
      });
      el.addEventListener('mouseleave', () => el.style.transform = '');
    });

    /* ── SERVICE CARDS CAROUSEL ── */
    (function () {
      const track   = document.getElementById('sc-track');
      const btnPrev = document.getElementById('sc-prev');
      const btnNext = document.getElementById('sc-next');
      const dots    = document.querySelectorAll('.sc-dot');
      if (!track || !btnPrev || !btnNext) return;

      const TOTAL   = 6;
      let current   = 0;
      let autoTimer = null;
      let maxIndex  = TOTAL - 1;

      /* Calculate slide offset dynamically to account for padding + gap */
      function getSlideWidth() {
        const slide = track.querySelector('.sc-slide');
        if (!slide) return 0;
        const gap = 16; // matches CSS gap
        return slide.offsetWidth + gap;
      }

      function goTo(idx, animated = true) {
        current = Math.max(0, Math.min(maxIndex, idx));

        if (!animated) track.style.transition = 'none';
        track.style.transform = `translateX(${-current * getSlideWidth()}px)`;
        if (!animated) { void track.offsetHeight; track.style.transition = ''; }

        /* Update dots */
        dots.forEach((d, i) => {
          d.style.display = i > maxIndex ? 'none' : '';
          d.classList.toggle('active', i === current);
        });

        /* Update arrow visibility */
        btnPrev.classList.toggle('sc-hidden', current === 0);
        btnNext.classList.toggle('sc-hidden', current === maxIndex);
      }

      /* Arrow clicks */
      btnPrev.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
      btnNext.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

      /* Dot clicks */
      dots.forEach(d => d.addEventListener('click', () => { goTo(+d.dataset.i); resetAuto(); }));

      /* Touch / swipe support */
      let touchStartX = 0, touchStartY = 0, isSwiping = false;
      track.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isSwiping = false;
      }, { passive: true });
      track.addEventListener('touchmove', e => {
        const dx = e.touches[0].clientX - touchStartX;
        const dy = e.touches[0].clientY - touchStartY;
        if (!isSwiping && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) isSwiping = true;
      }, { passive: true });
      track.addEventListener('touchend', e => {
        if (!isSwiping) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) {
          goTo(current + (dx < 0 ? 1 : -1));
          resetAuto();
        }
      });

      /* Auto-play every 3.5 s */
      function startAuto() {
        autoTimer = setInterval(() => {
          goTo(current < maxIndex ? current + 1 : 0);
        }, 3500);
      }
      function resetAuto() {
        clearInterval(autoTimer);
        startAuto();
      }

      /* Pause on hover / focus */
      const carousel = track.closest('.sc-carousel');
      if (carousel) {
        carousel.addEventListener('mouseenter', () => clearInterval(autoTimer));
        carousel.addEventListener('mouseleave', startAuto);
        carousel.addEventListener('focusin',   () => clearInterval(autoTimer));
        carousel.addEventListener('focusout',  startAuto);
      }

      /* Init and re-calculate on resize */
      function init() {
        const itemsPerView = window.innerWidth >= 768 ? 3 : 1;
        maxIndex = TOTAL - itemsPerView;
        if (current > maxIndex) current = maxIndex;
        goTo(current, false);
        if (!autoTimer) startAuto();
      }

      init();
      window.addEventListener('resize', init);
    })();

    /* ── ACHIEVEMENTS INTERACTIVE DRAGGABLE MARQUEE ── */
    (function() {
      const wrapper = document.getElementById('achieve-wrapper');
      const track = document.getElementById('achieve-track');
      if (!wrapper || !track) return;

      // Clone cards for infinite scrolling effect
      const cards = Array.from(track.children);
      cards.forEach(card => {
        const clone = card.cloneNode(true);
        // Remove reveal classes from clones so they don't re-animate
        clone.classList.remove('reveal', 'd1', 'd2', 'd3', 'd4');
        clone.style.opacity = '1';
        clone.style.transform = 'none';
        track.appendChild(clone);
      });

      let isDown = false;
      let startX;
      let scrollLeft;
      let currentX = 0;
      let isHovering = false;
      let velocity = 0;
      let prevX = 0;
      
      let animationId;
      const baseSpeed = 1.2;

      // Setup 3D Perspective Context
      track.style.perspective = '1500px';
      track.style.transformStyle = 'preserve-3d';

      // Track hovered card
      let hoveredCard = null;
      cards.forEach((card, index) => {
         card.addEventListener('mouseenter', () => hoveredCard = card);
         card.addEventListener('mouseleave', () => { if (hoveredCard === card) hoveredCard = null; });
      });

      function updateCards3D() {
        const wrapperWidth = wrapper.clientWidth;
        const trackCenter = wrapperWidth / 2;
        const time = Date.now() / 1000;
        
        cards.forEach((card, i) => {
          // Calculate card center relative to wrapper bounds
          const rect = card.getBoundingClientRect();
          const wrapperRect = wrapper.getBoundingClientRect();
          const cardCenter = (rect.left - wrapperRect.left) + (rect.width / 2);
          
          const dist = cardCenter - trackCenter;
          let nDist = dist / (wrapperWidth / 1.5); 
          if (nDist > 1) nDist = 1;
          if (nDist < -1) nDist = -1;
          
          // 3D Transform Math
          const scale = 1 - Math.abs(nDist) * 0.15;
          const rotateY = nDist * 35; // Up to 35 degrees rotation
          const z = Math.abs(nDist) * -120; // Push back edge cards
          const opacity = 1 - Math.abs(nDist) * 0.6; // Fade out edges
          
          // Floating Animation Math
          const floatY = Math.sin(time * 2 + i) * 12;

          card.style.transition = 'box-shadow 0.3s, border-color 0.3s'; // Smooth glow transition
          card.style.transform = `translateY(${floatY}px) translateZ(${z}px) rotateY(${rotateY}deg) scale(${scale})`;
          card.style.opacity = opacity;
          
          // Neon Glow effect prioritized on Hover, else center
          if (card === hoveredCard) {
             card.style.boxShadow = '0 0 60px rgba(163,230,53,0.8), inset 0 0 20px rgba(163,230,53,0.3)';
             card.style.borderColor = 'rgba(163,230,53,1)';
             card.style.zIndex = '50';
          } else if (Math.abs(nDist) < 0.25) {
             card.style.boxShadow = '0 0 40px rgba(163,230,53,0.2)';
             card.style.borderColor = 'rgba(163,230,53,0.4)';
             card.style.zIndex = '10';
          } else {
             card.style.boxShadow = '';
             card.style.borderColor = '';
             card.style.zIndex = '1';
          }
        });
      }

      function animate() {
        if (!isDown) {
          // If not hovering and no momentum left, resume base auto-scroll
          if (!isHovering && Math.abs(velocity) < 0.1) {
            velocity = -baseSpeed;
          }
          currentX += velocity;
          
          // Apply friction/momentum decay if moving faster than base auto-scroll
          if (Math.abs(velocity) > baseSpeed) {
             velocity *= 0.94;
          } else if (isHovering) {
             // Stop completely if hovering
             velocity = 0;
          }

          // Seamless Infinite Loop bounds
          if (currentX > 0) currentX = -(track.scrollWidth / 2) + currentX;
          if (Math.abs(currentX) >= track.scrollWidth / 2) currentX = 0;
        }

        track.style.transform = `translateX(${currentX}px)`;
        updateCards3D();
        
        animationId = requestAnimationFrame(animate);
      }
      
      animate();

      wrapper.addEventListener('mouseenter', () => isHovering = true);
      wrapper.addEventListener('mouseleave', () => {
        isHovering = false;
        isDown = false;
        wrapper.classList.remove('cursor-grabbing');
      });

      wrapper.addEventListener('mousedown', (e) => {
        isDown = true;
        isHovering = true;
        velocity = 0;
        wrapper.classList.add('cursor-grabbing');
        startX = e.pageX - wrapper.offsetLeft;
        scrollLeft = currentX;
        prevX = e.pageX;
      });

      wrapper.addEventListener('mouseup', () => {
        isDown = false;
        isHovering = false;
        wrapper.classList.remove('cursor-grabbing');
      });

      wrapper.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - wrapper.offsetLeft;
        
        // Track momentum velocity
        velocity = (e.pageX - prevX);
        prevX = e.pageX;

        const walk = (x - startX); 
        let nextX = scrollLeft + walk;
        
        if (nextX > 0) nextX = -(track.scrollWidth / 2) + nextX;
        if (Math.abs(nextX) >= track.scrollWidth / 2) nextX = 0;
        
        currentX = nextX;
      });

      // Touch support
      wrapper.addEventListener('touchstart', (e) => {
        isDown = true;
        isHovering = true;
        velocity = 0;
        startX = e.touches[0].pageX - wrapper.offsetLeft;
        scrollLeft = currentX;
        prevX = e.touches[0].pageX;
      }, {passive: true});

      wrapper.addEventListener('touchend', () => {
        isDown = false;
        isHovering = false;
      });

      wrapper.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - wrapper.offsetLeft;
        
        velocity = (e.touches[0].pageX - prevX);
        prevX = e.touches[0].pageX;

        const walk = (x - startX);
        
        let nextX = scrollLeft + walk;
        if (nextX > 0) nextX = -(track.scrollWidth / 2) + nextX;
        if (Math.abs(nextX) >= track.scrollWidth / 2) nextX = 0;
        
        currentX = nextX;
      }, {passive: true});

    })();

    /* ── FORMSPREE AJAX SUBMISSION ── */
    const cform = document.getElementById('cform');
    if (cform) {
      cform.addEventListener('submit', async (e) => {
        e.preventDefault();
        const sbtn = document.getElementById('sbtn');
        const smsg = document.getElementById('smsg');
        
        // Disable button during submission
        const originalText = sbtn.innerHTML;
        sbtn.innerHTML = '<span>Mengirim...</span>';
        sbtn.disabled = true;
        sbtn.style.opacity = '0.7';
        sbtn.style.cursor = 'wait';

        try {
          const response = await fetch(cform.action, {
            method: cform.method,
            body: new FormData(cform),
            headers: {
              'Accept': 'application/json'
            }
          });
          
          if (response.ok) {
            cform.reset();
            smsg.classList.remove('hidden');
            setTimeout(() => smsg.classList.add('hidden'), 5000);
          } else {
            alert('Oops! Ada masalah saat mengirim pesan. Pastikan semua kolom terisi dengan benar.');
          }
        } catch (error) {
          alert('Oops! Gagal mengirim pesan. Periksa koneksi internet Anda.');
        } finally {
          sbtn.innerHTML = originalText;
          sbtn.disabled = false;
          sbtn.style.opacity = '1';
          sbtn.style.cursor = 'none';
        }
      });
    }