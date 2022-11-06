import '@babel/polyfill'

import { loginFuncionality, logoutFuncionality } from './login'
import { displayMap } from './mapbox'

// DOM ELEMENTS
const mapBoxContainer = document.getElementById('map')
const formElement = document.querySelector('.form')
const logoutButton = document.querySelector('.nav__el--logout')

if (mapBoxContainer) {
  const locations = JSON.parse(mapBoxContainer.dataset.locations)
  displayMap(locations)
}

if (formElement) {
  formElement.addEventListener('submit', (event) => {
    event.preventDefault()

    const emailValue = document.getElementById('email').value
    const passwordValue = document.getElementById('password').value

    loginFuncionality({ email: emailValue, password: passwordValue })
  })
}

if (logoutButton) {
  logoutButton.addEventListener('click', logoutFuncionality)
}
