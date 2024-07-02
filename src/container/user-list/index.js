//

import { List } from '../../script/list'
import { USER_ROLE } from '../../script/user'

class UserList extends List {
  constructor() {
    //щоб спрацював конструктор у батьківсткого List
    //якщо він там є
    super()

    this.element = document.querySelector('#user-list')
    if (!this.element) throw new Error('Element is null')

    //щоб почати завантаження данних
    this.loadData()
  }

  loadData = async () => {
    // визиваємо updateStatus(вона є в class List, куди передаєм
    //STATE.LOADING( є у class List))
    this.updateStatus(this.STATE.LOADING)

    //return null

    try {
      // робимо get запит(тільки метод - іншого немає і не треба)
      // вказуємо ендпоїнт '/user-list-data' для отримання
      // списка користувачів
      const res = await fetch('/user-list-data', {
        method: 'GET',
      })
      //коли отримали данні
      const data = await res.json()

      //перевіряємо якщо данні отримали
      if (res.ok) {
        this.updateStatus(
          //передаємо в якості оновленого статуса
          this.STATE.SUCCESS,
          //передаємо результат виконання функції
          this.convertData(data),
        )
      } else {
        this.updateStatus(this.STATE.ERROR, data)
      }
    } catch (error) {
      console.log(error)
      this.updateStatus(this.STATE.ERROR, {
        message: error.message,
      })
    }
  }

  //для конвертації данних, які приходять з сервера - основна
  //логіка, щоб перетворити будь-які данні у більш
  //зручний вигляд
  convertData = (data) => {
    return {
      //залишаємо всі данні
      ...data,
      //хочемо оновити данні, які знаходяться всередині list
      // (дивитися route/user.js/user-list-data)
      //хочу пройтись по всім елементам мого списка - зробити
      //конвертацію і записати назад в list
      list: data.list.map((user) => ({
        ...user,
        //USER_ROLE дивитися в script/user.js(зверху тут підключаємо)
        //по індексу [user.role] витягуємо потрібний рядок тексту
        role: USER_ROLE[user.role],
      })),
    }
  }

  updateView = () => {
    //перед тим як оновлювати елемент, треба прибрати
    //все те, що там було
    this.element.innerHTML = ''
    //протестуємо(в мене не працює видає)
    console.log(this.status, this.data)

    switch (this.status) {
      case this.STATE.LOADING:
        //...
        this.element.innerHTML = `<div class="user">
        <span class="user__title skeleton"></span>
        <span class="user__sub skeleton"></span>
        </div>`
        //щоб завершити кейс
        break

      case this.STATE.SUCCESS:
        //треба пройтись по list і додати в верстку
        //кожного user
        this.data.list.forEach((item) => {
          this.element.innerHTML += `
          <a href="/user-item?id=${item.id}" class="user user--click">
          <span class="user__title skeleton">${item.email}</span>
          <span class="user__sub skeleton">${item.role}</span>
          </a>
          `
        })
        //щоб завершити кейс
        break

      case this.STATE.ERROR:
        //...
        this.element.innerHTML = `<span class="alert alert--error">${this.data.message}</span>`

        //щоб завершити кейс
        break
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    if (!window.session || !window.session.user.isConfirm) {
      location.assign('/')
    }
  } catch (e) {}

  //щоб активізувати список
  new UserList()
})
