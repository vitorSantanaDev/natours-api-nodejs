import axios from 'axios'
import { showAlert } from './alerts'

export const updateSettings = async (data, type) => {
  const url = type === 'password' ? 'update-password' : 'update-current-user'
  try {
    const response = await axios.patch(
      `http://localhost:3000/api/v1/users/${url}`,
      data
    )
    if (response.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`)
    }
  } catch (err) {
    showAlert('error', err.message)
  }
}
