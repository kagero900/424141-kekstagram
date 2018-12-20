'use strict';

(function () {
  var Scale = {
    STEP: 25,
    MIN: 25,
    MAX: 100,
    INC: 'inc',
    DEC: 'dec'
  };

  var Filter = {
    chrome: {
      NAME: 'chrome',
      MIN: 0,
      MAX: 1
    },
    sepia: {
      NAME: 'sepia',
      MIN: 0,
      MAX: 1
    },
    marvin: {
      NAME: 'marvin',
      MIN: 0,
      MAX: 100
    },
    phobos: {
      NAME: 'phobos',
      MIN: 0,
      MAX: 3
    },
    heat: {
      NAME: 'heat',
      MIN: 1,
      MAX: 3
    }
  };

  var INITIAL_VALUE = 100;

  var picturesList = document.querySelector('.pictures');
  var imagePreview = picturesList.querySelector('.img-upload__preview img');
  var imageForm = picturesList.querySelector('.img-upload__overlay');

  var scaleControlSmaller = imageForm.querySelector('.scale__control--smaller');
  var scaleControlBigger = imageForm.querySelector('.scale__control--bigger');
  var scaleControlValue = imageForm.querySelector('.scale__control--value');

  var effectsButtonsList = imageForm.querySelector('.effects');

  var effectLevel = imageForm.querySelector('.effect-level');
  var effectValue = effectLevel.querySelector('.effect-level__value');
  var effectLine = effectLevel.querySelector('.effect-level__line');
  var effectPin = effectLine.querySelector('.effect-level__pin');
  var effectDepth = effectLine.querySelector('.effect-level__depth');

  // **********************************************************************
  // Изменение масштаба изображения

  var scaleImage = function (val) {
    imagePreview.style.transform = 'scale(' + val / 100 + ')';
    scaleControlValue.value = val + '%';
  };

  var buttonScaleClickHandler = function (evt) {
    var scaleValue = parseInt(scaleControlValue.value, 10);

    switch (evt.target.dataset.scale) {
      case Scale.DEC:
        scaleValue -= Scale.STEP;
        break;
      case Scale.INC:
        scaleValue += Scale.STEP;
        break;
    }

    if (scaleValue >= Scale.MIN && scaleValue <= Scale.MAX) {
      scaleImage(scaleValue);
    }
  };

  scaleControlSmaller.addEventListener('click', buttonScaleClickHandler);
  scaleControlBigger.addEventListener('click', buttonScaleClickHandler);

  // **********************************************************
  // Переключение фильтров

  var getEffectLevelValue = function (filter) {
    return filter.MIN + (effectValue.value * (filter.MAX - filter.MIN) / 100);
  };

  var changeEffectLevel = function () {
    var nameToFilter = {
      'chrome': 'grayscale(' + getEffectLevelValue(Filter.chrome) + ')',
      'sepia': 'sepia(' + getEffectLevelValue(Filter.sepia) + ')',
      'marvin': 'invert(' + getEffectLevelValue(Filter.marvin) + '%)',
      'phobos': 'blur(' + getEffectLevelValue(Filter.phobos) + 'px)',
      'heat': 'brightness(' + getEffectLevelValue(Filter.heat) + ')'
    };

    imagePreview.style.filter = nameToFilter[imagePreview.dataset.filterName];
  };

  var resetStyles = function () {
    imagePreview.style = '';
    scaleControlValue.value = Scale.MAX + '%';
    effectPin.style.left = effectDepth.style.width = INITIAL_VALUE + '%';
    effectValue.value = INITIAL_VALUE;
  };

  var effectClickHandler = function (evt) {
    if (evt.target.closest('.effects__radio')) {
      imagePreview.className = 'effects__preview--' + evt.target.value;
      imagePreview.dataset.filterName = evt.target.value;

      resetStyles();
      changeEffectLevel();
    }

    if (imagePreview.dataset.filterName !== 'none') {
      effectLevel.classList.remove('hidden');
    } else {
      effectLevel.classList.add('hidden');
    }
  };

  effectsButtonsList.addEventListener('click', effectClickHandler);

  // ****************************************************************
  // Изменение насыщенности фильтров

  var getCoords = function (elem) {
    var box = elem.getBoundingClientRect();

    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
    };
  };

  effectPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var lineCoords = getCoords(effectLine);
    var pinCoords = getCoords(effectPin);
    var shiftX = evt.pageX - pinCoords.left - (effectPin.offsetWidth / 2);

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var newLeftCoord = moveEvt.pageX - shiftX - lineCoords.left;
      var rightEdge = effectLine.offsetWidth;

      if (newLeftCoord < 0) {
        newLeftCoord = 0;
      }

      if (newLeftCoord > rightEdge) {
        newLeftCoord = rightEdge;
      }

      effectPin.style.left = effectDepth.style.width = newLeftCoord + 'px';
      effectValue.value = Math.floor(newLeftCoord / effectLine.offsetWidth * 100);

      changeEffectLevel();
    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });
})();
