import '@babel/polyfill'

import { loginFuncionality } from './login'
import { displayMap } from './mapbox'

// DOM ELEMENTS
const mapBoxContainer = document.getElementById('map')
const formElement = document.querySelector('.form')

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
