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
