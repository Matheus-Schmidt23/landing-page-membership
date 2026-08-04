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

});
