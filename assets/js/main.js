// ==========================================================================
// PM3 — Membership Landing Page
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {

  // ---------- FAQ accordion ----------
  const faqItems = document.querySelectorAll(".faq-item");

  function setAnswerHeight(item, open) {
    const answer = item.querySelector(".faq-answer");
    answer.style.maxHeight = open ? answer.scrollHeight + "px" : "0px";
  }

  faqItems.forEach((item) => {
    setAnswerHeight(item, item.classList.contains("open"));

    item.querySelector(".faq-question").addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      faqItems.forEach((other) => {
        other.classList.remove("open");
        setAnswerHeight(other, false);
      });

      if (!isOpen) {
        item.classList.add("open");
        setAnswerHeight(item, true);
      }
    });
  });

  window.addEventListener("resize", () => {
    faqItems.forEach((item) => {
      if (item.classList.contains("open")) setAnswerHeight(item, true);
    });
  });

  // ---------- Mobile nav toggle ----------
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      mainNav.classList.toggle("is-open");
    });
  }

  // ---------- Carousels (setas + arrastar com o mouse) ----------
  document.querySelectorAll(".carousel").forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const prevBtn = carousel.querySelector(".carousel-arrow.prev");
    const nextBtn = carousel.querySelector(".carousel-arrow.next");
    if (!track) return;

    function scrollByCards(direction) {
      const maxScroll = track.scrollWidth - track.clientWidth;
      const atEnd = track.scrollLeft >= maxScroll - 4;
      const atStart = track.scrollLeft <= 4;

      if (direction === 1 && atEnd) {
        track.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }
      if (direction === -1 && atStart) {
        track.scrollTo({ left: maxScroll, behavior: "smooth" });
        return;
      }

      const card = track.firstElementChild;
      const cardWidth = card ? card.getBoundingClientRect().width : 240;
      const gap = 20;
      track.scrollBy({ left: direction * (cardWidth + gap) * 2, behavior: "smooth" });
    }

    if (prevBtn) prevBtn.addEventListener("click", () => scrollByCards(-1));
    if (nextBtn) nextBtn.addEventListener("click", () => scrollByCards(1));

    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    let dragged = false;

    track.addEventListener("pointerdown", (e) => {
      isDown = true;
      dragged = false;
      startX = e.clientX;
      startScroll = track.scrollLeft;
      track.setPointerCapture(e.pointerId);
    });

    track.addEventListener("pointermove", (e) => {
      if (!isDown) return;
      const delta = e.clientX - startX;
      if (Math.abs(delta) > 4) dragged = true;
      track.scrollLeft = startScroll - delta;
    });

    ["pointerup", "pointerleave", "pointercancel"].forEach((evt) => {
      track.addEventListener(evt, () => { isDown = false; });
    });

    // Evita que o clique de arrastar acione links dentro do card
    track.addEventListener("click", (e) => {
      if (dragged) e.preventDefault();
    }, true);
  });

  // ---------- Hero: rede de partículas em canvas ----------
  const heroCanvas = document.querySelector(".hero-canvas");

  if (heroCanvas && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const ctx = heroCanvas.getContext("2d");
    const hero = document.querySelector(".hero");
    let particles = [];
    let width = 0;
    let height = 0;
    let mouseX = null;
    let mouseY = null;

    const PARTICLE_COUNT = 60;
    const LINK_DISTANCE = 130;
    const REPEL_RADIUS = 130;
    const COLORS = ["176,77,221", "102,69,177", "218,203,246"];

    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    hero.addEventListener("mouseleave", () => {
      mouseX = null;
      mouseY = null;
    });

    function resize() {
      width = hero.clientWidth;
      height = hero.clientHeight;
      heroCanvas.width = width * devicePixelRatio;
      heroCanvas.height = height * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }

    function makeParticles() {
      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
      }));
    }

    function step() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        if (mouseX !== null) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < REPEL_RADIUS && dist > 0.01) {
            const force = (1 - dist / REPEL_RADIUS) * 0.6;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DISTANCE) {
            ctx.strokeStyle = `rgba(176,77,221,${0.16 * (1 - dist / LINK_DISTANCE)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},0.75)`;
        ctx.fill();
      });

      requestAnimationFrame(step);
    }

    resize();
    makeParticles();
    requestAnimationFrame(step);

    window.addEventListener("resize", () => {
      resize();
      makeParticles();
    });
  }

});
