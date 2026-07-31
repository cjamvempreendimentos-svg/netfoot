const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.main-nav');
if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.textContent = open ? 'Fechar' : 'Menu';
  });
}

const form = document.querySelector('#interest-form');
if (form) {
  const params = new URLSearchParams(location.search);
  const requested = params.get('interesse');
  const requestedDetails = params.get('detalhes');
  if (requested) {
    const option = [...form.interest.options].find(item => item.value === requested);
    if (option) form.interest.value = requested;
  }
  if (requestedDetails) form.details.value = requestedDetails;

  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const message = [
      `Olá, Netfoot! Meu nome é ${data.get('name')}.`,
      `Estou procurando: ${data.get('interest')}.`,
      data.get('details') ? `Detalhes: ${data.get('details')}` : ''
    ].filter(Boolean).join('\n');
    const destination = `https://wa.me/5573991268473?text=${encodeURIComponent(message)}`;
    window.open(destination, '_blank', 'noopener');
  });
}

const consultant = document.querySelector('[data-style-consultant]');
if (consultant) {
  const choices = {};
  const optionButtons = [...consultant.querySelectorAll('[data-group]')];
  const submit = consultant.querySelector('.consultant-submit');
  const result = consultant.querySelector('.consultant-result');
  const progress = [...consultant.querySelectorAll('.consultant-progress span')];
  const steps = [...consultant.querySelectorAll('.consultant-step')];
  const occasions = {
    trabalho: { title: 'Presença equilibrada para todos os dias', shoe: 'Tênis casual ou sapatênis confortável', copy: 'Uma escolha funcional, alinhada e fácil de usar durante toda a rotina.' },
    'fim-de-semana': { title: 'Leveza com personalidade', shoe: 'Tênis casual, sandália ou chinelo', copy: 'Uma combinação descontraída para aproveitar o dia sem abrir mão do estilo.' },
    especial: { title: 'Elegância que fica na memória', shoe: 'Calçado alinhado ou sandália elegante', copy: 'Uma presença mais refinada para celebrações e momentos importantes.' },
    movimento: { title: 'Energia do começo ao fim', shoe: 'Tênis esportivo com bom suporte', copy: 'Conforto e praticidade para acompanhar uma rotina ativa e cheia de movimento.' }
  };
  const priorityShoes = {
    conforto: 'com foco em conforto e leveza',
    elegancia: 'com acabamento elegante e visual marcante',
    versatilidade: 'versátil para diferentes combinações'
  };
  const scents = {
    fresco: 'Fresca, cítrica ou aromática',
    doce: 'Doce e envolvente',
    amadeirado: 'Amadeirada e elegante',
    intenso: 'Intensa e marcante'
  };

  const updateProgress = () => {
    const completed = ['occasion', 'priority', 'scent'].filter(key => choices[key]).length;
    progress.forEach((item, index) => item.classList.toggle('active', index <= Math.min(completed, 2)));
    steps.forEach(step => {
      const group = step.querySelector('[data-group]')?.dataset.group;
      step.classList.toggle('complete', Boolean(choices[group]));
    });
    submit.disabled = completed !== 3;
  };

  optionButtons.forEach(button => {
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => {
      const { group, value } = button.dataset;
      choices[group] = value;
      optionButtons.filter(item => item.dataset.group === group).forEach(item => {
        item.classList.toggle('selected', item === button);
        item.setAttribute('aria-pressed', String(item === button));
      });
      updateProgress();
    });
  });

  submit.addEventListener('click', () => {
    if (!choices.occasion || !choices.priority || !choices.scent) return;
    const recommendation = occasions[choices.occasion];
    const shoe = `${recommendation.shoe}, ${priorityShoes[choices.priority]}`;
    const scent = scents[choices.scent];
    result.querySelector('h3').textContent = recommendation.title;
    result.querySelector('.result-copy').textContent = recommendation.copy;
    result.querySelector('[data-result-shoe]').textContent = shoe;
    result.querySelector('[data-result-scent]').textContent = scent;
    const details = `Fiz o Consultor de Estilo Netfoot. Minha indicação foi: ${shoe} + fragrância ${scent.toLowerCase()}.`;
    result.querySelector('[data-result-contact]').href = `atendimento.html?interesse=atendimento&detalhes=${encodeURIComponent(details)}`;
    steps.forEach(step => { step.hidden = true; });
    submit.hidden = true;
    result.hidden = false;
  });

  consultant.querySelector('.consultant-reset').addEventListener('click', () => {
    Object.keys(choices).forEach(key => { delete choices[key]; });
    optionButtons.forEach(button => {
      button.classList.remove('selected');
      button.setAttribute('aria-pressed', 'false');
    });
    steps.forEach(step => { step.hidden = false; });
    submit.hidden = false;
    result.hidden = true;
    updateProgress();
  });

  updateProgress();
}

