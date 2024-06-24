//батькiвський клас Form

import {
  Form,
  REG_EXP_EMAIL,
  REG_EXP_PASSWORD,
} from '../../script/form'

class RecoveryConfirmForm extends Form {
  FIELD_NAME = {
    CODE: 'code',
    PASSWORD: 'password',
    PASSWORD_AGAIN: 'passwordAgain',
  }

  FIELD_ERROR = {
    IS_EMPTY: 'Введіть значення в поле',
    IS_BIG: 'Дуже довге значення, приберіть зайве',
    PASSWORD:
      'Пароль повинен містити не меньше 8 символів, включаючи хоча б одну цифру, малу і велику літеру',
    PASSWORD_AGAIN:
      'Ваш другий пароль не збігається з першим',
  }

  // //перевірка валідації
  validate = (name, value) => {
    if (String(value).length < 1) {
      return this.FIELD_ERROR.IS_EMPTY
    }

    if (String(value).length > 30) {
      return this.FIELD_ERROR.IS_BIG
    }

    //пароль так же
    if (name === this.FIELD_NAME.PASSWORD) {
      // якщо значення некоректне, повертаємо помилку
      if (!REG_EXP_PASSWORD.test(String(value))) {
        return this.FIELD_ERROR.PASSWORD
      }
    }

    // перевірка чи пароль1 === пароль2
    if (name === this.FIELD_NAME.PASSWORD_AGAIN) {
      if (
        String(value) !==
        this.value[this.FIELD_NAME.PASSWORD]
      ) {
        return this.FIELD_ERROR.PASSWORD_AGAIN
      }
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
        const res = await fetch('/recovery-confirm', {
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
          //робимо переход на іншу сторінку
          location.assign('/recovery-confirm')
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
  convertData = () => {
    return JSON.stringify({
      [this.FIELD_NAME.CODE]: Number(
        this.value[this.FIELD_NAME.CODE],
      ),
      [this.FIELD_NAME.PASSWORD]:
        this.value[this.FIELD_NAME.PASSWORD],
    })
  }
}
// cтворюємо екземпляр, щоб відбулося підтягування
//полів з class Form
window.recoveryConfirmForm = new RecoveryConfirmForm()
