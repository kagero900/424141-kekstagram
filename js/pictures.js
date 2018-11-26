'use strict';

var Picture = {
  COUNT: 25,
  MIN_LIKES: 15,
  MAX_LIKES: 200,
  MIN_COMMENTS: 0,
  MAX_COMMENTS: 10,

  COMMENTS: [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ],

  DESCRIPTION: [
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

var getComments = function (arr, min, max) {
  var results = [];
  var quantity = getRandomInRange(min, max);
  for (var i = 0; i < quantity; i++) {
    var index = getRandomInRange(min, arr.length - 1);
    results.push(arr[index]);
  }
  return results;
};

var generatePictures = function () {
  var pictures = [];

  for (var i = 1; i <= Picture.COUNT; i++) {
    pictures.push({
      url: 'photos/' + i + '.jpg',
      likes: getRandomInRange(Picture.MIN_LIKES, Picture.MAX_LIKES),
      comments: getComments(Picture.COMMENTS, Picture.MIN_COMMENTS, Picture.MAX_COMMENTS),
      description: getRandomElement(Picture.DESCRIPTION)
    });
  }

  return pictures;
};

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

var makeElement = function (tagName, className) {
  var element = document.createElement(tagName);
  element.classList.add(className);

  return element;
};

var createComment = function (item) {
  var listItem = makeElement('li', 'social__comment');

  var image = makeElement('img', 'social__picture');
  image.src = 'img/avatar-' + getRandomInRange(1, 6) + '.svg';
  image.alt = 'Аватар комментатора фотографии';
  image.width = '35';
  image.height = '35';
  listItem.appendChild(image);

  var commentText = makeElement('p', 'social__text');
  commentText.textContent = item;
  listItem.appendChild(commentText);

  return listItem;
};

var renderComments = function (arr) {

  while (commentsList.firstChild) {
    commentsList.removeChild(commentsList.firstChild);
  }

  for (var i = 0; i < arr.length; i++) {
    var commentsItem = createComment(arr[i]);
    commentsList.appendChild(commentsItem);
  }

};

var renderBigPicture = function (picture) {

  bigPicture.querySelector('.big-picture__img img').src = picture.url;
  bigPicture.querySelector('.likes-count').textContent = picture.likes;
  bigPicture.querySelector('.comments-count').textContent = picture.comments.length;
  renderComments(picture.comments);
  bigPicture.querySelector('.social__caption').textContent = picture.description;

  return bigPicture;
};

var pictures = generatePictures();

createPictures(pictures);

var showBigPicture = function () {

  renderBigPicture(pictures[0]);
  bigPicture.classList.remove('hidden');
  commentCount.classList.add('visually-hidden');
  commentsLoader.classList.add('visually-hidden');
};

showBigPicture();
