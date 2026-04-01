// document.addEventListener('DOMContentLoaded', function() {
//   console.log('DOM загружен. Запуск всех модулей...');

//   // ========== 1. НАВИГАЦИЯ И БЛОКИРОВКА СКРОЛЛА ==========
//   const toggle = document.getElementById('main-nav__toggle');
//   const body = document.body;
//   const navLinks = document.querySelectorAll('.main-nav__link[data-close-menu]');

//   if (toggle) {
//     console.log('Навигация инициализирована');

//     function lockScroll() {
//       const scrollY = window.scrollY;
//       body.style.setProperty('--scroll-top', scrollY + 'px');
//       body.classList.add('no-scroll');
//       console.log('Скролл заблокирован, позиция:', scrollY);
//     }

//     function unlockScrollWithRestore() {
//       body.classList.remove('no-scroll');
//       const saved = body.style.getPropertyValue('--scroll-top');
//       if (saved) {
//         requestAnimationFrame(() => {
//           window.scrollTo(0, parseInt(saved));
//           body.style.removeProperty('--scroll-top');
//         });
//       }
//       console.log('Скролл разблокирован с восстановлением позиции');
//     }

//     function unlockScrollNoRestore() {
//       body.classList.remove('no-scroll');
//       body.style.removeProperty('--scroll-top');
//       console.log('Скролл разблокирован без восстановления');
//     }

//     toggle.addEventListener('change', function() {
//       if (this.checked) {
//         lockScroll();
//       } else {
//         unlockScrollWithRestore();
//       }
//     });

//     navLinks.forEach(link => {
//       link.addEventListener('click', function(e) {
//         e.preventDefault();
//         const targetId = this.getAttribute('href').substring(1);
//         const targetEl = document.getElementById(targetId);
        
//         if (!targetEl) {
//           console.warn(`Секция #${targetId} не найдена`);
//           return;
//         }
        
//         console.log('Клик по ссылке:', targetId);
//         toggle.checked = false;
        
//         setTimeout(() => {
//           unlockScrollNoRestore();
//           targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
//           history.replaceState(null, null, `#${targetId}`);
//           console.log('Прокрутка к секции:', targetId);
//         }, 300);
//       });
//     });

//     if (toggle.checked) {
//       lockScroll();
//     }
//   } else {
//     console.warn('Элемент #main-nav__toggle не найден');
//   }

//   // ========== 2. TOAST-УВЕДОМЛЕНИЯ ==========
//   function showToast({ title = 'Готово!', message = '', type = 'success', duration = 5000 }) {
//     const container = document.getElementById('toast-container');
//     if (!container) {
//       console.warn('Контейнер #toast-container не найден');
//       return;
//     }

//     const toast = document.createElement('div');
//     toast.className = `toast toast--${type}`;
//     toast.setAttribute('role', 'status');
    
//     toast.innerHTML = `
//       <div class="toast__icon" aria-hidden="true"></div>
//       <div class="toast__content">
//         ${title ? `<strong class="toast__title">${title}</strong>` : ''}
//         ${message ? `<p class="toast__message">${message}</p>` : ''}
//       </div>
//       <button class="toast__close" aria-label="Закрыть уведомление">&times;</button>
//     `;
    
//     container.appendChild(toast);
    
//     requestAnimationFrame(() => {
//       toast.classList.add('visible');
//     });
    
//     const closeBtn = toast.querySelector('.toast__close');
//     closeBtn.addEventListener('click', () => hideToast(toast));
    
//     if (duration > 0) {
//       setTimeout(() => hideToast(toast), duration);
//     }
    
//     return toast;
//   }

//   function hideToast(toast) {
//     if (!toast) return;
//     toast.classList.add('hiding');
//     toast.classList.remove('visible');
//     toast.addEventListener('animationend', () => {
//       if (toast.parentNode) {
//         toast.parentNode.removeChild(toast);
//       }
//     }, { once: true });
//   }

//   // ========== 3. ВАЛИДАЦИЯ ФОРМ + FORMSPREE ==========
//   const forms = document.querySelectorAll('.booking__form');

