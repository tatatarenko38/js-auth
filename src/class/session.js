//відповідає за
//токенів

class Session {
  //для списку токенів
  static #list = []

  constructor(user) {
    this.token = Session.generateCode()
    //витягуємо що треба окрім пароля
    this.user = {
      email: user.email,
      isConfirm: user.isConfirm,
      role: user.role,
      id: user.id,
    }
  }

  //генерує код з 6 знаків(цифри і букви)
  static generateCode = () => {
    const length = 6
    //доступні символи
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghjklmnopqrstuvwxyz0123456789'
    //для фасування 6 символів
    let result = ''
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(
        Math.random() * characters.length,
      )
      result += characters[randomIndex]
    }
    return result
  }

  //створюємо об'єкт токена
  static create = (user) => {
    const session = new Session(user)
    this.#list.push(session)
    return session
  }

  // по коду знайде об'єкт сессії

  static get = (token) => {
    return (
      this.#list.find((item) => item.token === token) ||
      null
    )
  }
}

module.exports = { Session }

console.log(Session.generateCode())