const helenia = document.createElement('section');
helenia.className = 'helenia';
helenia.innerHTML = `
  <button class="helenia-launcher" type="button" aria-expanded="false" aria-controls="helenia-panel">
    <span class="helenia-mark">H</span>
    <span><strong>HelenIA</strong><small>Ajuda para escolher</small></span>
  </button>
  <div class="helenia-panel" id="helenia-panel" role="dialog" aria-modal="false" aria-labelledby="helenia-title" hidden>
    <header class="helenia-header">
      <div><span class="helenia-mark">H</span><p><strong id="helenia-title">HelenIA Netfoot</strong><small>Atendimento guiado</small></p></div>
      <button class="helenia-close" type="button" aria-label="Fechar atendimento">×</button>
    </header>
    <div class="helenia-body" aria-live="polite"></div>
    <footer class="helenia-footer">
      <span>Não consulta estoque ou preço em tempo real.</span>
      <button class="helenia-restart" type="button">Recomeçar</button>
    </footer>
  </div>`;
document.body.appendChild(helenia);

const heleniaLauncher = helenia.querySelector('.helenia-launcher');
const heleniaPanel = helenia.querySelector('.helenia-panel');
const heleniaBody = helenia.querySelector('.helenia-body');
const heleniaClose = helenia.querySelector('.helenia-close');
const heleniaRestart = helenia.querySelector('.helenia-restart');
let heleniaAnswers = {};
let heleniaStep = 0;

const heleniaFlows = {
  calcados: [
    { key: 'publico', question: 'Para quem é o calçado?', options: ['Feminino', 'Masculino', 'Infantil'] },
    { key: 'uso', question: 'Em qual situação será usado?', options: ['Dia a dia', 'Trabalho', 'Esporte', 'Evento', 'Presente'] },
    { key: 'preferencia', question: 'O que mais importa nessa escolha?', options: ['Conforto', 'Leveza', 'Elegância', 'Versatilidade'] },
    { key: 'numeracao', question: 'Qual numeração você procura?', input: 'Ex.: 38' }
  ],
  perfume: [
    { key: 'publico', question: 'Para quem é a fragrância?', options: ['Feminina', 'Masculina', 'Unissex', 'Presente'] },
    { key: 'perfil', question: 'Qual perfil de fragrância prefere?', options: ['Fresca', 'Doce', 'Amadeirada', 'Intensa', 'Ainda não sei'] },
    { key: 'uso', question: 'Em qual ocasião pretende usar?', options: ['Dia a dia', 'Trabalho', 'Fim de semana', 'Evento', 'Presente'] },
    { key: 'detalhe', question: 'Tem alguma referência ou preferência?', input: 'Ex.: fragrância leve, marcante ou nome de referência', optional: true }
  ],
  combinacao: [
    { key: 'publico', question: 'Para quem é a combinação?', options: ['Feminina', 'Masculina', 'Infantil', 'Presente'] },
    { key: 'uso', question: 'Para qual momento?', options: ['Trabalho', 'Dia a dia', 'Fim de semana', 'Evento'] },
    { key: 'preferencia', question: 'Qual estilo deseja transmitir?', options: ['Confortável', 'Elegante', 'Casual', 'Marcante'] },
    { key: 'detalhe', question: 'Informe a numeração e alguma preferência de perfume.', input: 'Ex.: número 40 e fragrância fresca' }
  ],
  duvida: [
    { key: 'assunto', question: 'Sobre o que você quer falar?', options: ['Disponibilidade', 'Numeração', 'Formas de compra', 'Localização', 'Outra dúvida'] },
    { key: 'detalhe', question: 'Conte brevemente o que precisa saber.', input: 'Digite sua dúvida' }
  ]
};

const heleniaLabels = {
  calcados: 'Calçados',
  perfume: 'Perfumaria',
  combinacao: 'Calçado + perfume',
  duvida: 'Informações da loja'
};

const escapeHelenia = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;'
}[character]));

const openHelenia = () => {
  heleniaPanel.hidden = false;
  heleniaLauncher.setAttribute('aria-expanded', 'true');
  heleniaPanel.querySelector('button')?.focus();
};

const closeHelenia = () => {
  heleniaPanel.hidden = true;
  heleniaLauncher.setAttribute('aria-expanded', 'false');
  heleniaLauncher.focus();
};

