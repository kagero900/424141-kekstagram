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
var commentCount = bigPicture.querySelector('.social__comment-count');
var commentsLoader = bigPicture.querySelector('.comments-loader');

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

var showBigPicture = function () { // ывот и не нужна эта функция

  renderBigPicture(pictures);
  bigPicture.classList.remove('hidden');
  commentCount.classList.add('visually-hidden');
  commentsLoader.classList.add('visually-hidden');
};

//showBigPicture();

// Обработка изменения значения поля выбора файла #upload-file.
// При наступлении события change на этом поле, можно сразу показывать
// форму редактирования изображения.

// находим поле выбора файла #upload-file
var uploadFile = picturesList.querySelector('#upload-file');
// находим форму редактирования изображения
var imageForm = picturesList.querySelector('.img-upload__overlay');
// событие change, убираем класс hidden
uploadFile.addEventListener('change', function () {
  imageForm.classList.remove('hidden');
  scaleControlValue.value = '100%'; // кажется этому тут не место
});
// закроем форму
// крестик
var closeForm = imageForm.querySelector('#upload-cancel');
closeForm.addEventListener('click', function () {
  imageForm.classList.add('hidden');
  imagePreview.removeAttribute('style'); // сброс стилей при закрытии, но сюда ли его записывать?
  //uploadFile.name = ''; // хз как протестить
});

// добавим на пин слайдера .effect-level__pin обработчик события mouseup,
// который будет согласно ТЗ изменять уровень насыщенности фильтра для изображения
// найдем сам пин
var effectPin = picturesList.querySelector('.effect-level__pin');

// найдем превью картинки, к которой применяется эффект
var imagePreview = picturesList.querySelector('.img-upload__preview');

// повесим событие mouseup
effectPin.addEventListener('mouseup', function () {
  // изменение уровня насыщенности.хз как делать ващщще
});


// Нажатие на фотографию приводит к показу фотографии в полноэкранном режиме.
// событие click на picture__img? picture? вызывает функцию showBigPicture[i]?
var thumbnails = document.querySelectorAll('.picture__img');

var addThumbnailClickHandler = function (thumbnail, photo) {
  thumbnail.addEventListener('click', function () {
    renderBigPicture(photo);
    bigPicture.classList.remove('hidden');
  });
};

for (var i = 0; i < pictures.length; i++) {
  addThumbnailClickHandler(thumbnails[i], pictures[i]);
}

var closeBigPicture = bigPicture.querySelector('#picture-cancel');
closeBigPicture.addEventListener('click', function () {
  bigPicture.classList.add('hidden');
});


// изменение изображений

// При нажатии на кнопки .scale__control--smaller и .scale__control--bigger
// должно изменяться значение поля .scale__control--value
// ок, найдем кнопки

var scaleControlSmaller = imageForm.querySelector('.scale__control--smaller');
var scaleControlBigger = imageForm.querySelector('.scale__control--bigger');

// найдем поле, которое менять
var scaleControlValue = imageForm.querySelector('.scale__control--value');

// обработка клика по конопке

//При изменении значения поля .scale__control--value изображению
// .img-upload__preview должен добавляться соответствующий стиль CSS,
// который с помощью трансформации effect-level задаёт масштаб.

// найдем effect-level, который будем транформировать

var effectLevel = imageForm.querySelector('.effect-level');


var step = 0.25;

scaleControlBigger.addEventListener('click', function () {
  var val = (parseInt(scaleControlValue.value, 10) / 100 + step);
  if (val<=1) {
    imagePreview.style.transform = 'scale('+ val + ')';
    scaleControlValue.value = val * 100 +'%';
  }

});

scaleControlSmaller.addEventListener('click', function () {
  var val = (parseInt(scaleControlValue.value, 10) / 100 - step);
  if (val>=0.25) {
    imagePreview.style.transform = 'scale('+ val + ')';
    scaleControlValue.value = val * 100 +'%';
  }
});

