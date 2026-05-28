/* =====================================================
   STAR CANVAS — animated particle sky
===================================================== */
(function () {
    const canvas = document.getElementById('starCanvas');
    const ctx = canvas.getContext('2d');
    let W, H, stars = [];

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function mkStar() {
        return {
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 1.8 + .2,
            alpha: Math.random(),
            da: (Math.random() * .008 + .003) * (Math.random() > .5 ? 1 : -1),
            vx: (Math.random() - .5) * .12,
            vy: (Math.random() - .5) * .05,
            type: Math.random() > .88 ? 'sparkle' : 'dot',
            size: Math.random() * 6 + 3,
        };
    }

    function init() {
        resize();
        const count = Math.floor(W * H / 3500) + 40;
        stars = Array.from({ length: count }, mkStar);
    }

    function drawSparkle(x, y, size, alpha) {
        ctx.save();
        ctx.translate(x, y);
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.fillStyle = '#fad643';
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
            const a = (i * Math.PI) / 2;
            ctx.lineTo(Math.cos(a) * size, Math.sin(a) * size);
            ctx.lineTo(Math.cos(a + Math.PI / 4) * size * .12, Math.sin(a + Math.PI / 4) * size * .12);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        // Deep space gradient
        const bg = ctx.createRadialGradient(W * .35, H * .4, 0, W * .35, H * .4, W * .9);
        bg.addColorStop(0, '#0d0038');
        bg.addColorStop(.6, '#05001a');
        bg.addColorStop(1, '#020010');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // Blue nebula glow
        const nb1 = ctx.createRadialGradient(W * .75, H * .25, 0, W * .75, H * .25, W * .45);
        nb1.addColorStop(0, 'rgba(38,0,227,.14)');
        nb1.addColorStop(1, 'transparent');
        ctx.fillStyle = nb1; ctx.fillRect(0, 0, W, H);

        // Gold nebula glow
        const nb2 = ctx.createRadialGradient(W * .15, H * .72, 0, W * .15, H * .72, W * .3);
        nb2.addColorStop(0, 'rgba(250,214,67,.06)');
        nb2.addColorStop(1, 'transparent');
        ctx.fillStyle = nb2; ctx.fillRect(0, 0, W, H);

        stars.forEach(s => {
            s.alpha += s.da;
            if (s.alpha >= 1 || s.alpha <= 0) { s.da = -s.da; s.alpha = Math.max(0, Math.min(1, s.alpha)); }
            s.x += s.vx; s.y += s.vy;
            if (s.x < -10) s.x = W + 10; if (s.x > W + 10) s.x = -10;
            if (s.y < -10) s.y = H + 10; if (s.y > H + 10) s.y = -10;

            if (s.type === 'sparkle') {
                drawSparkle(s.x, s.y, s.size, s.alpha * .85);
            } else {
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
                ctx.fill();
            }
        });
        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', init);
    init();
    draw();
})();

/* =====================================================
   NAVBAR — scroll effect
===================================================== */
(function () {
    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            nav.style.background = 'rgba(4,0,26,.98)';
            nav.style.boxShadow = '0 4px 35px rgba(0,0,0,.6)';
        } else {
            nav.style.background = 'rgba(4,0,26,.82)';
            nav.style.boxShadow = 'none';
        }
    });
})();

/* =====================================================
   HAMBURGER MENU
===================================================== */
function toggleMenu() {
    const links = document.getElementById('navLinks');
    const btn = document.getElementById('hamburger');
    links.classList.toggle('open');
    btn.classList.toggle('active');
    btn.setAttribute('aria-expanded', links.classList.contains('open'));
}
document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
        document.getElementById('navLinks').classList.remove('open');
        document.getElementById('hamburger').classList.remove('active');
    });
});

/* =====================================================
   REVEAL ON SCROLL — IntersectionObserver
===================================================== */
(function () {
    const targets = document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: .12 });
    targets.forEach(t => obs.observe(t));
})();

/* =====================================================
   COUNTER ANIMATION
===================================================== */
(function () {
    const counters = document.querySelectorAll('.stat-val[data-target]');
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            const el = e.target;
            const target = +el.dataset.target;
            const suffix = target === 98 ? '+' : (target === 500 ? '+' : '');
            let cur = 0; const step = Math.ceil(target / 60);
            const id = setInterval(() => {
                cur += step; if (cur >= target) { cur = target; clearInterval(id); }
                el.textContent = cur + (target === 98 ? '%' : suffix);
            }, 25);
            obs.unobserve(el);
        });
    }, { threshold: .5 });
    counters.forEach(c => obs.observe(c));
})();

/* =====================================================
   CONTACT FORM
===================================================== */
function sendMsg(e) {
    const btn      = e.currentTarget;
    const nome     = document.getElementById('cf-name').value.trim();
    const email    = document.getElementById('cf-email').value.trim();
    const assunto  = (document.getElementById('cf-subject')?.value || '').trim();
    const mensagem = document.getElementById('cf-msg').value.trim();

    if (!nome || !email || !mensagem) {
        btn.style.background = '#e32600';
        btn.textContent = '⚠ Preencha todos os campos obrigatórios';
        setTimeout(() => { btn.style.background = ''; btn.textContent = '✦ Enviar mensagem'; }, 2500);
        return;
    }

    btn.textContent = 'Enviando...';
    btn.disabled = true;

    fetch('/contato', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ nome, email, assunto, mensagem })
    })
    .then(r => r.json())
    .then(data => {
        if (!data.ok) throw new Error(data.erro || 'Erro');
        btn.textContent = '✦ Enviar mensagem';
        btn.disabled = false;
        btn.style.background = '';
        document.getElementById('successMsg').style.display = 'block';
        ['cf-name', 'cf-email', 'cf-subject', 'cf-msg'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        setTimeout(() => { document.getElementById('successMsg').style.display = 'none'; }, 5000);
    })
    .catch(() => {
        btn.disabled = false;
        btn.style.background = '#e32600';
        btn.textContent = '⚠ Erro ao enviar. Tente novamente.';
        setTimeout(() => { btn.style.background = ''; btn.textContent = '✦ Enviar mensagem'; }, 3000);
    });
}