const renderHeleniaStart = () => {
  heleniaAnswers = {};
  heleniaStep = 0;
  heleniaBody.innerHTML = `
    <div class="helenia-message">
      <p class="eyebrow">Vamos encontrar a melhor direção</p>
      <h2>O que você procura?</h2>
      <p>Responda algumas escolhas rápidas. No final, preparo um resumo para a equipe da Netfoot.</p>
    </div>
    <div class="helenia-options">
      <button type="button" data-helenia-flow="calcados"><strong>Calçados</strong><span>Modelo, uso e numeração</span></button>
      <button type="button" data-helenia-flow="perfume"><strong>Perfumaria</strong><span>Perfil e ocasião</span></button>
      <button type="button" data-helenia-flow="combinacao"><strong>Combinar os dois</strong><span>Uma indicação completa</span></button>
      <button type="button" data-helenia-flow="duvida"><strong>Tirar uma dúvida</strong><span>Falar com a loja</span></button>
    </div>`;
};

const finishHelenia = () => {
  const flow = heleniaAnswers.flow;
  const details = Object.entries(heleniaAnswers)
    .filter(([key]) => key !== 'flow')
    .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
    .join(' | ');
  const summary = `Atendimento HelenIA — Interesse: ${heleniaLabels[flow]}. ${details}.`;
  const interest = flow === 'perfume' ? 'perfumes' : flow === 'duvida' ? 'atendimento' : 'calçados';
  const href = `atendimento.html?interesse=${encodeURIComponent(interest)}&detalhes=${encodeURIComponent(summary)}`;
  heleniaBody.innerHTML = `
    <div class="helenia-result">
      <p class="eyebrow">Resumo preparado</p>
      <h2>Já entendemos o que você procura.</h2>
      <dl>${Object.entries(heleniaAnswers).filter(([key]) => key !== 'flow').map(([key, value]) => `<div><dt>${escapeHelenia(key)}</dt><dd>${escapeHelenia(value)}</dd></div>`).join('')}</dl>
      <p>A disponibilidade, o preço e os modelos serão confirmados pela equipe da loja.</p>
      <a class="button primary" href="${href}">Continuar com a Netfoot</a>
    </div>`;
};

const renderHeleniaStep = () => {
  const flow = heleniaAnswers.flow;
  const steps = heleniaFlows[flow];
  if (heleniaStep >= steps.length) {
    finishHelenia();
    return;
  }
  const current = steps[heleniaStep];
  const progress = Math.round(((heleniaStep + 1) / steps.length) * 100);
  heleniaBody.innerHTML = `
    <div class="helenia-progress"><span style="width:${progress}%"></span></div>
    <div class="helenia-message">
      <p class="eyebrow">${heleniaLabels[flow]} · ${heleniaStep + 1} de ${steps.length}</p>
      <h2>${current.question}</h2>
    </div>
    ${current.options ? `<div class="helenia-options">${current.options.map(option => `<button type="button" data-helenia-answer="${option}">${option}</button>`).join('')}</div>` : `
      <form class="helenia-input">
        <label for="helenia-answer">${current.optional ? 'Resposta opcional' : 'Sua resposta'}</label>
        <input id="helenia-answer" name="answer" placeholder="${current.input}" ${current.optional ? '' : 'required'}>
        <button class="button primary" type="submit">${current.optional ? 'Continuar' : 'Confirmar'}</button>
      </form>`}`;
};

heleniaLauncher.addEventListener('click', () => {
  const shouldOpen = heleniaPanel.hidden;
  if (shouldOpen) openHelenia();
  else closeHelenia();
});
heleniaClose.addEventListener('click', closeHelenia);
heleniaRestart.addEventListener('click', renderHeleniaStart);
heleniaBody.addEventListener('click', event => {
  const flowButton = event.target.closest('[data-helenia-flow]');
  if (flowButton) {
    heleniaAnswers.flow = flowButton.dataset.heleniaFlow;
    renderHeleniaStep();
    return;
  }
  const answerButton = event.target.closest('[data-helenia-answer]');
  if (answerButton) {
    const current = heleniaFlows[heleniaAnswers.flow][heleniaStep];
    heleniaAnswers[current.key] = answerButton.dataset.heleniaAnswer;
    heleniaStep += 1;
    renderHeleniaStep();
  }
});
heleniaBody.addEventListener('submit', event => {
  if (!event.target.matches('.helenia-input')) return;
  event.preventDefault();
  const current = heleniaFlows[heleniaAnswers.flow][heleniaStep];
  const answer = new FormData(event.target).get('answer').trim();
  if (!answer && !current.optional) return;
  heleniaAnswers[current.key] = answer || 'Sem preferência informada';
  heleniaStep += 1;
  renderHeleniaStep();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !heleniaPanel.hidden) closeHelenia();
});

renderHeleniaStart();
