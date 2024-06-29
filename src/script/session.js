//константа для звернення до localStorage,
//по якій зберігаються данні
export const SESSION_KEY = 'sessionAuth'

//створюємо певні функції сессії
// для зберігання
//для отримання при відкритті
// цю функцію підключаємо у signup index.js
//таким чином коли буде реєструватись користувач
//ми будемо отримувати об'єкт токен з useroм та
// інф-єю про нього(це буде попадати в application - Local storage)
export const saveSession = (session) => {
  //перевіряємо чи працює
  console.log(session)
  try {
    //кладем в об'єкт window щоб в іншій
    // частині коду могли звернутись
    window.session = session
    //об'єкт session перетворюєм в JSON,
    //щоб він там зберігався
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify(session),
    )
  } catch (err) {
    console.log(err)
    window.session = null
  }
}

//підгружає сессію в наше оточення в браузері
// при відкритті сторінки
// export const loadSession = () => {
//   //отримуємо данні в JSON форматі
//   const json = localStorage.getItem(SESSION_KEY)

//   if (json) {
//     const session = JSON.parse(json)
//   }
// }

//або краще
export const loadSession = () => {
  try {
    const session = JSON.parse(
      localStorage.getItem(SESSION_KEY),
    )

    if (session) {
      window.session = session
    } else {
      window.session = null
    }
  } catch (err) {
    console.log(err)
    window.session = null
  }
}
// повертає token
export const getTokenSession = () => {
  try {
    const session = getSession()

    return session ? session.token : null
  } catch (err) {
    console.log(err)
    return null
  }
}

// повертає  об'єкт сессії
export const getSession = () => {
  try {
    const session =
      JSON.parse(localStorage.getItem(SESSION_KEY)) ||
      window.session

    return session || null
  } catch (err) {
    console.log(err)
    return null
  }
}
