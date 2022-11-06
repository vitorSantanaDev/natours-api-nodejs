import axios from 'axios'
import { showAlert } from './alerts'

export const loginFuncionality = async ({ email, password }) => {
  try {
    const response = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/login',
      data: {
        email,
        password,
      },
    })
    if (response.data.status === 'success') {
      showAlert('success', 'Logged in successfuly')
      window.setTimeout(() => {
        location.assign('/')
      }, 1500)
    }
  } catch (err) {
    showAlert('error', `${err.response.data.message}`)
  }
}

export const logoutFuncionality = async () => {
  try {
    const response = await axios({
      method: 'GET',
      url: 'http://localhost:3000/api/v1/users/logout',
    })
    if (response.data.status === 'success') location.reload(true)
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.')
  }
}
