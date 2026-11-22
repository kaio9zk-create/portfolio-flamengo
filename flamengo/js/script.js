document.addEventListener('DOMContentLoaded', () => {
  // Menu mobile
  const btn = document.querySelector('.menu-btn');
  const menu = document.getElementById('menu');
  btn.addEventListener('click', () => {
    const aberto = menu.classList.toggle('aberto');
    btn.setAttribute('aria-expanded', aberto);
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('aberto');
    btn.setAttribute('aria-expanded', 'false');
  }));

  // Contador dos títulos: sobe de 0 até o número quando aparece na tela
  const semMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const contar = el => {
    const fim = +el.dataset.contar;
    if (semMovimento) return;
    const inicio = performance.now(), duracao = 1400;
    const passo = agora => {
      const t = Math.min((agora - inicio) / duracao, 1);
      el.textContent = Math.round(fim * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  };
  const obsNum = new IntersectionObserver((entradas, o) => {
    entradas.forEach(e => { if (e.isIntersecting) { contar(e.target); o.unobserve(e.target); } });
  }, { threshold: .6 });
  document.querySelectorAll('[data-contar]').forEach(n => obsNum.observe(n));

  // Destaca no menu a seção visível
  const links = [...menu.querySelectorAll('a')];
  const obs = new IntersectionObserver(entradas => {
    entradas.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.toggle('ativo', l.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section').forEach(s => obs.observe(s));

  // Validação do formulário
  const form = document.getElementById('form');
  const aviso = document.getElementById('aviso');
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valido = true;
    form.querySelectorAll('input, textarea').forEach(c => {
      const vazio = !c.value.trim();
      const emailRuim = c.type === 'email' && !/^\S+@\S+\.\S+$/.test(c.value);
      const erro = vazio || emailRuim;
      c.classList.toggle('erro', erro);
      if (erro) valido = false;
    });
    aviso.className = valido ? 'ok' : 'falha';
    aviso.textContent = valido
      ? 'Recado enviado! (exemplo: para receber de verdade, conecte um serviço como o Formspree)'
      : 'Preencha todos os campos e use um e-mail válido.';
    if (valido) form.reset();
  });

  document.getElementById('ano').textContent = new Date().getFullYear();
});
