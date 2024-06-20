class SignupForm {
  // містить значення полей форми
  // в якості ключа буде name поля
  static value = {}

  //перевірка валідації
  static validate = (name, value) => {
    return true
  }

  // для відправки данних на сервер
  //прив'зуємо до кнопки "Зареєструватися" в index.hbs
  // через атрибут onclick
  static submit = () => {
    console.log(this.value)
  }

  // якщо валідація проходить, то значення записується
  static change = (name, value) => {
    console.log(name, value)
    if (this.validate(name, value)) this.value[name] = value
  }
}

window.signupForm = SignupForm
