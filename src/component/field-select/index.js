class FieldSelect {
  static toggle = (target) => {
    const options = target.nextElementSibling

    options.toggleAttribute('active')

    setTimeout(() => {
      window.addEventListener(
        'click',
        (e) => {
          // alert(123)
          //якщо клікнув не всередині контейнера
          if (!options.parentElement.contains(e.target))
            //то ектів прибирається і поле закривається
            options.removeAttribute('activ')
        },
        { once: true },
      )
    })
  }

  //щоб значення ролі вставало замість плесхолдера
  // та закривало поля вибору
  // прив'язується онкліком до лі в index.hbs
  static change = (target) => {
    //console.log(target)
    // піднімаємся до батьківського елемента(з li до ul)
    //та всередині ul шукаємо якийсь елемент з атрибутом active
    // тобто вже активну опцію
    const active =
      target.parentElement.querySelector('*[active]')
    //якщо є, то виключаємо
    if (active) active.toggleAttribute('active')
    //додаємо active до targeta, який прийшов в change
    // таким чином реалізували функцію вибора елемента
    target.toggleAttribute('active')
    // виходимо на field__container
    const parent = target.parentElement.parentElement
    //в field__container шукаемо місце(поле), куди можна записати значення
    const value = parent.querySelector('.field__value')
    //якщо знайшли
    if (value) {
      //то замість плейсхолдера кладемо це значення
      value.innerText = target.innerText
      //клас плейсхолдера видаляємо
      value.classList.remove('field__value--placeholder')
    }
    //отримуємо спмсок опцій
    const list = target.parentElement
    //прибираю атрибут ектів, щоб закрити вікно опцій
    list.toggleAttribute('active')
  }
}

window.fieldSelect = FieldSelect
