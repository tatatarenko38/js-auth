//виконується код, коли контент завантажився

// відповідає за перехід між сторінками
document.addEventListener('DOMContentLoaded', () => {
  //якщо э сессыя - витягуэмо user
  if (window.session) {
    const { user } = window.session

    if (user.isConfirm) {
      location.assign('/home')
    } else {
      //сторінка підтвердження реєстрації
      location.assign('/signup-confirm')
    }
  } else {
    location.assign('/signup')
  }
})
