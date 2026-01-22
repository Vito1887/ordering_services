// Плавная прокрутка к якорям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        if (!href || href === '#') {
            return;
        }

        // Прокрутка к началу
        if (href === '#home') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Обработчик клика на логотип - переход в начало страницы
const logo = document.getElementById('logo');
if (logo) {
    logo.addEventListener('click', function (e) {
        e.preventDefault();
        // Перезагружаем страницу и попадаем в начало
        window.location.href = window.location.pathname + window.location.search;
    });
}

// Кнопка прокрутки наверх
const scrollToTopBtn = document.getElementById('scrollToTop');
const scrollThreshold = 300;

function toggleScrollButton() {
    if (!scrollToTopBtn) return;
    if (window.pageYOffset > scrollThreshold) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
}

if (scrollToTopBtn) {
    window.addEventListener('scroll', toggleScrollButton);
    scrollToTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    toggleScrollButton();
}

// Аккордеон для списков программ
document.querySelectorAll('.products-header').forEach(header => {
    header.addEventListener('click', function () {
        const item = this.closest('.products-item');
        const content = item.querySelector('.products-content');
        const isActive = this.classList.contains('active');

        document.querySelectorAll('.products-item').forEach(otherItem => {
            if (otherItem !== item) {
                const otherHeader = otherItem.querySelector('.products-header');
                const otherContent = otherItem.querySelector('.products-content');
                otherHeader.classList.remove('active');
                otherContent.classList.remove('active');
            }
        });

        if (isActive) {
            this.classList.remove('active');
            content.classList.remove('active');
        } else {
            this.classList.add('active');
            content.classList.add('active');
        }
    });
});

// Аккордеон для модулей и услуг
document.querySelectorAll('.modules-header').forEach(header => {
    header.addEventListener('click', function () {
        const item = this.closest('.modules-item');
        const content = item.querySelector('.modules-content');
        const isActive = this.classList.contains('active');

        document.querySelectorAll('.modules-item').forEach(otherItem => {
            if (otherItem !== item) {
                const otherHeader = otherItem.querySelector('.modules-header');
                const otherContent = otherItem.querySelector('.modules-content');
                otherHeader.classList.remove('active');
                otherContent.classList.remove('active');
            }
        });

        if (isActive) {
            this.classList.remove('active');
            content.classList.remove('active');
        } else {
            this.classList.add('active');
            content.classList.add('active');
        }
    });
});

// Инициализация Яндекс карты
function initYandexMap() {
    if (typeof ymaps === 'undefined') {
        console.warn('Yandex Maps API не загружена');
        return;
    }

    ymaps.ready(function () {
        const coordinates = [52.7886, 52.2622]; // примерные координаты Бузулука

        const mapContainer = document.getElementById('yandex-map');
        if (!mapContainer) return;

        const map = new ymaps.Map(mapContainer, {
            center: coordinates,
            zoom: 16,
            controls: ['zoomControl', 'fullscreenControl']
        });

        const placemark = new ymaps.Placemark(coordinates, {
            balloonContent: '1С Кэтрион<br>ул. Пушкина, д.3 \"Б\"',
            iconCaption: '1С Кэтрион'
        }, {
            preset: 'islands#redIcon'
        });

        map.geoObjects.add(placemark);
    });
}

// Капча
function setupCaptcha(form) {
    const checkbox = form.querySelector('.order-checkbox');
    const details = form.querySelector('.order-captcha-details');
    const textEl = form.querySelector('.order-captcha-text');
    const inputEl = form.querySelector('.order-captcha-input');
    const refreshBtn = form.querySelector('.order-captcha-refresh');
    const errorEl = form.querySelector('.order-captcha-error');

    if (!checkbox || !details || !textEl || !inputEl || !refreshBtn || !errorEl) return;

    let currentCode = '';

    function generateCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 5; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        currentCode = code;
        textEl.textContent = code;
    }

    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            details.style.display = 'block';
            generateCode();
            inputEl.focus();
        } else {
            details.style.display = 'none';
            inputEl.value = '';
            errorEl.textContent = '';
        }
    });

    refreshBtn.addEventListener('click', () => {
        generateCode();
        inputEl.value = '';
        inputEl.focus();
        errorEl.textContent = '';
    });

    // Валидация при изменении полей (для модалки и тарифных форм)
    const nameInput = form.querySelector('input[type="text"]');
    const emailInput = form.querySelector('input[type="email"]');
    const telInput = form.querySelector('input[type="tel"]');
    
    function validateBeforeSubmit() {
        const hasName = nameInput && nameInput.value.trim();
        const hasEmail = emailInput && emailInput.value.trim();
        const hasTel = telInput && telInput.value.trim();
        
        if ((hasName || hasEmail || hasTel) && !checkbox.checked) {
            errorEl.textContent = 'Для отправки необходимо пройти проверку на робота.';
            return false;
        }
        return true;
    }
    
    if (nameInput) {
        nameInput.addEventListener('blur', validateBeforeSubmit);
    }
    if (emailInput) {
        emailInput.addEventListener('blur', validateBeforeSubmit);
    }
    if (telInput) {
        telInput.addEventListener('blur', validateBeforeSubmit);
    }

    form.addEventListener('submit', (e) => {
        errorEl.textContent = '';

        if (!checkbox.checked) {
            e.preventDefault();
            const hasName = nameInput && nameInput.value.trim();
            const hasEmail = emailInput && emailInput.value.trim();
            const hasTel = telInput && telInput.value.trim();
            if (hasName || hasEmail || hasTel) {
                errorEl.textContent = 'Для отправки необходимо пройти проверку на робота.';
            } else {
                errorEl.textContent = 'Подтвердите, что вы не робот.';
            }
            return;
        }

        const value = (inputEl.value || '').trim().toUpperCase();
        if (!value) {
            e.preventDefault();
            errorEl.textContent = 'Введите текст с картинки.';
            inputEl.focus();
            return;
        }
        
        if (value !== currentCode) {
            e.preventDefault();
            errorEl.textContent = 'Текст введён некорректно, попробуйте ещё раз.';
            generateCode();
            inputEl.value = '';
            inputEl.focus();
        }
    });
}

