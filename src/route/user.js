// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

//заімпортувати класи
const { User } = require('../class/user')
const { Confirm } = require('../class/confirm')
const { Session } = require('../class/session')

//створимо тестового користувача
User.create({
  email: 'test@mail.com',
  password: 123,
  role: 1,
})

// ================================================================

//підключаємо у route.index.js

//=======================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/user-list', function (req, res) {
  // res.render генерує нам HTML сторінку(повертає)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('user-list', {
    // вказуємо назву контейнера
    name: 'user-list',
    // вказуємо назву компонентів
    component: ['back-button'],

    // вказуємо назву сторінки
    title: 'User list page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

//==============================================
// буде повертати данні, які ми будемо завантажувати
// в контейнері user-list
router.get('/user-list-data', function (req, res) {
  const list = User.getList()

  console.log(list)

  if (list.length === 0) {
    return res
      .status(400)
      .json({ message: 'Список користувачів порожній' })
  }

  return res.status(200).json({
    //перетворюємо список користувачів в об'єкт з
    //потрібними властивостями
    // list: list.map((item) => ({
    //   id: item.id,
    //   email: item.email,
    //   role: item.role,
    // })),

    // або

    list: list.map(({ id, email, role }) => ({
      id,
      email,
      role,
    })),
  })
})

//==========================================

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/user-item', function (req, res) {
  // res.render генерує нам HTML сторінку(повертає)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('user-item', {
    // вказуємо назву контейнера
    name: 'user-item',
    // вказуємо назву компонентів
    component: ['back-button'],

    // вказуємо назву сторінки
    title: 'User item page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

//=======================================
router.get('/user-item-data', function (req, res) {
  const { id } = req.query

  if (!id) {
    return res.status(400).json({
      message: 'Потрібно передати id користувача',
    })
  }

  const user = User.getById(Number(id))

  if (!user) {
    return res.status(400).json({
      message: 'Користувач з таким id не існує',
    })
  }

  return res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      isConfirm: user.isConfirm,
    },
  })
})

// Підключаємо роутер до бек-енду
module.exports = router