//   forms.forEach(form => {
//     const nameInput = form.querySelector('input[name="name"]');
//     const phoneInput = form.querySelector('input[name="phone"]');
//     const emailInput = form.querySelector('input[name="email"]');
//     const submitBtn = form.querySelector('.booking__submit');

//     function getDigits(str) {
//       return str.replace(/\D/g, '');
//     }

//     function isValidRussianPhone(phone) {
//       const digits = getDigits(phone);
//       return digits.length === 11 && /^[78]/.test(digits);
//     }

//     function isValidName(name) {
//       const nameRegex = /^[а-яА-ЯёЁa-zA-Z\s\-]+$/;
//       const trimmed = name.trim();
//       return nameRegex.test(trimmed) && trimmed.split(/\s+/).filter(Boolean).length >= 2;
//     }

//     function isValidEmail(email) {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       return emailRegex.test(email.trim());
//     }

//     function showFieldError(input, message) {
//       const oldError = input.parentElement.querySelector('.form-error');
//       if (oldError) oldError.remove();

//       const error = document.createElement('div');
//       error.className = 'form-error';
//       error.style.color = 'var(--color-error, #e53935)';
//       error.style.fontSize = '12px';
//       error.style.marginTop = '4px';
//       error.textContent = message;
//       input.parentElement.appendChild(error);
//       input.style.borderColor = 'var(--color-error, #e53935)';
//     }

//     function clearFieldError(input) {
//       const error = input.parentElement.querySelector('.form-error');
//       if (error) error.remove();
//       input.style.borderColor = '';
//     }

//     // Валидация телефона (форматирование)
//     phoneInput.addEventListener('input', function (e) {
//       let value = getDigits(e.target.value);
//       if (value.length > 11) value = value.slice(0, 11);

//       let formatted = '';
//       if (value.length === 0) formatted = '';
//       else if (value.length === 1) formatted = '+7';
//       else if (value.length <= 4) formatted = `+7 (${value.slice(1)}`;
//       else if (value.length <= 7) formatted = `+7 (${value.slice(1, 4)}) ${value.slice(4)}`;
//       else if (value.length <= 9) formatted = `+7 (${value.slice(1, 4)}) ${value.slice(4, 7)}-${value.slice(7)}`;
//       else formatted = `+7 (${value.slice(1, 4)}) ${value.slice(4, 7)}-${value.slice(7, 9)}-${value.slice(9, 11)}`;
      
//       e.target.value = formatted;
//       clearFieldError(e.target);
//     });


//     // Блокировка кириллицы в Email
// if (emailInput) {
//   emailInput.addEventListener('input', function (e) {
//     // Удаляем все кириллические символы
//     const value = e.target.value;
//     const withoutCyrillic = value.replace(/[а-яА-ЯёЁ]/gi, '');
    
//     if (value !== withoutCyrillic) {
//       e.target.value = withoutCyrillic;
//     }
    
//     clearFieldError(e.target);
//   });
// }


//     // Валидация имени
//     nameInput.addEventListener('blur', function () {
//       if (this.value.trim() && !isValidName(this.value)) {
//         showFieldError(this, 'Введите полное ФИО (минимум 2 слова: Фамилия Имя)');
//       } else {
//         clearFieldError(this);
//       }
//     });

//     // Валидация телефона
//     phoneInput.addEventListener('blur', function () {
//       if (this.value.trim() && !isValidRussianPhone(this.value)) {
//         showFieldError(this, 'Некорректный номер телефона. Пример: +7 (999) 123-45-67');
//       } else {
//         clearFieldError(this);
//       }
//     });

//     // Валидация Email
//     if (emailInput) {
//       emailInput.addEventListener('blur', function () {
//         if (this.value.trim() && !isValidEmail(this.value)) {
//           showFieldError(this, 'Некорректный Email. Пример: example@mail.ru');
//         } else {
//           clearFieldError(this);
//         }
//       });
//     }

//     // Обработка отправки формы (Formspree AJAX)
//     form.addEventListener('submit', async function (e) {
//       e.preventDefault();
      
