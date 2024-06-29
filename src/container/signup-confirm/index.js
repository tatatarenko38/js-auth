//батькiвський клас Form

import { Form } from '../../script/form'

import {
  saveSession,
  getTokenSession,
  getSession,
} from '../../script/session'

class SignupConfirmForm extends Form {
  FIELD_NAME = {
    CODE: 'code',
  }

  FIELD_ERROR = {
    IS_EMPTY: 'Введіть значення в поле',
    IS_BIG: 'Дуже довге значення, приберіть зайве',
  }

  // //перевірка валідації
  validate = (name, value) => {
    if (String(value).length < 1) {
      return this.FIELD_ERROR.IS_EMPTY
    }

    if (String(value).length > 30) {
      return this.FIELD_ERROR.IS_BIG
    }
  }

  // // для відправки данних на сервер
  // //прив'зуємо до кнопки "Зареєструватися" в index.hbs
  // // через атрибут onclick
  // запит fetch() асинхронний, тому робимо async
  submit = async () => {
    if (this.disabled) {
      this.validateAll()
    } else {
      console.log(this.value)
      // відправлення на сервер займає час, тому
      this.setAlert('progress', 'Завантаження...')
      //обгортаємо try(запит) catch(повертає помилку)
      try {
        //y fetch() пишемо шлях до запиту та об'єкт с параметрами
        const res = await fetch('/signup-confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: this.convertData(),
        })
        //тут отримаємо данні з rout auth.js з router.post '/signup'
        //а там ми їх передавали
        const data = await res.json()

        //перевіряємо чи ок чи помилка
        if (res.ok) {
          this.setAlert('success', data.message)
          //зберігаємо сессію
          saveSession(data.session)
          //робимо переход на іншу сторінку( index - яка відповідає за
          // переходи між сторінками)
          location.assign('/')
        } else {
          this.setAlert('error', data.message)
        }
      } catch (error) {
        this.setAlert('error', error.message)
      }
    }
  }

  //повертає JSON.stringify з підготовленими полями
  // які нам потрібні на backend для відправки на сервер
  // можемо відправити токен разом з данними
  convertData = () => {
    return JSON.stringify({
      [this.FIELD_NAME.CODE]: Number(
        this.value[this.FIELD_NAME.CODE],
      ),
      token: getTokenSession(),
    })
  }
}
// cтворюємо екземпляр, щоб відбулося підтягування
//полів з class Form
window.signupConfirmForm = new SignupConfirmForm()

//якщо користувач має підтвердження акакунту
//то він не може перейти на цю сторінку
document.addEventListener('DOMContentLoaded', () => {
  try {
    if (window.session) {
      if (window.session.user.isConfirm) {
        location.assign('/')
      }
    } else {
      location.assign('/')
    }
    //просто будемо отримувати помилку, але не будемо її
    //оброблювати
  } catch (e) {}

  document
    .querySelector('#renew')
    .addEventListener('click', (e) => {
      e.preventDefault()

      const session = getSession()

      location.assign(
        `/signup-confirm?renew=true&email=${session.user.email}`,
      )
    })
})
