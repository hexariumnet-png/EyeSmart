/* =====================================================
   EYESMART — Teen Health | script.js
   ===================================================== */

// ─── 1. NAVBAR — scroll + hamburger + active link ───
const navbar   = document.getElementById('navbar');
const hamburger= document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const allLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);

  // Active link tracking
  let current = '';
  document.querySelectorAll('section[id]').forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 130) current = sec.id;
  });
  allLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
allLinks.forEach(a => a.addEventListener('click', () => {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
}));


// ─── 2. SMOOTH SCROLL ───────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});


// ─── 3. SCROLL REVEAL ───────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const delay = e.target.dataset.delay || 0;
      setTimeout(() => e.target.classList.add('visible'), +delay);
    }
  });
}, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


// ─── 4. HERO COUNTER ANIMATION ──────────────────────
function animateCount(el, target, dur = 1600) {
  let start = null;
  const step = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(eased * target);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target, +e.target.dataset.to);
      countObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.count').forEach(el => countObs.observe(el));


// ─── 5. TIMER 20-20-20 ──────────────────────────────
const CIRC = 2 * Math.PI * 58; // r=58
const timerRing  = document.getElementById('timerRing');
const timerNum   = document.getElementById('timerNum');
const timerMsg   = document.getElementById('timerMsg');
const timerStart = document.getElementById('timerStart');
const timerReset = document.getElementById('timerReset');

let timerSecs    = 20 * 60;
let timerRunning = false;
let timerInterval= null;
let restInterval = null;

timerRing.style.strokeDasharray  = CIRC;
timerRing.style.strokeDashoffset = 0;

const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

function setRing(secs, total) {
  const offset = CIRC * (1 - secs / total);
  timerRing.style.strokeDashoffset = offset;
  // Color shift
  const pct = secs / total;
  if (pct > 0.5)       timerRing.setAttribute('stroke', '#FF6B6B');
  else if (pct > 0.25) timerRing.setAttribute('stroke', '#FFD93D');
  else                 timerRing.setAttribute('stroke', '#4ECDC4');
}

