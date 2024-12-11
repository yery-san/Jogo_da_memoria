
// const input = document.querySelector('.name');
// const button = document.querySelector('.salvar');
// // const form = document.querySelector('.login-form');

// const validateInput = ({ target }) => {
//      if (target.value.length > 2) {
//         button.removeAttribute('disabled');
//      } else {
//          button.setAttribute('disabled', '');
//         }
//         }

//  const validarSubmissao = (event) => {
//      event.preventDefault();
//      localStorage.setItem('player', input.value);
//      window.location.href = "http://localhost:8000/jogo/";
     
//         }

// input.addEventListener('input', validateInput);
// // form.addEventListener('submit', validarSubmissao);
const input = document.querySelector('.name');
const button = document.querySelector('input[type="submit"]');

const validateInput = ({ target }) => {
   if (target.value.length > 2) {
       button.removeAttribute('disabled');
   } else {
       button.setAttribute('disabled', '');
   }
};

const savePlayer = () => {
   localStorage.setItem('player', input.value);
};

// Escuta o evento de submissão do formulário
document.querySelector('form').addEventListener('submit', savePlayer);

input.addEventListener('input', validateInput);
