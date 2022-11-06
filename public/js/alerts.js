export const hideAlert = () => {
  const element = document.querySelector('.alert')
  if (element) {
    element.parentElement.removeChild(element)
  }
}

export const showAlert = (type, alert) => {
  hideAlert()
  const markup = /*html*/ `<div class="alert alert--${type}">${alert}</div>`
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup)
  window.setTimeout(hideAlert, 5000)
}
