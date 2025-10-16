/*
  Script principal do site de Yuri Cesar
  - Controla fade do hero na rolagem
  - Ativa animações com Intersection Observer
  - Gerencia navegação, cursor e carrossel de projetos
  - Envia o formulário via Formspree
*/

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initHeroFade();
  initIntersectionAnimations();
  initProjectsCarousel();
  initCustomCursor();
  initContactForm();
});

/**
 * Ajusta o destaque do link ativo e adiciona rolagem suave personalizada
 */
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = [...navLinks].map((link) => document.querySelector(link.getAttribute('href')));

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const index = sections.indexOf(entry.target);
        if (index === -1) return;
        if (entry.isIntersecting) {
          navLinks.forEach((link) => link.classList.remove('active'));
          navLinks[index].classList.add('active');
        }
      });
    },
    { threshold: 0.6 }
  );

  sections.forEach((section) => {
    if (section) observer.observe(section);
  });
}

/**
 * Controla o efeito de fade do overlay do hero ao rolar a página
 */
function initHeroFade() {
  const overlay = document.querySelector('.hero-overlay');
  const hero = document.querySelector('.hero');

  if (!overlay || !hero) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const heroHeight = hero.offsetHeight;
    const fadeFactor = Math.min(scrollTop / heroHeight, 1);
    overlay.style.opacity = String(1 - fadeFactor * 0.8);
  });
}

/**
 * Ativa animações de entrada usando Intersection Observer
 */
function initIntersectionAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.25,
      rootMargin: '0px 0px -80px 0px',
    }
  );

  document.querySelectorAll('.hidden').forEach((element) => observer.observe(element));
}

/**
 * Carrossel suave para os cartões de projetos
 */
function initProjectsCarousel() {
  const cards = document.querySelectorAll('.project-card');
  if (!cards.length) return;

  let current = 0;
  const interval = 4500;

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const link = card.dataset.link;
      if (link) window.open(link, '_blank');
    });
  });

  setInterval(() => {
    cards[current].classList.remove('active');
    current = (current + 1) % cards.length;
    cards[current].classList.add('active');
  }, interval);
}

/**
 * Cursor personalizado que acompanha o mouse e reage a interações
 */
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  if (!cursor) return;

  const hoverTargets = 'a, button, .btn, .project-card';

  document.addEventListener('mousemove', (event) => {
    cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
  });

  document.querySelectorAll(hoverTargets).forEach((element) => {
    element.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    element.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
  });
}

/**
 * Integração com Formspree para envio do formulário
 * Substitua o endpoint por um ID válido do Formspree.
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.querySelector('.form-feedback');
  if (!form || !feedback) return;

  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mwkgrqyj'; // Atualize com o endpoint do proprietário

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    feedback.textContent = 'Enviando mensagem...';

    const formData = new FormData(form);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });

      if (response.ok) {
        // Atualização: feedback alinhado à nova paleta azul
        feedback.textContent = 'Mensagem enviada! Em breve entraremos em contato.';
        feedback.style.color = '#3a86ff';
        form.reset();
      } else {
        throw new Error('Erro no envio');
      }
    } catch (error) {
      feedback.textContent = 'Não foi possível enviar. Tente novamente mais tarde ou use outro canal de contato.';
      feedback.style.color = '#ff8585';
    }
  });
}
