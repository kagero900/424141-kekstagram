'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var Hashtag = {
    MAX: 5,
    MIN_LENGTH: 2,
    MAX_LENGTH: 20
  };

  var form = document.querySelector('.img-upload__form');
  var imageForm = form.querySelector('.img-upload__overlay');
  var picturePreview = imageForm.querySelector('.img-upload__preview img');

  var uploadFile = form.querySelector('#upload-file');
  var formClose = imageForm.querySelector('#upload-cancel');

  var hashtagsInput = imageForm.querySelector('.text__hashtags');
  var commentInput = imageForm.querySelector('.text__description');

  // Загрузка файла с компа пользователя

  var loadUserImage = function (onError) {
    var file = uploadFile.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        picturePreview.src = reader.result;
      });

      reader.readAsDataURL(file);
      openForm();
    } else {
      onError('Некорректный формат файла');
      resetForm();
    }
  };

  // Показ формы редактирования изображения

  var resetForm = function () {
    picturePreview.style = '';
    picturePreview.className = '';
    picturePreview.dataset.filter = '';
    uploadFile.value = '';
    hashtagsInput.value = '';
    commentInput.value = '';
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
      resetForm();
      document.removeEventListener('keydown', formEscPressHandler);
    }
  };

  form.addEventListener('submit', function (evt) {
    window.backend.upload(new FormData(form), window.util.successHandler, window.util.errorHandler);
    evt.preventDefault();
  });

  uploadFile.addEventListener('change', function () {
    loadUserImage(window.util.errorHandler);
  });

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
    var unique = hashtags.reduce(function (result, hashtag) {
      result[hashtag.toLowerCase()] = true;

      return result;
    }, {});

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
    } else if (hashtags.some(checkNoSpace)) {
      evt.target.setCustomValidity('Хэш-теги должны разделяться пробелами');
    } else if (hashtags.length > Hashtag.MAX) {
      evt.target.setCustomValidity('Вы можете добавить максимум 5 хэш-тегов');
    } else if (checkUnique(hashtags)) {
      evt.target.setCustomValidity('Хэш-теги должны быть уникальными, невзирая на регистр');
    } else if (hashtags.some(checkMaxLength)) {
      evt.target.setCustomValidity('Хэш-тег должен содержать максимум 20 символов');
    } else {
      evt.target.setCustomValidity('');
    }
  });
})();
