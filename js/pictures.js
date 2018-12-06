'use strict';

var Picture = {
  COUNT: 25,
  MIN_LIKES: 15,
  MAX_LIKES: 200,
  MIN_COMMENTS: 0,
  MAX_COMMENTS: 10,
  MIN_AVATAR_NUM: 1,
  MAX_AVATAR_NUM: 6,

  COMMENTS: [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ],

  DESCRIPTIONS: [
    'Тестим новую камеру!',
    'Затусили с друзьями на море',
    'Как же круто тут кормят',
    'Отдыхаем...',
    'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
    'Вот это тачка!'
  ]
};

var picturesList = document.querySelector('.pictures');
var pictureTemplate = document.querySelector('#picture').content;
var bigPicture = document.querySelector('.big-picture');
var commentsList = bigPicture.querySelector('.social__comments');

var imagePreview = picturesList.querySelector('.img-upload__preview img');
var imageForm = picturesList.querySelector('.img-upload__overlay');

var getRandomInRange = function (min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
};

var getRandomElement = function (arr) {
  var randEl = Math.floor(Math.random() * arr.length);
  return arr[randEl];
};

var generateRandomComments = function () {
  var results = [];
  var quantity = getRandomInRange(Picture.MIN_COMMENTS, Picture.MAX_COMMENTS);
  for (var i = 0; i < quantity; i++) {
    var index = getRandomInRange(Picture.MIN_COMMENTS, Picture.COMMENTS.length - 1);
    results.push(Picture.COMMENTS[index]);
  }
  return results;
};

var generatePictures = function () {
  var pictures = [];

  for (var i = 1; i <= Picture.COUNT; i++) {
    pictures.push({
      url: 'photos/' + i + '.jpg',
      id: i,
      likes: getRandomInRange(Picture.MIN_LIKES, Picture.MAX_LIKES),
      comments: generateRandomComments(),
      description: getRandomElement(Picture.DESCRIPTIONS)
    });
  }

  return pictures;
};

var createPicture = function (picture) {
  var pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = picture.url;
  pictureElement.querySelector('.picture__img').dataset.id = picture.id;
  pictureElement.querySelector('.picture__likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;

  return pictureElement;
};

var renderPictures = function (pictures) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < pictures.length; i++) {
    fragment.appendChild(createPicture(pictures[i]));
  }

  picturesList.appendChild(fragment);
};

var makeElement = function (tagName, className) {
  var element = document.createElement(tagName);
  element.classList.add(className);

  return element;
};

var createComment = function (pictures) {
  var listItem = makeElement('li', 'social__comment');
  var image = makeElement('img', 'social__picture');

  image.src = 'img/avatar-' + getRandomInRange(Picture.MIN_AVATAR_NUM, Picture.MAX_AVATAR_NUM) + '.svg';
  image.alt = 'Аватар комментатора фотографии';
  image.width = '35';
  image.height = '35';
  listItem.appendChild(image);

  var commentText = makeElement('p', 'social__text');
  commentText.textContent = pictures;
  listItem.appendChild(commentText);

  return listItem;
};

var renderComments = function (pictures) {
  commentsList.innerHTML = '';
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < pictures.length; i++) {
    fragment.appendChild(createComment(pictures[i]));
  }

  commentsList.appendChild(fragment);
};

var renderBigPicture = function (picture) {

  bigPicture.querySelector('.big-picture__img img').src = picture.url;
  bigPicture.querySelector('.likes-count').textContent = picture.likes;
  bigPicture.querySelector('.comments-count').textContent = picture.comments.length;
  renderComments(picture.comments);
  bigPicture.querySelector('.social__caption').textContent = picture.description;
};

var pictures = generatePictures();

renderPictures(pictures);

// *******************************************************************
// Показ изображения в полноэкранном режиме

var bigPictureClose = bigPicture.querySelector('#picture-cancel');

var pictureClickHandler = function (evt) {
  var target = evt.target;

  if (!target.closest('.picture__img') || target.closest('.picture__likes')) {
    return;
  }

  var image = pictures.find(function (picture) {
    return picture.id.toString() === target.dataset.id;
  });

  renderBigPicture(image);
  bigPicture.classList.remove('hidden');
};

picturesList.addEventListener('click', pictureClickHandler);

bigPictureClose.addEventListener('click', function () {
  bigPicture.classList.add('hidden');
});

// ************************************************
// Показ формы редактирования изображения

var uploadFile = picturesList.querySelector('#upload-file');
var formClose = imageForm.querySelector('#upload-cancel');

uploadFile.addEventListener('change', function () {
  imageForm.classList.remove('hidden');
});

formClose.addEventListener('click', function () {
  imageForm.classList.add('hidden');
  resetStyles();
});

// функция сброса стилей
var resetStyles = function () {
  imagePreview.style = '';
  imagePreview.className = '';
  imagePreview.dataset.filter = '';
  uploadFile.name = ''; // хз как протестить
};

// **********************************************************************
// Изменение масштаба изображения

var Scale = {
  STEP: 25,
  MIN: 25,
  MAX: 100,
  INC: 'inc',
  DEC: 'dec'
};

var scaleControlSmaller = imageForm.querySelector('.scale__control--smaller');
var scaleControlBigger = imageForm.querySelector('.scale__control--bigger');
var scaleControlValue = imageForm.querySelector('.scale__control--value');

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

var effectsButtonsList = imageForm.querySelector('.effects');

var effectClickHandler = function (evt) {
  if (evt.target.closest('.effects__radio')) {
    imagePreview.className = 'effects__preview--' + evt.target.value;
    imagePreview.dataset.filterName = evt.target.value;
    imagePreview.style = '';
  }
};

effectsButtonsList.addEventListener('click', effectClickHandler);

// ****************************************************************
// Изменение насыщенности фильтров

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

var effectLevel = imageForm.querySelector('.effect-level');
var effectLine = effectLevel.querySelector('.effect-level__line');
var effectPin = effectLine.querySelector('.effect-level__pin');

effectPin.addEventListener('mouseup', function () {

  var newLeft = Math.floor(effectPin.offsetLeft / effectLine.offsetWidth * 100);

  var getEffectLevelValue = function (filter) {
    var effectLevelValue = filter.MIN + (newLeft * (filter.MAX - filter.MIN) / 100);
    return effectLevelValue;
  };

  var nameToFilter = {
    'chrome': 'grayscale(' + getEffectLevelValue(Filter.chrome) + ')',
    'sepia': 'sepia(' + getEffectLevelValue(Filter.sepia) + ')',
    'marvin': 'invert(' + getEffectLevelValue(Filter.marvin) + '%)',
    'phobos': 'blur(' + getEffectLevelValue(Filter.phobos) + 'px)',
    'heat': 'brightness(' + getEffectLevelValue(Filter.heat) + ')'
  };

  imagePreview.style.filter = nameToFilter[imagePreview.dataset.filterName];
});
