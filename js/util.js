'use strict';

(function () {
  var KEY_CODE = {
    ENTER: 13,
    ESC: 27
  };

  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var main = document.querySelector('main');

  var createSuccessBlock = function () {
    var successBlock = successTemplate.cloneNode(true);

    main.appendChild(successBlock);
  };

  var createErrorBlock = function () {
    var errorBlock = errorTemplate.cloneNode(true);

    main.appendChild(errorBlock);
  };

  createSuccessBlock();
  createErrorBlock();

  var successPopup = main.querySelector('.success');
  var successButton = successPopup.querySelector('.success__button');

  var errorPopup = main.querySelector('.error');
  var errorButtons = errorPopup.querySelector('.error__buttons');

  var successPopupEscPressHandler = function (evt) {
    window.util.isEscEvent(evt, closeSuccessPopup);
  };

  var closeSuccessPopup = function () {
    successPopup.classList.add('success--hidden');
    document.removeEventListener('keydown', successPopupEscPressHandler);
  };

  var errorPopupEscPressHandler = function (evt) {
    window.util.isEscEvent(evt, closeErrorPopup);
  };

  var closeErrorPopup = function () {
    errorPopup.classList.add('error--hidden');
    document.removeEventListener('keydown', errorPopupEscPressHandler);
  };

  successButton.addEventListener('click', closeSuccessPopup);
  errorButtons.addEventListener('click', closeErrorPopup);

  successPopup.addEventListener('click', function (evt) {
    if (!evt.target.closest('.success__inner')) {
      closeSuccessPopup();
    }
  });

  errorPopup.addEventListener('click', function (evt) {
    if (!evt.target.closest('.error__inner')) {
      closeErrorPopup();
    }
  });

  document.addEventListener('keydown', errorPopupEscPressHandler);
  document.addEventListener('keydown', successPopupEscPressHandler);

  window.util = {
    isEscEvent: function (evt, action) {
      if (evt.keyCode === KEY_CODE.ESC) {
        action();
      }
    },

    isEnterEvent: function (evt, action) {
      if (evt.keyCode === KEY_CODE.ENTER) {
        action();
      }
    },

    successHandler: function () {
      window.closeForm();
      successPopup.classList.remove('success--hidden');
    },

    errorHandler: function (errorMessage) {
      window.closeForm();
      errorPopup.querySelector('.error__title').textContent = errorMessage;
      errorPopup.classList.remove('error--hidden');
    }
  };
})();
