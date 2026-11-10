(function () {
  "use strict";

  var toastTimer = null;

  function showToast(message) {
    var toast = document.getElementById("toast");
    var toastText = document.getElementById("toast-text");
    if (!toast || !toastText) return;

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

  document.addEventListener("DOMContentLoaded", function () {
    initCartButtons();
    initProductDialog();
    initContactDialog();
    initFaq();
  });
})();