//       // Очищаем старые ошибки
//       clearFieldError(nameInput);
//       clearFieldError(phoneInput);
//       if (emailInput) clearFieldError(emailInput);

//       const name = nameInput.value.trim();
//       const phone = phoneInput.value.trim();
//       const email = emailInput ? emailInput.value.trim() : '';
//       let hasError = false;

//       // Валидация имени
//       if (!name) {
//         showFieldError(nameInput, 'Пожалуйста, введите ФИО.');
//         nameInput.focus();
//         hasError = true;
//       } else if (!isValidName(name)) {
//         showFieldError(nameInput, 'ФИО должно содержать минимум 2 слова (Фамилия Имя).');
//         nameInput.focus();
//         hasError = true;
//       }

//       // Валидация телефона
//       if (!phone) {
//         showFieldError(phoneInput, 'Пожалуйста, введите телефон.');
//         phoneInput.focus();
//         hasError = true;
//       } else if (!isValidRussianPhone(phone)) {
//         showFieldError(phoneInput, 'Некорректный номер. Пример: +7 (999) 123-45-67');
//         phoneInput.focus();
//         hasError = true;
//       }

//       // Валидация Email
//       if (emailInput) {
//         if (!email) {
//           showFieldError(emailInput, 'Пожалуйста, введите Email.');
//           emailInput.focus();
//           hasError = true;
//         } else if (!isValidEmail(email)) {
//           showFieldError(emailInput, 'Некорректный Email. Пример: example@mail.ru');
//           emailInput.focus();
//           hasError = true;
//         }
//       }

//       if (hasError) return;

//       // Блокируем кнопку
//       submitBtn.disabled = true;
//       submitBtn.textContent = 'Отправка...';

//       try {
//         // Отправка через Formspree (AJAX)
//         const formData = new FormData(form);
//         const response = await fetch(form.action, {
//           method: 'POST',
//           body: formData,
//           headers: { 'Accept': 'application/json' }
//         });

//         if (response.ok) {
//           showToast({
//             title: '✅ Заявка отправлена!',
//             message: 'В течение 5 минут вам перезвонит наш менеджер.',
//             type: 'success',
//             duration: 6000
//           });
//           form.reset();
//         } else {
//           const errorData = await response.json().catch(() => ({}));
//           showToast({
//             title: 'Ошибка отправки',
//             message: errorData.errors?.[0]?.message || 'Попробуйте ещё раз или позвоните нам',
//             type: 'error',
//             duration: 7000
//           });
//         }
//       } catch (error) {
//         console.error('Formspree error:', error);
//         showToast({
//           title: 'Ошибка сети',
//           message: 'Проверьте подключение к интернету и попробуйте ещё раз',
//           type: 'error',
//           duration: 7000
//         });
//       } finally {
//         submitBtn.disabled = false;
//         submitBtn.textContent = 'Отправить заявку';
//       }
//     });
//   });

//   // ========== 4. АККОРДЕОН УСЛУГ ==========
//   const servicesList = document.querySelector('.services__list');
//   if (servicesList) {
//     servicesList.addEventListener('click', function(e) {
//       const item = e.target.closest('[data-service-item]');
//       if (!item) return;
      
//       if (e.target.closest('a') || e.target.closest('input') || e.target.closest('select')) {
//         return;
//       }
      
//       const toggleBtn = item.querySelector('.services__toggle');
//       const details = item.querySelector('.services__details');
      
//       if (!toggleBtn || !details) return;
      
//       const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
//       details.classList.toggle('open');
//       toggleBtn.classList.toggle('rotate');
//       toggleBtn.setAttribute('aria-expanded', !isExpanded);
//     });
//   }

//   // ========== 5. АНИМАЦИИ FADE-IN ==========
//   const fadeElements = document.querySelectorAll('.fade-in');
//   if (fadeElements.length > 0) {
//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach(entry => {
//         if (entry.isIntersecting) {
//           entry.target.classList.add('visible');
//           observer.unobserve(entry.target);
//         }
//       });
//     }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
//     fadeElements.forEach(el => observer.observe(el));
//   }

