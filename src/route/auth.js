// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

//заімпортувати класи
const { User } = require('../class/user')
const { Confirm } = require('../class/confirm')

//створимо тестового користувача
User.create({
  email: 'test@mail.com',
  password: 123,
  role: 1,
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/signup', function (req, res) {
  // res.render генерує нам HTML сторінку(повертає)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('signup', {
    // вказуємо назву контейнера
    name: 'signup',
    // вказуємо назву компонентів
    component: [
      'back-button',
      'field',
      'field-password',
      'field-checkbox',
      'field-select',
    ],

    // вказуємо назву сторінки
    title: 'Signup page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {
      role: [
        { value: User.USER_ROLE.USER, text: 'Користувач' },
        {
          value: User.USER_ROLE.ADMIN,
          text: 'Адміністратор',
        },
        {
          value: User.USER_ROLE.DEVELOPER,
          text: 'Розробник',
        },
      ],
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

//для відправки данних на створення(реєстрацію) користувача
router.post('/signup', function (req, res) {
  //через деструктуризацію витягуємо данні
  const { email, password, role } = req.body

  console.log(req.body)

  //перевірка чи всі поля є
  if (!email || !password || !role) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }
  //спроба виконання реєстрації
  try {
    //перевіряємо чи такий користувач вже існує
    const user = User.getByEmail(email)
    if (user) {
      return res.status(400).json({
        message: 'Помилка. Такий користувач вже існує',
      })
    }

    User.create({ email, password, role })

    return res.status(200).json({
      message: 'Користувач успішно зареєстрований',
    })
  } catch (err) {
    return res.status(400).json({
      message: 'Помилка створення користувача',
    })
  }
})

// router.get Створює нам один ентпоїнт
// ДЛЯ ВІДНОВЛЕННЯ ПАРОЛЮ
// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/recovery', function (req, res) {
  // res.render генерує нам HTML сторінку(повертає)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('recovery', {
    // вказуємо назву контейнера
    name: 'recovery',
    // вказуємо назву компонентів
    component: ['back-button', 'field'],

    // вказуємо назву сторінки
    title: 'Recovery page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})
//////==============================================================
// POST запит для відновлення паролю
router.post('/recovery', function (req, res) {
  const { email } = req.body

  console.log(email)

  //перевіряємо чи є email
  if (!email) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  // знаходимо користувача за цим email(в класі User
  // getByEmail(email))
  try {
    const user = User.getByEmail(email)
    //перевіряємо чи є такий user
    if (!user) {
      return res.status(400).json({
        message: 'Користувач з таким email не існує',
      })
    }

    //тимчасовий код для відновлення пароля
    Confirm.create(email)

    return res.status(200).json({
      message: 'Код для відновлення паролю відправлено',
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})
/////======================================================
// ДЛЯ ПІДТВЕРДЖЕННЯ ВІДНОВЛЕННЯ ПАРОЛЮ
// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/recovery-confirm', function (req, res) {
  // res.render генерує нам HTML сторінку(повертає)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('recovery-confirm', {
    // вказуємо назву контейнера
    name: 'recovery-confirm',
    // вказуємо назву компонентів
    component: ['back-button', 'field', 'field-password'],

    // вказуємо назву сторінки
    title: 'Recovery confirm page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

//=========================================
// логіка відновлення паролю
router.post('/recovery-confirm', function (req, res) {
  const { password, code } = req.body

  console.log(password, code)

  //перевіряємо чи є всі данні
  if (!code || !password) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    //отримуємо email
    const email = Confirm.getData(Number(code))
    if (!email) {
      return res.status(400).json({
        message: 'Код не існує',
      })
    }
    //знаходимо користувача по email
    const user = User.getByEmail(email)
    if (!user) {
      return res.status(400).json({
        message: 'Користувача з таким email не існує',
      })
    }
    //зміна паролю напряму
    user.password = password

    console.log(user)

    return res.status(200).json({
      message: 'Пароль змінено',
    })
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
})

// Підключаємо роутер до бек-енду
module.exports = router
