(() => {
  'use strict';
  const reduceMotion = window.JucaMotion || {reduced: false};
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  function closeMenu() {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
    mobileNav.hidden = true;
  }
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    menuToggle.setAttribute('aria-label', expanded ? 'Abrir menu' : 'Fechar menu');
    mobileNav.hidden = expanded;
    if (!expanded && window.gsap && !reduceMotion.reduced) gsap.from(mobileNav, {y: -8, autoAlpha: 0, duration: .25, clearProps: 'all'});
  });
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('click', e => { if (!mobileNav.contains(e.target) && !menuToggle.contains(e.target)) closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 760) closeMenu(); }, {passive:true});

  const services = {
    reabilitacao: {eyebrow:'REABILITAÇÃO ORAL',title:'Novos motivos para sorrir.',description:'O cuidado começa por entender a sua história e o que o seu sorriso precisa. A equipe avalia as possibilidades e organiza cada etapa do tratamento com você.',items:['Próteses dentárias','Implantes dentários','Reabilitação oral','Cirurgias dentárias']},
    estetica: {eyebrow:'ESTÉTICA E ORTODONTIA',title:'Seu sorriso, com a sua essência.',description:'Um planejamento que considera saúde, função e os seus objetivos. Conheça as possibilidades com a orientação dos nossos profissionais.',items:['Ortodontia e alinhadores Invisalign','Clareamento dental','Facetas dentárias','Harmonização facial','Bichectomia']},
    familia: {eyebrow:'CUIDADO EM TODAS AS FASES',title:'Acompanhando cada fase da sua vida.',description:'Do primeiro contato com o dentista aos cuidados da maturidade, reunimos diferentes especialidades para olhar para cada pessoa por inteiro.',items:['Odontopediatria e prevenção','Endodontia e periodontia','Odontogeriatria','Acompanhamento da saúde bucal']},
    acolhimento: {eyebrow:'QUEM CUIDA DE VOCÊ',title:'Muito prazer, Dr. Juarez Jucá.',description:'Cirurgião-dentista formado pela UNIGRANRIO, especialista em reabilitação oral e prótese, com mais de 30 anos de experiência. Reúne uma equipe de diferentes especialidades e acredita em uma odontologia avançada, feita com acolhimento.',items:['Mais de 30 anos de experiência','Odontologia integrada','Ambientes planejados para acolher','Sedação odontológica com médico anestesista, quando indicada']}
  };
  const dialog = document.getElementById('service-dialog');
  let lastTrigger = null;
  document.querySelectorAll('[data-service]').forEach(button => button.addEventListener('click', () => {
    const content = services[button.dataset.service];
    lastTrigger = button;
    document.getElementById('dialog-eyebrow').textContent = content.eyebrow;
    document.getElementById('dialog-title').textContent = content.title;
    document.getElementById('dialog-description').textContent = content.description;
    const list = document.getElementById('dialog-list');
    list.replaceChildren(...content.items.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
    dialog.showModal();
    document.body.classList.add('modal-open');
    if (window.gsap && !reduceMotion.reduced) gsap.fromTo(dialog, {y: 20, opacity: 0, scale: .98}, {y: 0, opacity: 1, scale: 1, duration:.3, ease:'power2.out'});
  }));
  function closeDialog() {
    if (!dialog.open) return;
    const finish = () => { dialog.close(); };
    if (window.gsap && !reduceMotion.reduced) gsap.to(dialog, {y: 12, opacity: 0, duration:.18, ease:'power2.in', onComplete:finish});
    else finish();
  }
  dialog.querySelector('.dialog-close').addEventListener('click', closeDialog);
  dialog.addEventListener('cancel', event => {event.preventDefault(); closeDialog();});
  dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeDialog(); } });
  dialog.addEventListener('close', () => {document.body.classList.remove('modal-open'); if (lastTrigger) lastTrigger.focus({preventScroll:true});});
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  // Native details retain a fully functional FAQ when JavaScript is unavailable.
  document.querySelectorAll('.faq-item').forEach(item => item.addEventListener('toggle', () => {
    if (item.open && window.gsap && !reduceMotion.reduced) gsap.fromTo(item.querySelector('.faq-answer'), {opacity:0,y:-5}, {opacity:1,y:0,duration:.24,clearProps:'all'});
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }));

  // The scanner card now opens its explanation in the existing FAQ.
  const scannerQuestion = document.getElementById('tecnologia');
  document.querySelector('.scanner-card').addEventListener('click', () => {
    scannerQuestion.open = true;
  });
  if (location.hash === '#tecnologia') scannerQuestion.open = true;

  const links = [...document.querySelectorAll('.nav a')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {if (entry.isIntersecting) {
      const hash = entry.target.id === 'conteudo' ? '#inicio' : '#' + entry.target.id;
      links.forEach(link => link.classList.toggle('active',link.getAttribute('href') === hash));
    }});
  },{rootMargin:'-10% 0px -65% 0px',threshold:0});
  ['sobre','cuidados','duvidas'].forEach(id => observer.observe(document.getElementById(id)));
  window.addEventListener('scroll', () => {if (window.scrollY < 400) links.forEach(a=>a.classList.toggle('active',a.hash==='#inicio'));},{passive:true});

})();