// // ========== 6. АНИМАЦИЯ ГЕРО-ТЕКСТА ==========
// const heroText = document.querySelector('.hero__text');

// if (heroText) {
//   // ✅ Ждём, пока шрифты загрузятся ИЛИ таймаут 1.2 сек
//   const fontLoadPromise = document.fonts?.ready || Promise.resolve();
  
//   Promise.race([
//     fontLoadPromise,
//     new Promise(resolve => setTimeout(resolve, 1200))
//   ]).then(() => {
//     // ✅ Force reflow перед анимацией (гарантирует, что браузер "увидит" начальное состояние)
//     void heroText.offsetWidth;
    
//     // ✅ Добавляем класс с микро-задержкой
//     requestAnimationFrame(() => {
//       setTimeout(() => {
//         heroText.classList.add('visible');
//       }, 10);
//     });
//   });
// }
// });
























document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM загружен. Запуск всех модулей...');

  // ========== 1. НАВИГАЦИЯ И БЛОКИРОВКА СКРОЛЛА ==========
  const toggle = document.getElementById('main-nav__toggle');
  const body = document.body;
  const navLinks = document.querySelectorAll('.main-nav__link[data-close-menu]');

  if (toggle) {
    console.log('Навигация инициализирована');

    function lockScroll() {
      const scrollY = window.scrollY;
      body.style.setProperty('--scroll-top', scrollY + 'px');
      body.classList.add('no-scroll');
      console.log('Скролл заблокирован, позиция:', scrollY);
    }

    function unlockScrollWithRestore() {
      body.classList.remove('no-scroll');
      const saved = body.style.getPropertyValue('--scroll-top');
      if (saved) {
        requestAnimationFrame(() => {
          window.scrollTo(0, parseInt(saved));
          body.style.removeProperty('--scroll-top');
        });
      }
      console.log('Скролл разблокирован с восстановлением позиции');
    }

    function unlockScrollNoRestore() {
      body.classList.remove('no-scroll');
      body.style.removeProperty('--scroll-top');
      console.log('Скролл разблокирован без восстановления');
    }

    toggle.addEventListener('change', function() {
      if (this.checked) {
        lockScroll();
      } else {
        unlockScrollWithRestore();
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetEl = document.getElementById(targetId);
        
        if (!targetEl) {
          console.warn(`Секция #${targetId} не найдена`);
          return;
        }
        
        console.log('Клик по ссылке:', targetId);
        toggle.checked = false;
        
        setTimeout(() => {
          unlockScrollNoRestore();
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.replaceState(null, null, `#${targetId}`);
          console.log('Прокрутка к секции:', targetId);
        }, 300);
      });
    });

    if (toggle.checked) {
      lockScroll();
    }
  } else {
    console.warn('Элемент #main-nav__toggle не найден');
  }

  // ========== 2. TOAST-УВЕДОМЛЕНИЯ ==========
  function showToast({ title = 'Готово!', message = '', type = 'success', duration = 5000 }) {
    const container = document.getElementById('toast-container');
    if (!container) {
      console.warn('Контейнер #toast-container не найден');
      return;
    }

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'status');
    
    toast.innerHTML = `
      <div class="toast__icon" aria-hidden="true"></div>
      <div class="toast__content">
        ${title ? `<strong class="toast__title">${title}</strong>` : ''}
        ${message ? `<p class="toast__message">${message}</p>` : ''}
      </div>
      <button class="toast__close" aria-label="Закрыть уведомление">&times;</button>
    `;
    
    container.appendChild(toast);
    
    requestAnimationFrame(() => {
      toast.classList.add('visible');
    });
    
    const closeBtn = toast.querySelector('.toast__close');
    closeBtn.addEventListener('click', () => hideToast(toast));
    
    if (duration > 0) {
      setTimeout(() => hideToast(toast), duration);
    }
    
    return toast;
  }

  function hideToast(toast) {
    if (!toast) return;
    toast.classList.add('hiding');
    toast.classList.remove('visible');
    toast.addEventListener('animationend', () => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, { once: true });
  }

  // ========== 3. ВАЛИДАЦИЯ ФОРМ + FORMSPREE ==========
  const forms = document.querySelectorAll('.booking__form');

  forms.forEach(form => {
    const nameInput = form.querySelector('input[name="name"]');
    const phoneInput = form.querySelector('input[name="phone"]');
    const emailInput = form.querySelector('input[name="email"]');
    const submitBtn = form.querySelector('.booking__submit');

    function getDigits(str) {
      return str.replace(/\D/g, '');
    }

    function isValidRussianPhone(phone) {
      const digits = getDigits(phone);
      return digits.length === 11 && /^[78]/.test(digits);
    }

    function isValidName(name) {
      const nameRegex = /^[а-яА-ЯёЁa-zA-Z\s\-]+$/;
      const trimmed = name.trim();
      return nameRegex.test(trimmed) && trimmed.split(/\s+/).filter(Boolean).length >= 2;
    }

    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email.trim());
    }

    function showFieldError(input, message) {
      const oldError = input.parentElement.querySelector('.form-error');
      if (oldError) oldError.remove();

      const error = document.createElement('div');
      error.className = 'form-error';
      error.style.color = 'var(--color-error, #e53935)';
      error.style.fontSize = '12px';
      error.style.marginTop = '4px';
      error.textContent = message;
      input.parentElement.appendChild(error);
      input.style.borderColor = 'var(--color-error, #e53935)';
    }

    function clearFieldError(input) {
      const error = input.parentElement.querySelector('.form-error');
      if (error) error.remove();
      input.style.borderColor = '';
    }

    // Валидация телефона (форматирование)
    phoneInput.addEventListener('input', function (e) {
      let value = getDigits(e.target.value);
      if (value.length > 11) value = value.slice(0, 11);

      let formatted = '';
      if (value.length === 0) formatted = '';
      else if (value.length === 1) formatted = '+7';
      else if (value.length <= 4) formatted = `+7 (${value.slice(1)}`;
      else if (value.length <= 7) formatted = `+7 (${value.slice(1, 4)}) ${value.slice(4)}`;
      else if (value.length <= 9) formatted = `+7 (${value.slice(1, 4)}) ${value.slice(4, 7)}-${value.slice(7)}`;
      else formatted = `+7 (${value.slice(1, 4)}) ${value.slice(4, 7)}-${value.slice(7, 9)}-${value.slice(9, 11)}`;
      
      e.target.value = formatted;
      clearFieldError(e.target);
    });


    // Блокировка кириллицы в Email
