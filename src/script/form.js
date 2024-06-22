// регулярний вираз для перевірки email
// з Google

export const REG_EXP_EMAIL = new RegExp(
  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/,
)

//для перевірки пароля
export const REG_EXP_PASSWORD = new RegExp(
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
)

//базовий клас, який буде унаслідуватись
//класом SignupForm
//статичні (static) поля не наслідуються

export class Form {
  //тут будемо тримати name наших полів
  FIELD_NAME = {}
  //заготовлені тексти на помилку при валідації
  FIELD_ERROR = {}

  // // містить значення полей форми
  // // в якості ключа буде name поля
  value = {}

  //для зберігання помилок
  error = {}

  //
  disabled = true

  // якщо валідація проходить, то значення записується,
  change = (name, value) => {
    const error = this.validate(name, value)
    this.value[name] = value

    // якщо помилка
    if (error) {
      //задаємо в верстці помилку
      this.setError(name, error)
      // додаємо в об'єкт error
      this.error[name] = error
    } else {
      //видаляємо повідомлення про помилку
      // з верстки, передаючи null
      this.setError(name, null)
      //з об'єкта
      delete this.error[name]
    }
    //після змін в формі перевіряємо через
    this.checkDisabled()
  }
  //
  setError = (name, error) => {
    //знаходимо span - місце, де будемо писати помилку
    const span = document.querySelector(
      `.form__error[name="${name}"]`,
    )

    //знаходимо field
    const field = document.querySelector(
      `.validation[name="${name}"]`,
    )

    //якщо є span, то перемикаю active
    if (span) {
      span.classList.toggle(
        'form__error--active',
        Boolean(error),
      )
      span.innerText = error || ''
    }

    //
    if (field) {
      field.classList.toggle(
        'validation--active',
        Boolean(error),
      )
    }
  }

  //буде перевіряти active чи disabled(по замовч false y class)  кнопка
  //чи готові ми до відправки
  // будемо змінювати disabled
  // потім визиваємо цю функцію або validateAll() у signup index.js submit()

  checkDisabled = () => {
    let disabled = false

    //по черзі проходимо по кожному полю та перевіряємо
    //наявні данні  на наявну помилку
    Object.values(this.FIELD_NAME).forEach((name) => {
      if (
        this.error[name] ||
        this.value[name] === undefined
      ) {
        disabled = true
      }
    })

    //логіка відтворення активної кнопки(зареєструватися)
    const el = document.querySelector(`.button`)

    if (el) {
      el.classList.toggle(
        'button--disabled',
        Boolean(disabled),
      )
    }

    this.disabled = disabled
  }

  //окрема функція для перевірки всіх полей при натисканні на кнопку
  validateAll = () => {
    Object.values(this.FIELD_NAME).forEach((name) => {
      const error = this.validate(name, this.value[name])

      if (error) {
        this.setError(name, error)
      }
    })
  }

  // для відображення alert

  setAlert = (status, text) => {
    //знаходимо alert
    const el = document.querySelector(`.alert`)

    // status такi же, як в style form
    if (status === 'progress') {
      el.className = 'alert alert--progress'
    } else if (status === 'success') {
      el.className = 'alert alert--success'
    } else if (status === 'error') {
      el.className = 'alert alert--error'
    } else {
      el.className = 'alert alert--disabled'
    }

    //якщо є текст
    if (text) el.innerText = text
  }
}
