'use strict';

(function () {
  var picturesList = document.querySelector('.pictures');
  var bigPicture = document.querySelector('.big-picture');
  var commentsList = bigPicture.querySelector('.social__comments');
  var bigPictureClose = bigPicture.querySelector('#picture-cancel');

  var makeElement = function (tagName, className) {
    var element = document.createElement(tagName);
    element.classList.add(className);

    return element;
  };

  var createComment = function (pictures) {
    var listItem = makeElement('li', 'social__comment');
    var image = makeElement('img', 'social__picture');

    image.src = pictures.avatar;
    image.alt = 'Аватар комментатора фотографии';
    image.width = '35';
    image.height = '35';
    listItem.appendChild(image);

    var commentText = makeElement('p', 'social__text');
    commentText.textContent = pictures.message;
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

  var renderBigPicture = function (imageId) {

    var image = window.dataPictures.find(function (picture) {
      return picture.id.toString() === imageId;
    });

    bigPicture.querySelector('.big-picture__img img').src = image.url;
    bigPicture.querySelector('.likes-count').textContent = image.likes;
    bigPicture.querySelector('.comments-count').textContent = image.comments.length;
    renderComments(image.comments);
    bigPicture.querySelector('.social__caption').textContent = image.description;
    bigPicture.classList.remove('hidden');
    bigPicture.focus();
  };

  // *******************************************************************
  // Показ изображения в полноэкранном режиме

  var pictureClickHandler = function (evt) {
    var target = evt.target;

    if (target.closest('.picture__img') && !target.closest('.picture__likes')) {
      renderBigPicture(target.dataset.id);
    }
  };

  var pictureEnterPressHandler = function (evt) {
    window.util.isEnterEvent(evt, function () {
      var target = evt.target.querySelector('.picture__img');
      renderBigPicture(target.dataset.id);
    });
  };

  var closeBigPicture = function () {
    bigPicture.classList.add('hidden');
  };

  picturesList.addEventListener('keydown', pictureEnterPressHandler);

  picturesList.addEventListener('click', pictureClickHandler);

  bigPictureClose.addEventListener('click', closeBigPicture);

  bigPicture.addEventListener('keydown', function (evt) {
    window.util.isEscEvent(evt, closeBigPicture);
  });
})();


