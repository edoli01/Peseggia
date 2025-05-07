history.scrollRestoration = 'manual';
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};



  document.addEventListener("mousemove", (e) => {
      const x = e.clientX;
      const y = e.clientY + window.scrollY; // Aggiungi lo scrollY per aggiornare correttamente la posizione
      document.querySelector('.lens').style.left = `${x - 75}px`;
      document.querySelector('.lens').style.top = `${y - 75}px`;
      document.querySelector('.background.blurred').style.setProperty('--x', `${x}px`);
      document.querySelector('.background.blurred').style.setProperty('--y', `${y}px`);
  });

  document.addEventListener("scroll", () => {
      const scrollY = window.scrollY;
      const background = document.querySelector('.background');
      const blurredBackground = document.querySelector('.background.blurred');
      
      background.style.backgroundPositionY = `${scrollY * 0.3}px`;
      blurredBackground.style.backgroundPositionY = `${scrollY * 0.3}px`;
  });

  document.addEventListener("mousemove", (e) => {
  const x = e.clientX;
  const y = e.clientY + window.scrollY; // Aggiungi lo scrollY per aggiornare correttamente la posizione
  document.querySelector('.lens').style.left = `${x - 150}px`; // Centra la lente
  document.querySelector('.lens').style.top = `${y - 150}px`;
  document.querySelector('.content').style.setProperty('--x', `${x}px`);
  document.querySelector('.content').style.setProperty('--y', `${y}px`);
});


let scrolling = false;

// Funzione per uno scroll fluido personalizzato
function smoothScrollTo(targetY, duration = 1000) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  let startTime = null;

  function animation(currentTime) {
    if (!startTime) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1); // Limita il progresso a 1
    const ease = progress < 0.5
      ? 2 * progress * progress
      : -1 + (4 - 2 * progress) * progress; // Funzione di easing

    window.scrollTo(0, startY + distance * ease);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

// Scroll verso la seconda sezione quando si inizia a scrollare
window.addEventListener('wheel', function (e) {
  if (scrolling) return;

  const scrollTop = window.scrollY;
  const firstSection = document.querySelector('.intro');
  const secondSection = document.querySelector('#description');

  // Scroll automatico verso la seconda sezione
  if (scrollTop < 50 && e.deltaY > 0) {
    scrolling = true;
    smoothScrollTo(secondSection.offsetTop, 1500); // Scroll fluido verso la seconda sezione
    setTimeout(() => scrolling = false, 1500); // Evita lo scroll ripetuto
  }

  // Blocca lo scroll verso l'alto
  if (e.deltaY < 0) {
    e.preventDefault(); // Impedisce lo scroll verso l'alto
  }
}, { passive: false }); // Imposta l'evento come non passivo per consentire preventDefault()

// Scroll alla prima sezione quando si clicca il pulsante "Torna su"
const scrollToTopBtn = document.getElementById('torna-su');
if (scrollToTopBtn) {
  scrollToTopBtn.addEventListener('click', function (e) {
    e.preventDefault();
    scrolling = true;
    smoothScrollTo(0, 1500); // Scroll fluido verso l'alto
    setTimeout(() => scrolling = false, 1500);
  });
}

// Mostra il pulsante "Torna su" quando l'utente scrolla verso il basso
document.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  if (scrollY > window.innerHeight) {
    scrollToTopBtn.style.display = 'block'; // Mostra il pulsante
  } else {
    scrollToTopBtn.style.display = 'none'; // Nascondi il pulsante
  }
});