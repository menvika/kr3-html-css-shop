(function () {
  "use strict";

  var toastTimer = null;

  function showToast(message) {
    var toast = document.getElementById("toast");
    var toastText = document.getElementById("toast-text");
    if (!toast || !toastText) return;

    // Гифка тоста подгружается только при первом показе, а не при загрузке страницы
    var toastImage = toast.querySelector("img[data-src]");
    if (toastImage) {
      toastImage.src = toastImage.dataset.src;
      toastImage.removeAttribute("data-src");
    }

    toastText.textContent = message;
    toast.classList.add("is-visible");

    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2500);
  }

  function initCartButtons() {
    document.querySelectorAll(".cart-button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        btn.classList.add("is-added");
        window.setTimeout(function () {
          btn.classList.remove("is-added");
        }, 600);

        var message = btn.id === "header-basket" ? 
          "Скоро тут будет корзина"
          : "Товар добавлен в корзину";

        showToast(message);
      });
    });
  }

  function initProductDialog() {
    var dialog = document.getElementById("product-dialog");
    var detailButtons = document.querySelectorAll(
      ".product-card__details, .product-card__button"
    );

    if (!detailButtons.length) return;

    detailButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var card = btn.closest(".product-card");
        if (!card) return;

        if (!dialog || !card.dataset.title) {
          window.location.href = "catalog.html";
          return;
        }

        document.getElementById("product-dialog-title").textContent = card.dataset.title;
        document.getElementById("product-dialog-description").textContent =
          card.dataset.description || "";
        document.getElementById("product-dialog-price").textContent =
          card.dataset.price || "";

        var image = document.getElementById("product-dialog-image");
        if (image) {
          image.src = card.dataset.image || "";
          image.alt = card.dataset.title || "";
        }

        dialog.showModal();
      });
    });

    var closeBtn = document.getElementById("close-product-dialog");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        dialog.close();
      });
    }
  }

  function initContactDialog() {
    // Получаем модальное окно по id.
    const orderDialog = document.getElementById('contact-order-dialog');

    // Получаем кнопку, которая открывает окно обратной связи.
    const openDialogButton = document.getElementById('open-order-dialog');

    // Получаем кнопку закрытия модального окна.
    const closeDialogButton = document.getElementById('close-contact-order-dialog');

    if (!orderDialog || !openDialogButton || !closeDialogButton) return;

    // Открываем модальное окно по клику на кнопку «Написать нам».
    openDialogButton.addEventListener('click', () => {
      if (successMessage) {
        successMessage.hidden = true;
      }
      orderForm.reset();
      orderDialog.showModal();
    });

    // Закрываем модальное окно по кнопке «Закрыть».
    closeDialogButton.addEventListener('click', () => {
      orderDialog.close();
    });

    // Получаем форму заявки.
    const orderForm = document.getElementById('contact-order-form');

    // Получаем сообщение об успешной отправке.
    const successMessage = document.getElementById('success-message');

    if (!orderForm) return;

    // Обрабатываем отправку формы.
    orderForm.addEventListener('submit', (event) => {
      // Отменяем стандартную отправку формы,
      // потому что backend пока не подключён.
      event.preventDefault();

      // Сбрасываем предыдущие признаки ошибок.
      const formElements = Array.from(orderForm.elements);

      formElements.forEach((element) => {
        if (element.willValidate) {
          element.removeAttribute('aria-invalid');
        }
      });

      // Проверяем встроенные HTML-ограничения формы.
      if (!orderForm.checkValidity()) {
        formElements.forEach((element) => {
          if (element.willValidate && !element.checkValidity()) {
            element.setAttribute('aria-invalid', 'true');
          }
        });

        // Показываем стандартные сообщения браузера.
        orderForm.reportValidity();
        return;
      }

      // Показываем сообщение об успешной отправке.
      if (successMessage) { successMessage.hidden = false; }

      // Очищаем форму.
      orderForm.reset();
      
    });
  }

  function initFaq() {
  var items = document.querySelectorAll(".faq-item");
  if (!items.length) return;

  items.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (!item.open) return;
      items.forEach(function (other) {
        if (other !== item) other.removeAttribute("open");
      });
    });
  });
}

  /* ---------- КР №3: адаптивность и доступность ---------- */

  // Мобильное меню (бургер). Без JS меню остаётся раскрытым списком ссылок.
  function initNav() {
    var nav = document.querySelector(".site-nav");
    var toggle = nav && nav.querySelector(".nav-toggle");
    var list = nav && nav.querySelector(".site-nav__list");
    if (!toggle || !list) return;

    toggle.hidden = false;
    nav.classList.add("is-collapsible");

    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Esc закрывает меню и возвращает фокус на кнопку
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    // Клик вне меню закрывает его
    document.addEventListener("click", function (event) {
      if (!nav.contains(event.target)) setOpen(false);
    });

    // При переходе на планшет/desktop сбрасываем состояние
    window.matchMedia("(min-width: 768px)").addEventListener("change", function () {
      setOpen(false);
    });
  }

  // Фильтр каталога: на мобильном свёрнут, на desktop всегда раскрыт
  function initFiltersToggle() {
    var details = document.querySelector(".filters-toggle");
    if (!details) return;

    var summary = details.querySelector("summary");
    var mq = window.matchMedia("(min-width: 1024px)");

    function sync() {
      details.open = mq.matches;
      if (summary) summary.tabIndex = mq.matches ? -1 : 0;
    }

    sync();
    mq.addEventListener("change", sync);
    details.addEventListener("toggle", function () {
      if (mq.matches && !details.open) details.open = true;
    });
  }

  // Сообщение об ошибке рядом с полем (связано через aria-describedby)
  function showFieldError(field) {
    var wrap = field.closest(".form-field");
    if (!wrap) return;
    var id = field.id + "-error";
    var msg = document.getElementById(id);
    if (!msg) {
      msg = document.createElement("small");
      msg.id = id;
      msg.className = "field-error";
      wrap.appendChild(msg);
    }
    msg.textContent = field.validationMessage;
    field.setAttribute("aria-invalid", "true");
    var base = field.dataset.describedby || "";
    field.setAttribute("aria-describedby", (base + " " + id).trim());
  }

  function clearFieldError(field) {
    field.removeAttribute("aria-invalid");
    var msg = document.getElementById(field.id + "-error");
    if (msg) msg.remove();
    if (field.dataset.describedby) {
      field.setAttribute("aria-describedby", field.dataset.describedby);
    } else {
      field.removeAttribute("aria-describedby");
    }
  }

  function initOrderPage() {
    var form = document.getElementById("order-form");
    if (!form) return;

    var status = document.getElementById("order-status");
    var product = document.getElementById("order-product");
    var date = document.getElementById("order-date");
    var addressField = document.getElementById("address-field");
    var address = document.getElementById("order-address");

    // Не даём выбрать дату в прошлом
    if (date) {
      var now = new Date();
      var iso = now.getFullYear() + "-" +
        String(now.getMonth() + 1).padStart(2, "0") + "-" +
        String(now.getDate()).padStart(2, "0");
      date.min = iso;
    }

    // Предвыбор букета из ссылки order.html?product=...
    var wanted = new URLSearchParams(window.location.search).get("product");
    if (wanted && product) product.value = wanted;

    // Адрес нужен только для доставки курьером
    function syncDelivery() {
      var pickup = form.elements.delivery.value === "pickup";
      addressField.hidden = pickup;
      address.disabled = pickup;
      address.required = !pickup;
      if (pickup) clearFieldError(address);
    }
    form.querySelectorAll('input[name="delivery"]').forEach(function (r) {
      r.addEventListener("change", syncDelivery);
    });
    syncDelivery();

    // Ошибка пропадает, как только поле исправлено
    Array.from(form.elements).forEach(function (el) {
      el.dataset.describedby = el.getAttribute("aria-describedby") || "";
      el.addEventListener("input", function () {
        if (el.getAttribute("aria-invalid") === "true" && el.checkValidity()) {
          clearFieldError(el);
        }
      });
    });

    form.addEventListener("reset", function () {
      Array.from(form.elements).forEach(function (el) {
        if (el.id) clearFieldError(el);
      });
      status.textContent = "";
      window.setTimeout(syncDelivery, 0);
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      status.textContent = "";

      var firstInvalid = null;
      Array.from(form.elements).forEach(function (el) {
        if (!el.willValidate || !el.id) return;
        if (el.checkValidity()) {
          clearFieldError(el);
        } else {
          showFieldError(el);
          if (!firstInvalid) firstInvalid = el;
        }
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      var name = form.elements.name.value.trim();
      var text = "Спасибо, " + name + "! Заявка на «" + product.value +
        "» (" + form.elements.qty.value + " шт.) принята — мы свяжемся с вами для подтверждения.";
      // Сначала очищаем форму (reset сбрасывает и статус), затем показываем сообщение
      form.reset();

      var p = document.createElement("p");
      p.className = "form-status";
      p.textContent = text;
      status.appendChild(p);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initCartButtons();
    initProductDialog();
    initContactDialog();
    initFaq();
    initNav();
    initFiltersToggle();
    initOrderPage();
  });
})();
