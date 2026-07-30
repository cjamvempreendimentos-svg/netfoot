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
  if (requested) {
    const option = [...form.interest.options].find(item => item.value === requested);
    if (option) form.interest.value = requested;
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const message = [
      `Olá, Netfoot! Meu nome é ${data.get('name')}.`,
      `Estou procurando: ${data.get('interest')}.`,
      data.get('details') ? `Detalhes: ${data.get('details')}` : ''
    ].filter(Boolean).join('\n');
    const destination = `https://bit.ly/WhatsAppdaNetFooT?text=${encodeURIComponent(message)}`;
    window.open(destination, '_blank', 'noopener');
  });
}
