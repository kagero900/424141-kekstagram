'use strict';

(function () {
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

    DESCRIPTIONS: [
      'Тестим новую камеру!',
      'Затусили с друзьями на море',
      'Как же круто тут кормят',
      'Отдыхаем...',
      'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
      'Вот это тачка!'
    ]
  };

  var getRandomDescription = function (pictures) {
    return pictures[Math.floor(Math.random() * pictures.length)];
  };

  var generateRandomComments = function () {
    var results = [];
    var quantity = window.util.getRandomInRange(Picture.MIN_COMMENTS, Picture.MAX_COMMENTS);
    for (var i = 0; i < quantity; i++) {
      var index = window.util.getRandomInRange(Picture.MIN_COMMENTS, Picture.COMMENTS.length - 1);
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
        likes: window.util.getRandomInRange(Picture.MIN_LIKES, Picture.MAX_LIKES),
        comments: generateRandomComments(),
        description: getRandomDescription(Picture.DESCRIPTIONS),
      });
    }

    return pictures;
  };

  window.dataPictures = generatePictures();
})();