if (emailInput) {
  emailInput.addEventListener('input', function (e) {
    // Удаляем все кириллические символы
    const value = e.target.value;
    const withoutCyrillic = value.replace(/[а-яА-ЯёЁ]/gi, '');
    
    if (value !== withoutCyrillic) {
      e.target.value = withoutCyrillic;
    }
    
    clearFieldError(e.target);
  });
}


    // Валидация имени
    nameInput.addEventListener('blur', function () {
      if (this.value.trim() && !isValidName(this.value)) {
        showFieldError(this, 'Введите полное ФИО (минимум 2 слова: Фамилия Имя)');
      } else {
        clearFieldError(this);
      }
    });

    // Валидация телефона
    phoneInput.addEventListener('blur', function () {
      if (this.value.trim() && !isValidRussianPhone(this.value)) {
        showFieldError(this, 'Некорректный номер телефона. Пример: +7 (999) 123-45-67');
      } else {
        clearFieldError(this);
      }
    });

    // Валидация Email
    if (emailInput) {
      emailInput.addEventListener('blur', function () {
        if (this.value.trim() && !isValidEmail(this.value)) {
          showFieldError(this, 'Некорректный Email. Пример: example@mail.ru');
        } else {
          clearFieldError(this);
        }
      });
    }

    // Обработка отправки формы (Formspree AJAX)
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      
      // Очищаем старые ошибки
      clearFieldError(nameInput);
      clearFieldError(phoneInput);
      if (emailInput) clearFieldError(emailInput);

      const name = nameInput.value.trim();
      const phone = phoneInput.value.trim();
      const email = emailInput ? emailInput.value.trim() : '';
      let hasError = false;

      // Валидация имени
      if (!name) {
        showFieldError(nameInput, 'Пожалуйста, введите ФИО.');
        nameInput.focus();
        hasError = true;
      } else if (!isValidName(name)) {
        showFieldError(nameInput, 'ФИО должно содержать минимум 2 слова (Фамилия Имя).');
        nameInput.focus();
        hasError = true;
      }

      // Валидация телефона
      if (!phone) {
        showFieldError(phoneInput, 'Пожалуйста, введите телефон.');
        phoneInput.focus();
        hasError = true;
      } else if (!isValidRussianPhone(phone)) {
        showFieldError(phoneInput, 'Некорректный номер. Пример: +7 (999) 123-45-67');
        phoneInput.focus();
        hasError = true;
      }

      // Валидация Email
      if (emailInput) {
        if (!email) {
          showFieldError(emailInput, 'Пожалуйста, введите Email.');
          emailInput.focus();
          hasError = true;
        } else if (!isValidEmail(email)) {
          showFieldError(emailInput, 'Некорректный Email. Пример: example@mail.ru');
          emailInput.focus();
          hasError = true;
        }
      }

      if (hasError) return;

      // Блокируем кнопку
      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправка...';

      try {
        // Отправка через Formspree (AJAX)
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          showToast({
            title: '✅ Заявка отправлена!',
            message: 'В течение 5 минут вам перезвонит наш менеджер.',
            type: 'success',
            duration: 6000
          });
          form.reset();
        } else {
          const errorData = await response.json().catch(() => ({}));
          showToast({
            title: 'Ошибка отправки',
            message: errorData.errors?.[0]?.message || 'Попробуйте ещё раз или позвоните нам',
            type: 'error',
            duration: 7000
          });
        }
      } catch (error) {
        console.error('Formspree error:', error);
        showToast({
          title: 'Ошибка сети',
          message: 'Проверьте подключение к интернету и попробуйте ещё раз',
          type: 'error',
          duration: 7000
        });
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить заявку';
      }
    });
  });

  // ========== 4. АККОРДЕОН УСЛУГ ==========
  const servicesList = document.querySelector('.services__list');
  if (servicesList) {
    servicesList.addEventListener('click', function(e) {
      const item = e.target.closest('[data-service-item]');
      if (!item) return;
      
      if (e.target.closest('a') || e.target.closest('input') || e.target.closest('select')) {
        return;
      }
      
      const toggleBtn = item.querySelector('.services__toggle');
      const details = item.querySelector('.services__details');
      
      if (!toggleBtn || !details) return;
      
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      details.classList.toggle('open');
      toggleBtn.classList.toggle('rotate');
      toggleBtn.setAttribute('aria-expanded', !isExpanded);
    });
  }

  // ========== 5. АНИМАЦИИ FADE-IN ==========
  const fadeElements = document.querySelectorAll('.fade-in');
  if (fadeElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    fadeElements.forEach(el => observer.observe(el));
  }

// ========== 6. АНИМАЦИЯ ГЕРО-ТЕКСТА ==========
function animateHeroText() {
  const heroText = document.querySelector('.hero__text');
  
  if (!heroText) return;
  
  // ✅ Проверяем, не добавлен ли уже класс
  if (heroText.classList.contains('visible')) return;
  
  // ✅ Force reflow — гарантируем применение начальных стилей
  void heroText.offsetWidth;
  
  // ✅ Добавляем класс с микро-задержкой
  setTimeout(() => {
    heroText.classList.add('visible');
  }, 50);
}

// ✅ Вариант 1: Ждём полную загрузку страницы (включая шрифты и картинки)
window.addEventListener('load', function() {
  setTimeout(animateHeroText, 100);
});

// ✅ Вариант 2: Если fonts.ready доступен — ждём шрифты
if (document.fonts?.ready) {
  document.fonts.ready.then(function() {
    setTimeout(animateHeroText, 50);
  });
}

// ✅ Вариант 3: Fallback на DOMContentLoaded (на случай если всё уже загрузилось)
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(animateHeroText, 100);
}
});