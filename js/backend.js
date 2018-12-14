'use strict';

(function () {
  var SUCCESS_CODE = 200;
  var TIMEOUT = 5000;

  var createXHR = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT; // 10s
    return xhr;
  };

  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var main = document.querySelector('main');

  var createErrorBlock = function () {
    var errorBlock = errorTemplate.cloneNode(true);

    main.appendChild(errorBlock);
  };

  createErrorBlock();

  var errorPopup = main.querySelector('.error');
  var errorButtons = errorPopup.querySelector('.error__buttons');

  var errorPopupEscPressHandler = function (evt) {
    window.util.isEscEvent(evt, closeErrorPopup);
  };

  var closeErrorPopup = function () {
    errorPopup.classList.add('error--hidden');
    document.removeEventListener('keydown', errorPopupEscPressHandler);
  };

  errorButtons.addEventListener('click', closeErrorPopup);

  errorPopup.addEventListener('click', function (evt) {
    if (!evt.target.closest('.error__inner')) {
      closeErrorPopup();
    }
  });

  document.addEventListener('keydown', errorPopupEscPressHandler);

  window.backend = {
    load: function (onLoad, onError) {
      var xhr = createXHR(onLoad, onError);

      xhr.open('GET', 'https://js.dump.academy/kekstagram/data');

      xhr.send();
    },

    upload: function (data, onLoad, onError) {
      var xhr = createXHR(onLoad, onError);

      xhr.open('POST', 'https://js.dump.academy/kekstagram');

      xhr.send(data);
    },

    errorHandler: function (errorMessage) {
      window.closeForm();
      errorPopup.querySelector('.error__title').textContent = errorMessage;
      errorPopup.classList.remove('error--hidden');
    }
  };
})();