function startTimer() {
  if (timerRunning) return;
  timerRunning = true;
  timerStart.textContent = '⏸ Pause';
  timerMsg.textContent   = '📚 Sesi aktif — stay focused!';

  timerInterval = setInterval(() => {
    timerSecs--;
    timerNum.textContent = fmt(timerSecs);
    setRing(timerSecs, 20 * 60);

    if (timerSecs <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      timerStart.textContent = '▶ Mulai Lagi';
      timerMsg.innerHTML = '🎉 Waktunya istirahat! Tatap benda 6 meter selama <strong>20 detik</strong>!';
      document.title = '👁️ Istirahat Mata Sekarang! — EyeSmart';
      setTimeout(() => document.title = '👁️ EyeSmart', 6000);
      startRest();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  timerStart.textContent = '▶ Lanjutkan';
  timerMsg.textContent   = '⏸ Dijeda. klik Lanjutkan kalau siap!';
}

function resetTimer() {
  clearInterval(timerInterval);
  clearInterval(restInterval);
  timerRunning = false;
  timerSecs = 20 * 60;
  timerNum.textContent  = '20:00';
  timerMsg.textContent  = 'Siap memulai sesi belajar? 📚';
  timerStart.textContent= '▶ Mulai';
  timerRing.style.strokeDashoffset = 0;
  timerRing.setAttribute('stroke', '#FF6B6B');
}

function startRest() {
  let rest = 20;
  timerNum.textContent = `00:${String(rest).padStart(2,'0')}`;
  setRing(rest, 20);
  restInterval = setInterval(() => {
    rest--;
    timerNum.textContent = `00:${String(rest).padStart(2,'0')}`;
    setRing(rest, 20);
    if (rest <= 0) {
      clearInterval(restInterval);
      timerMsg.textContent   = '✅ Selesai istirahat! Matamu segar kembali. Mau mulai sesi baru?';
      timerStart.textContent = '▶ Sesi Baru';
      timerSecs = 20 * 60;
      timerNum.textContent = '20:00';
      timerRing.style.strokeDashoffset = 0;
      timerRing.setAttribute('stroke', '#FF6B6B');
    }
  }, 1000);
}

timerStart.addEventListener('click', () => {
  timerRunning ? pauseTimer() : startTimer();
});
timerReset.addEventListener('click', resetTimer);


// ─── 6. QUIZ ────────────────────────────────────────
const questions = [
  {
    q: '⏱️ Seberapa sering kamu mengistirahatkan mata saat menggunakan layar dalam waktu lama?',
    opts: [
      { t: 'Rutin setiap 20 menit, sesuai aturan 20-20-20 yang direkomendasikan AOA', s: 3 },
      { t: 'Sesekali kalau ingat, mungkin tiap 1–2 jam sekali', s: 2 },
      { t: 'Jarang, hanya berhenti kalau mata sudah terasa sakit', s: 1 },
      { t: 'Tidak pernah berhenti sampai selesai atau ketiduran', s: 0 }
    ]
  },
  {
    q: '🌙 Apa yang biasanya kamu lakukan dalam 1 jam sebelum tidur?',
    opts: [
      { t: 'Sudah jauh dari layar, baca buku, journaling, atau bersantai', s: 3 },
      { t: 'Masih pakai HP tapi aktifkan Night Mode & kurangi brightness', s: 2 },
      { t: 'Masih scroll media sosial atau nonton video seperti biasa', s: 1 },
      { t: 'Sering ketiduran sambil pegang HP, layar langsung ke wajah', s: 0 }
    ]
  },
  {
    q: '📏 Bagaimana posisi layar kamu saat digunakan?',
    opts: [
      { t: 'Saya jaga jarak: ≥40 cm untuk HP, ≥50 cm untuk laptop (sesuai AOA)', s: 3 },
      { t: 'Kadang terlalu dekat tapi saya sadari dan sering perbaiki', s: 2 },
      { t: 'HP sering sangat dekat ke wajah, terutama saat rebahan', s: 1 },
      { t: 'Belum pernah memikirkan jarak layar ke mata sama sekali', s: 0 }
    ]
  },
  {
    q: '😵 Seberapa sering kamu mengalami gejala Digital Eye Strain (mata lelah, perih, sakit kepala, buram sementara)?',
    opts: [
      { t: 'Hampir tidak pernah', s: 3 },
      { t: 'Sesekali, 1–2 kali seminggu', s: 2 },
      { t: 'Cukup sering, hampir tiap hari setelah banyak pakai layar', s: 1 },
      { t: 'Hampir setiap kali selesai pakai layar dalam waktu lama', s: 0 }
    ]
  },
  {
    q: '🌳 Seberapa banyak waktu yang kamu habiskan di luar ruangan (tanpa layar) setiap hari?',
    opts: [
      { t: 'Cukup banyak, minimal 1–2 jam di luar ruangan setiap hari', s: 3 },
      { t: 'Lumayan, mungkin 30–60 menit per hari', s: 2 },
      { t: 'Sedikit, paling sering hanya perjalanan singkat', s: 1 },
      { t: 'Hampir tidak pernah keluar, hampir semua waktu di dalam dengan layar', s: 0 }
    ]
  }
];

let qIdx = 0, score = 0;
const qCard     = document.getElementById('quizCard');
const qResult   = document.getElementById('quizResult');
const qProgFill = document.getElementById('qprogFill');
const qProgLbl  = document.getElementById('qprogLabel');
const qQ        = document.getElementById('quizQ');
const qOpts     = document.getElementById('quizOpts');

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let currentQuestions = shuffleArray(questions);

function loadQ(i) {
  const data = currentQuestions[i];
  // Shuffle the options each time a question loads
  const shuffledOpts = shuffleArray(data.opts);

  qCard.style.opacity = '0';
  qCard.style.transform = 'translateX(16px)';

  setTimeout(() => {
    qQ.textContent = data.q;
    qOpts.innerHTML = '';
    const labels = ['A','B','C','D'];
    shuffledOpts.forEach((o, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt';
      btn.innerHTML = `<span class="opt-lbl">${labels[idx]}</span>${o.t}`;
      btn.onclick = () => pickOpt(o.s);
      qOpts.appendChild(btn);
    });
    qProgFill.style.width = ((i + 1) / currentQuestions.length * 100) + '%';
    qProgLbl.textContent  = `Pertanyaan ${i + 1} dari ${currentQuestions.length}`;
    qCard.style.transition = 'opacity .35s ease, transform .35s ease';
    qCard.style.opacity = '1';
    qCard.style.transform = 'translateX(0)';
  }, 200);
}

function pickOpt(s) {
  score += s;
  qIdx++;
  if (qIdx < currentQuestions.length) {
    loadQ(qIdx);
  } else {
    showResult();
  }
}

function showResult() {
  const max = currentQuestions.length * 3;
  const pct = (score / max) * 100;

  qCard.style.display   = 'none';
  qResult.style.display = 'block';
  qProgFill.style.width = '100%';
  qProgLbl.textContent  = 'Selesai! ✅';

  let emoji, title, desc;
  if (pct >= 80) {
    emoji = '🏆'; title = 'Kebiasaan Digitalmu Sangat Baik!';
    desc  = 'Kamu sudah menerapkan banyak panduan dari AOA dan AAO untuk menjaga kesehatan mata. Pertahankan terus — dan jadilah contoh buat teman-temanmu!';
  } else if (pct >= 60) {
    emoji = '👍'; title = 'Lumayan — Ada Ruang untuk Berkembang!';
    desc  = 'Kamu sudah punya beberapa kebiasaan baik, tapi masih ada yang perlu diperbaiki. Coba mulai dari yang termudah: aktifkan night mode malam ini dan pasang pengingat istirahat mata setiap 20 menit.';
  } else if (pct >= 40) {
    emoji = '⚠️'; title = 'Matamu Butuh Perhatian Lebih!';
    desc  = 'Beberapa kebiasaan digitalmu cukup berisiko. Mulai dari langkah kecil, terapkan aturan 20-20-20 hari ini dan coba bebas layar 30 menit sebelum tidur. Kalau sering alami gejala DES, pertimbangkan konsultasi ke dokter mata.';
  } else {
    emoji = '🚨'; title = 'Waktunya Ubah Kebiasaan Sekarang!';
    desc  = 'Kebiasaan digitalmu berisiko tinggi untuk kesehatan mata. AAO merekomendasikan pemeriksaan mata komprehensif setidaknya 1x setahun — terutama jika kamu sering mengalami gejala seperti mata lelah, sakit kepala, atau penglihatan buram.';
  }

  document.getElementById('rEmoji').textContent  = emoji;
  document.getElementById('rTitle').textContent  = title;
  document.getElementById('rDesc').textContent   = desc;
  document.getElementById('rScoreTxt').textContent = `Skor kamu: ${score} dari ${max} (${Math.round(pct)}%)`;

  setTimeout(() => {
    document.getElementById('rFill').style.width = pct + '%';
  }, 300);
}

document.getElementById('quizRetry').addEventListener('click', () => {
  qIdx = 0; score = 0;
  currentQuestions = shuffleArray(questions); // reshuffle on retry
  qCard.style.display   = 'block';
  qResult.style.display = 'none';
  qCard.style.opacity   = '1';
  qCard.style.transform = 'none';
  document.getElementById('rFill').style.width = '0%';
  loadQ(0);
});

// Keyboard A/B/C/D shortcut for quiz
document.addEventListener('keydown', e => {
  const map = { a:0, b:1, c:2, d:3, A:0, B:1, C:2, D:3 };
  const opts = document.querySelectorAll('.quiz-opt');
  if (map[e.key] !== undefined && opts.length && qCard.style.display !== 'none') {
    opts[map[e.key]]?.click();
  }
});

// Init quiz
// currentQuestions already initialized above with shuffleArray(questions)
loadQ(0);


// ─── 7. PAGE FADE-IN ────────────────────────────────
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity .4s ease';
  requestAnimationFrame(() => document.body.style.opacity = '1');
});


// ─── 9. CHART ANIMATIONS ────────────────────────────
function animateCharts() {
  // Bar chart
  const barObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const bars = e.target.querySelectorAll('.bar[data-pct]');
      bars.forEach(bar => {
        const pct = +bar.dataset.pct;
        setTimeout(() => { bar.style.height = (pct / 50 * 100) + '%'; }, 200);
      });
      barObs.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.bar-chart').forEach(el => barObs.observe(el));

  // Donut
  const donutObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const ring = e.target.querySelector('.donut-ring');
      if (ring) {
        const dash = ring.dataset.dash || '246.6';
        setTimeout(() => {
          ring.style.strokeDasharray = dash + ' 365';
        }, 300);
      }
      donutObs.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.donut-wrap').forEach(el => donutObs.observe(el));

  // Horizontal bars
  const hbarObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.hbar-fill[data-w]').forEach((bar, i) => {
        setTimeout(() => { bar.style.width = bar.dataset.w + '%'; }, 150 + i * 120);
      });
      hbarObs.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.hbar-list').forEach(el => hbarObs.observe(el));

  // Blink bars
  const blinkObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.blink-fill[data-w]').forEach((bar, i) => {
        setTimeout(() => { bar.style.width = bar.dataset.w + '%'; }, 200 + i * 200);
      });
      blinkObs.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.blink-compare').forEach(el => blinkObs.observe(el));
}

animateCharts();

console.log('%c👁️ EyeSmart', 'color:#FF6B6B;font-size:22px;font-weight:900');
console.log('%cJaga matamu, jaga masa depanmu! — Group Teen Health · SAT Project 2026', 'color:#4ECDC4;font-size:13px');
console.log('%cDibuat: 2026 | Sumber: Kemenkes RI, AAO, AOA, WHO, Perdami, Vision Council, Sleep Research Society', 'color:#FFD93D;font-size:11px');
