
const input = document.querySelector('.texto');
const button = document.querySelector('.salvar');
const form = document.querySelector('.login-form');

const validateInput = ({ target }) => {
     if (target.value.length > 2) {
        button.removeAttribute('disabled');
     } else {
         button.setAttribute('disabled', '');
        }
        }

 const validarSubmissao = (event) => {
     event.preventDefault();
     localStorage.setItem('player', input.value);
     window.location.href = "http://localhost:8000/jogo/";
     
        }

input.addEventListener('input', validateInput);
form.addEventListener('submit', validarSubmissao);