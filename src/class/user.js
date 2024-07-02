class User {
  //статичне поле конст з визначеними ролями
  // 1 2 3 - ідентифікатори, які будуть вказуватись на
  //фронтенді для запиту на сервер
  static USER_ROLE = {
    USER: 1,
    ADMIN: 2,
    DEVELOPER: 3,
  }

  // список створених користувачів
  static #list = []

  //для  id
  static #count = 1

  //створюємо конструктор та підключаємо значення
  constructor({ email, password, role }) {
    this.id = User.#count++

    this.email = String(email).toLowerCase()
    this.password = String(password)
    //під'єднуємо з User.#convertRole()
    this.role = User.#convertRole(role)

    this.isConfirm = false
  }

  // конвертує перевіряє роль
  static #convertRole = (role) => {
    role = Number(role)

    // якщо не число,
    //то ставимо юзер за замовчуванням
    if (isNaN(role)) {
      role = this.USER_ROLE.USER
    }

    // чи є така роль в списку, якщо ні,
    //то ставимо юзер за замовчуванням
    role = Object.values(this.USER_ROLE).includes(role)
      ? role
      : this.USER_ROLE.USER

    return role
  }

  //приймає данні, створює юзера і додає в список
  static create(data) {
    const user = new User(data)

    this.#list.push(user)
    // щоб бачити доданого користувача
    console.log(this.#list)
    return user
  }

  // буде приймати користувача по email
  static getByEmail(email) {
    return (
      this.#list.find(
        (user) =>
          user.email === String(email).toLowerCase(),
      ) || null
    )
  }

  // буде знаходити користувача по id
  static getById(id) {
    return (
      this.#list.find((user) => user.id === Number(id)) ||
      null
    )
  }

  static getList = () => this.#list
}

module.exports = { User }
