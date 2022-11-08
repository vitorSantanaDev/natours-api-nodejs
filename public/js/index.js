import '@babel/polyfill'

import { loginFuncionality, logoutFuncionality } from './login'
import { updateSettings } from './updateSettings'
import { displayMap } from './mapbox'

// DOM ELEMENTS
const mapBoxContainer = document.getElementById('map')
const formElement = document.querySelector('.form--login')
const logoutButton = document.querySelector('.nav__el--logout')
const userDataForm = document.querySelector('.form-user-data')
const userPasswordForm = document.querySelector('.form-user-password')

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

if (userDataForm) {
  userDataForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const username = document.querySelector('.form-user-data #name').value
    const email = document.querySelector('.form-user-data #email').value

    updateSettings({ name: username, email }, 'data')
  })
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (event) => {
    event.preventDefault()

    const buttonSaveNewPassword = document.querySelector('.btn--save-password')

    buttonSaveNewPassword.textContent = 'Updating...'

    const currentPassword = document.querySelector(
      '.form-user-password #password-current'
    ).value

    const newPassword = document.querySelector(
      '.form-user-password #password'
    ).value

    const newPasswordConfirm = document.querySelector(
      '.form-user-password #password-confirm'
    ).value

    await updateSettings(
      {
        passwordCurrent: currentPassword,
        password: newPassword,
        passwordConfirm: newPasswordConfirm,
      },
      'password'
    )

    buttonSaveNewPassword.textContent = 'Save password'

    document.querySelector('.form-user-password #password-current').value = ''
    document.querySelector('.form-user-password #password').value = ''
    document.querySelector('.form-user-password #password-confirm').value = ''
  })
}

if (logoutButton) {
  logoutButton.addEventListener('click', logoutFuncionality)
}
