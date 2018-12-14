'use strict';

(function () {
  var Hashtag = {
    MAX: 5,
    MIN_LENGTH: 2,
    MAX_LENGTH: 20
  };

  var picturesList = document.querySelector('.pictures'); // задваивается по типу setup в демке
  var main = document.querySelector('main');
  var form = picturesList.querySelector('.img-upload__form');
  var imagePreview = picturesList.querySelector('.img-upload__preview img');
  var imageForm = picturesList.querySelector('.img-upload__overlay');
  var uploadFile = picturesList.querySelector('#upload-file');
  var formClose = imageForm.querySelector('#upload-cancel');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');

  var hashtagsInput = imageForm.querySelector('.text__hashtags');
  var commentInput = imageForm.querySelector('.text__description');

  // Показ формы редактирования изображения

  var resetStyles = function () {
    imagePreview.style = '';
    imagePreview.className = '';
    imagePreview.dataset.filter = '';
    uploadFile.name = ''; // хз как протестить
  };

  var formEscPressHandler = function (evt) {
    window.util.isEscEvent(evt, window.closeForm);
  };

  var openForm = function () {
    imageForm.classList.remove('hidden');
    document.addEventListener('keydown', formEscPressHandler);
  };

  window.closeForm = function () {
    if (hashtagsInput !== document.activeElement
      && commentInput !== document.activeElement) {
      imageForm.classList.add('hidden');
      resetStyles();
      document.removeEventListener('keydown', formEscPressHandler);
    }
  };

  var createSuccessBlock = function () {
    var successBlock = successTemplate.cloneNode(true);
    main.appendChild(successBlock);
  };

  createSuccessBlock();

  var successPopup = main.querySelector('.success');
  var successButton = successPopup.querySelector('.success__button');

  var successHandler = function () {
    window.closeForm();
    successPopup.classList.remove('success--hidden');
  };

  var successPopupEscPressHandler = function (evt) {
    window.util.isEscEvent(evt, closeSuccessPopup);
  };

  var closeSuccessPopup = function () {
    successPopup.classList.add('success--hidden');
    document.removeEventListener('keydown', successPopupEscPressHandler);
  };

  successButton.addEventListener('click', function () {
    closeSuccessPopup();
  });

  successPopup.addEventListener('click', function (evt) {
    if (!evt.target.closest('.success__inner')) {
      closeSuccessPopup();
    }
  });

  document.addEventListener('keydown', successPopupEscPressHandler);

  form.addEventListener('submit', function (evt) {
    window.backend.upload(new FormData(form), successHandler, window.backend.errorHandler);
    evt.preventDefault();
  });

  uploadFile.addEventListener('change', openForm);

  formClose.addEventListener('click', window.closeForm);

  // *********************************************************
  // Валидация хэш-тегов

  var checkFirstSymbol = function (hashtag) {
    return hashtag.charAt(0) !== '#';
  };

  var checkMinLength = function (hashtag) {
    return hashtag.length < Hashtag.MIN_LENGTH;
  };

  var checkMaxLength = function (hashtag) {
    return hashtag.length > Hashtag.MAX_LENGTH;
  };

  var checkNoSpace = function (hashtag) {
    return /([a-z0-9]#)/.test(hashtag);
  };

  var checkUnique = function (hashtags) {
    var unique = {};

    for (var i = 0; i < hashtags.length; i++) {
      unique[hashtags[i].toLowerCase()] = true;
    }
    return Object.keys(unique).length < hashtags.length;
  };

  hashtagsInput.addEventListener('input', function (evt) {
    var value = evt.target.value;
    var newValue = value.replace(/^\s/, '').replace(/\s{2,}/, ' ');
    evt.target.value = newValue;

    var hashtags = newValue.trim().split([' ']);

    if (hashtags.some(checkFirstSymbol)) {
      evt.target.setCustomValidity('Хэш-тег должен начинаться с символа #');
    } else if (hashtags.some(checkMinLength)) {
      evt.target.setCustomValidity('Хэш-тег должен содержать минимум 2 символа');
    } else if (hashtags.some(checkMaxLength)) {
      evt.target.setCustomValidity('Хэш-тег должен содержать максимум 20 символов');
    } else if (hashtags.some(checkNoSpace)) {
      evt.target.setCustomValidity('Хэш-теги должны разделяться пробелами');
    } else if (hashtags.length > Hashtag.MAX) {
      evt.target.setCustomValidity('Вы можете добавить максимум 5 хэш-тегов');
    } else if (checkUnique(hashtags)) {
      evt.target.setCustomValidity('Хэш-теги должны быть уникальными, невзирая на регистр');
    } else {
      evt.target.setCustomValidity('');
    }
  });
})();
