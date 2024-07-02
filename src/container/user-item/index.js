//

import { List } from '../../script/list'
import { USER_ROLE } from '../../script/user'

class UserItem extends List {
  constructor() {
    //щоб спрацював конструктор у батьківсткого List
    //якщо він там є
    super()

    this.element = document.querySelector('#user-item')
    if (!this.element) throw new Error('Element is null')

    //обгорнули в URL для більш зручної роботи, щоб витягнути query id
    // this.id = new URL(location.href).searchParams.get('id')
    // if (!this.id) location.assign('/user-list')

    //або
    this.id = new URLSearchParams(location.search).get('id')
    if (!this.id) location.assign('/user-list')

    //щоб почати завантаження данних
    this.loadData()
  }

  loadData = async () => {
    // визиваємо updateStatus(вона є в class List, куди передаєм
    //STATE.LOADING( є у class List))
    this.updateStatus(this.STATE.LOADING)

    console.log(this.id)

    try {
      // робимо get запит(тільки метод - іншого немає і не треба)
      // вказуємо ендпоїнт '/user-item-data' з запитом query id
      //для отримання користувача

      const res = await fetch(
        `/user-item-data?id=${this.id}`,
        {
          method: 'GET',
        },
      )
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
      //хочемо оновити данні, які знаходяться всередині user
      // (дивитися route/user.js/user-item-data)
      //оновлюю роль
      //роблю властивість confirm

      user: {
        ...data.user,
        role: USER_ROLE[data.user.role],
        confirm: data.user.isConfirm ? 'Так' : 'Ні',
      },
    }
  }

  updateView = () => {
    //перед тим як оновлювати елемент, треба прибрати
    //все те, що там було
    this.element.innerHTML = ''

    switch (this.status) {
      case this.STATE.LOADING:
        this.element.innerHTML = `<div class="data">
        <span class="data__title">ID</span>
        <span class="data__value skeleton"></span>
        </div> 
        <div class="data">
        <span class="data__title">E-mail</span>
        <span class="data__value skeleton"></span>
        </div>
        <div class="data">
        <span class="data__title">Роль</span>
        <span class="data__value skeleton"></span>
        </div>
        <div class="data">
        <span class="data__title">Пошта підтверджена?</span>
        <span class="data__value skeleton"></span>
        </div>`
        //щоб завершити кейс
        break

      case this.STATE.SUCCESS:
        const { id, email, role, confirm } = this.data.user

        this.element.innerHTML = `<div class="data">
        <span class="data__title">ID</span>
        <span class="data__value">${id}</span>
        </div> 
        <div class="data">
        <span class="data__title">E-mail</span>
        <span class="data__value">${email}</span>
        </div>
        <div class="data">
        <span class="data__title">Роль</span>
        <span class="data__value">${role}</span>
        </div>
        <div class="data">
        <span class="data__title">Пошта підтверджена?</span>
        <span class="data__value">${confirm}</span>
        </div>`
        //щоб завершити кейс
        break

      case this.STATE.ERROR:
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
  new UserItem()
})
