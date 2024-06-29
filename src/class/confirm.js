//відповідає за генерацію
//кодів підтвердження

class Confirm {
  //для списку кодів
  static #list = []

  constructor(data) {
    this.code = Confirm.generateCode()
    this.data = data
  }

  //генерує код з 4 чисел
  static generateCode = () =>
    Math.floor(Math.random()) * 9000 + 1000

  //створюємо об'єкт кода та через TimeOut
  static create = (data) => {
    this.#list.push(new Confirm(data))

    setTimeout(() => {
      this.delete(code)
    }, 24 * 60 * 60 * 1000) // 24години в мілісек

    console.log(this.#list)
  }

  //та через TimeOut видаляє його через 24 години
  static delete = (code) => {
    const length = this.#list

    this.#list = this.#list.filter(
      (item) => item.code !== code,
    )

    return length > this.#list.length
  }

  // по коду знайде об'єкт

  static getData = (code) => {
    const obj = this.#list.find(
      (item) => item.code === code,
    )
    return obj ? obj.data : null
  }
}

module.exports = { Confirm }