// Модальное окно для заказа услуги
const modalOverlay = document.getElementById('orderModal');
const modalServiceNameEl = document.getElementById('modalServiceName');

function openModal(serviceName) {
    if (!modalOverlay) return;
    if (modalServiceNameEl) {
        modalServiceNameEl.textContent = serviceName;
    }
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    if (!modalOverlay) return;
    const modalForm = document.getElementById('modalOrderForm');
    if (modalForm) {
        // Очищаем поля формы при закрытии
        modalForm.reset();
        const checkbox = modalForm.querySelector('.order-checkbox');
        const details = modalForm.querySelector('.order-captcha-details');
        const inputEl = modalForm.querySelector('.order-captcha-input');
        const errorEl = modalForm.querySelector('.order-captcha-error');
        if (details) details.style.display = 'none';
        if (inputEl) inputEl.value = '';
        if (errorEl) errorEl.textContent = '';
    }
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', function () {
    // Карта
    initYandexMap();

    // Капча на формах
    document.querySelectorAll('.js-captcha-form').forEach(setupCaptcha);

    // Обработка отправки основной формы
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', function (e) {
            if (orderForm.querySelector('.order-captcha-error')?.textContent) {
                e.preventDefault();
                return;
            }

            e.preventDefault();
            // Здесь должен быть вызов backend / почтового сервиса:
            // fetch('/api/send-payment-details', { method: 'POST', body: new FormData(orderForm) })
            alert('Спасибо! Мы вышлем реквизиты для оплаты на указанную почту.');
            orderForm.reset();
        });
    }

    // Открытие модального окна из блока модулей
    document.querySelectorAll('.modules-order-btn').forEach(button => {
        button.addEventListener('click', function () {
            const item = this.closest('.modules-list-item');
            const title = item?.querySelector('.modules-item-title')?.textContent?.trim() || 'Услуга 1С';
            openModal(title);
        });
    });

    // Закрытие модального окна
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
        const closeBtn = modalOverlay.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }
    }

    const modalForm = document.getElementById('modalOrderForm');
    if (modalForm) {
        modalForm.addEventListener('submit', function (e) {
            if (modalForm.querySelector('.order-captcha-error')?.textContent) {
                e.preventDefault();
                return;
            }

            e.preventDefault();
            // Здесь также должен быть вызов backend / почтового сервиса.
            alert('Спасибо! Мы вышлем реквизиты для оплаты на указанную почту.');
            modalForm.reset();
            closeModal();
        });
    }

    // Обработка отправки тарифных форм
    document.querySelectorAll('.tariff-form').forEach(form => {
        form.addEventListener('submit', function (e) {
            if (form.querySelector('.order-captcha-error')?.textContent) {
                e.preventDefault();
                return;
            }

            e.preventDefault();
            // Здесь должен быть вызов backend / почтового сервиса:
            // fetch('/api/send-callback-request', { method: 'POST', body: new FormData(form) })
            alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
            form.reset();
            const details = form.querySelector('.order-captcha-details');
            const inputEl = form.querySelector('.order-captcha-input');
            const errorEl = form.querySelector('.order-captcha-error');
            const checkbox = form.querySelector('.order-checkbox');
            if (details) details.style.display = 'none';
            if (inputEl) inputEl.value = '';
            if (errorEl) errorEl.textContent = '';
            if (checkbox) checkbox.checked = false;
        });
    });
});
