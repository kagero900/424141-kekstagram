'use strict';

var Picture = {
  COUNT: 25,
  MIN_LIKES: 15,
  MAX_LIKES: 200,
  MIN_COMMENTS: 1,
  MAX_COMMENTS: 10,

  comments: [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ],

  description: [
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

var getRandomInRange = function (min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
};

var getRandomElement = function (arr) {
  var randEl = Math.floor(Math.random() * arr.length);
  return arr[randEl];
};

var getComments = function (arr, min, max) {
  var test = [];
  var quantity = getRandomInRange(min, max);
  for (var i = 0; i < quantity; i++) {
    var index = getRandomInRange(min, arr.length);
    test.push(arr[index]);
  }
  return test;
};

var generatePictures = function () {
  var pictures = [];
  for (var i = 1; i <= Picture.COUNT; i++) {
    pictures.push({
      url: 'photos/' + i + '.jpg',
      likes: getRandomInRange(Picture.MIN_LIKES, Picture.MAX_LIKES),
      comments: getComments(Picture.comments, Picture.MIN_COMMENTS, Picture.MAX_COMMENTS),
      description: getRandomElement(Picture.description)
    });
  }

  return pictures;
};

var pictures = generatePictures(); // for TEST!!!
// console.log(pictures);

var renderPicture = function (picture) {
  var pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = picture.url;
  pictureElement.querySelector('.picture__likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;

  return pictureElement;
};

var createPictures = function (arr) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < arr.length; i++) {
    fragment.appendChild(renderPicture(arr[i]));
  }

  picturesList.appendChild(fragment);
};

var makeElement = function (tagName, className, text) {
  var element = document.createElement(tagName);
  element.classList.add(className);
  if (text) {
    element.textContent = text;
  }
  return element;
};

var bletcom = function (arr) { // это чушь!!
  for (var j = 0; j < arr.length; j++) {
    var x = arr[j];

  }
  return x;
};

// console.log(pictures[0].comments[0]);
// console.log(pictures[0].comments[1]);
// console.log(pictures[0].comments[3]);
// console.log(bletcom(pictures[0].comments));
var createComment = function () {
  var listItem = makeElement('li', 'social__comment');

  var image = makeElement('img', 'social__picture');
  image.src = 'img/avatar-' + getRandomInRange(1, 6) + '.svg';
  image.alt = 'Аватар комментатора фотографии';
  image.width = '35';
  image.height = '35';
  listItem.appendChild(image);

  var comText = makeElement('p', 'social__text');
  comText.textContent = bletcom(pictures[0].comments); // как докопаться до коммента из pictures?
  listItem.appendChild(comText);
  // console.log(comText);

  return listItem;
};

var com = function () {

  while (commentsList.firstChild) {
    commentsList.removeChild(commentsList.firstChild);
  }

  for (var i = 0; i < pictures[0].comments.length; i++) {
    var cardItem = createComment(pictures[0].comments[i]);
    commentsList.appendChild(cardItem);
  }

};

var renderBigPicture = function (picture) {

  bigPicture.querySelector('.big-picture__img img').src = picture.url;
  bigPicture.querySelector('.likes-count').textContent = picture.likes;
  bigPicture.querySelector('.comments-count').textContent = picture.comments.length;
  com();
  bigPicture.querySelector('.social__caption').textContent = picture.description;

  return bigPicture;
};

var showPictures = function () {
  // var pictures = generatePictures();
  createPictures(pictures);

};

showPictures();

var showBigPicture = function () {
  // var a = generatePictures();
  renderBigPicture(pictures[0]);
  bigPicture.classList.remove('hidden');
  bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden'); // временно для теста
  bigPicture.querySelector('.comments-loader').classList.add('visually-hidden'); // временно для теста
};

showBigPicture();
