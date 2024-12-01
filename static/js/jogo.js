const grid = document.querySelector('.grid');
const spanPlayer = document.querySelector('.player');
const tentativas = document.querySelector('.tentativas');
const tempoDisplay = document.querySelector('.tempo');

let numTentativas = 0;
let tempoDeJogo = 0;
let timer;

const characters = [
  'barriga',
  'perso',
  'clotilde',
  'florinda',
  'madruga',
  'quiko',];

const createElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

let firstCard = '';
let secondCard = '';
 const checkEndGame = () => {
   const disabledCards = document.querySelectorAll('.disabled-card');
   const totalCards = document.querySelectorAll('.card').length; 

  if (disabledCards.length == totalCards) {
    pararCronometro();
    document.querySelector("#msg").innerHTML = 'Parabéns, ' + spanPlayer.innerHTML + '! Fim de Jogo!'
    document.querySelector("#nome").value = spanPlayer.innerHTML
    document.querySelector("#tentativas").value = tentativas.innerHTML
    document.querySelector("#tempo").value = tempoDisplay.innerHTML
    $('#exampleModal').modal('show');
  }
}

const checkCards = () => {
  const firstCharacter = firstCard.getAttribute('data-character');
  const secondCharacter = secondCard.getAttribute('data-character');

  if (firstCharacter === secondCharacter) {

    firstCard.firstChild.classList.add('disabled-card');
    secondCard.firstChild.classList.add('disabled-card');

    firstCard = '';
    secondCard = '';

    checkEndGame();

  } else {
    setTimeout(() => {

      firstCard.classList.remove('reveal-card');
      secondCard.classList.remove('reveal-card');

      firstCard = '';
      secondCard = '';

      alert(`Não formou par`);

    }, 500);
  }
}

const revealCard = ({ target }) => {

  if (target.parentNode.className.includes('reveal-card')) {
    return;
  }

  if (firstCard === '') {

    target.parentNode.classList.add('reveal-card');
    firstCard = target.parentNode;
    numTentativas++;
    tentativas.innerHTML = numTentativas;

  } else if (secondCard === '') {

    target.parentNode.classList.add('reveal-card');
    secondCard = target.parentNode;
    numTentativas++; 
    tentativas.innerHTML = numTentativas;

    checkCards();

  }
}

const createCard = (character) => {

  const card = createElement('div', 'card');
  const front = createElement('div', 'face front');
  const back = createElement('div', 'face back');

  front.style.backgroundImage = `url('/static/img/${character}.jpg')`;

  card.appendChild(front);
  card.appendChild(back);

  card.addEventListener('click', revealCard);
  card.setAttribute('data-character', character)

  return card;
}

const carregarJogo = () => {
  const duplicateCharacters = [...characters, ...characters];

  const shuffledArray = duplicateCharacters.sort(() => Math.random() - 0.5);

  shuffledArray.forEach((character) => {
    const card = createCard(character);
    grid.appendChild(card);
  });
}

window.onload = () => {
  spanPlayer.innerHTML = localStorage.getItem('player');
  carregarJogo();
  iniciarCronometro();  // Iniciar o cronômetro quando o jogo carregar
}

// Função para formatar o tempo em minutos e segundos
const formatarTempo = (segundos) => {
  const minutos = Math.floor(segundos / 60);
  const seg = segundos % 60;
  return `${minutos.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
}

// Função para iniciar o cronômetro e exibir na tela
const iniciarCronometro = () => {
  timer = setInterval(() => {
    tempoDeJogo++;
    tempoDisplay.innerHTML = formatarTempo(tempoDeJogo);
  }, 1000); // Incrementa o tempo a cada segundo
}

// Função para parar o cronômetro
const pararCronometro = () => {
  clearInterval(timer);
}

const enviarDados = () => {
  const nome = localStorage.getItem('player');
  const tentativasFeitas = numTentativas;

  fetch('/jogo/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
    },
    body: new URLSearchParams({
      'nome': nome,
      'tempo': tempoDeJogo,
      'tentativas': tentativasFeitas
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'sucesso') {
      alert('Dados salvos com sucesso!');
    } else {
      alert('Erro ao salvar os dados.');
    }
  })
  .catch(error => console.error('Erro:', error));
}