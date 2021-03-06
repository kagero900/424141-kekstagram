'use strict';

(function () {
  var LOAD_COMMENTS_LIMIT = 5;
  var remainingComments;
  var commentsQuantity = {};

  var picturesContainer = document.querySelector('.pictures');
  var bigPicture = document.querySelector('.big-picture');
  var previewImage = bigPicture.querySelector('.big-picture__img img');
  var previewLikes = bigPicture.querySelector('.likes-count');
  var previewDescription = bigPicture.querySelector('.social__caption');
  var commentsList = bigPicture.querySelector('.social__comments');
  var commentsLoader = bigPicture.querySelector('.comments-loader');
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
    var fragment = document.createDocumentFragment();

    pictures.forEach(function (item) {
      fragment.appendChild(createComment(item));
    });

    commentsList.appendChild(fragment);

    updateCommentsContent(commentsQuantity.currentCount, commentsQuantity.totalCount);
  };

  var renderImage = function (imageId) {
    var image = window.dataPictures.find(function (picture) {
      return picture.id.toString() === imageId;
    });

    remainingComments = image.comments.slice(0);
    previewImage.src = image.url;
    previewLikes.textContent = image.likes;
    previewDescription.textContent = image.description;
  };

  var renderBigPicture = function (imageId) {
    renderImage(imageId);

    commentsQuantity.totalCount = remainingComments.length;
    commentsList.innerHTML = '';

    renderComments(prepareComments(remainingComments));

    bigPicture.classList.remove('hidden');
    bigPicture.focus();
  };

  var prepareComments = function (comments) {
    if (comments.length > LOAD_COMMENTS_LIMIT) {
      commentsLoader.classList.remove('hidden');
      commentsQuantity.currentCount = commentsQuantity.totalCount - comments.length + LOAD_COMMENTS_LIMIT;

      return comments.splice(0, LOAD_COMMENTS_LIMIT);
    }

    commentsLoader.classList.add('hidden');
    commentsQuantity.currentCount = commentsQuantity.totalCount;

    return comments.splice(0, comments.length);
  };

  var updateCommentsContent = function (currentCount, totalCount) {
    bigPicture.querySelector('.social__comment-count').textContent = currentCount + ' из '
      + totalCount + ' комментариев';
  };

  var loadCommentsClickHandler = function () {
    renderComments(prepareComments(remainingComments));
  };

  commentsLoader.addEventListener('click', loadCommentsClickHandler);

  // *******************************************************************
  // Показ изображения в полноэкранном режиме

  var openBigPictureModal = function (pictures) {
    renderBigPicture(pictures);
    document.body.classList.add('modal-open');
  };

  var pictureClickHandler = function (evt) {
    var target = evt.target;

    if (target.closest('.picture__img') && !target.closest('.picture__likes')) {
      openBigPictureModal(target.dataset.id);
    }
  };

  var pictureEnterPressHandler = function (evt) {
    window.util.isEnterEvent(evt, function () {
      var target = evt.target.querySelector('.picture__img');
      openBigPictureModal(target.dataset.id);
    });
  };

  var closeBigPicture = function () {
    bigPicture.classList.add('hidden');
    document.body.classList.remove('modal-open');
  };

  picturesContainer.addEventListener('keydown', pictureEnterPressHandler);

  picturesContainer.addEventListener('click', pictureClickHandler);

  bigPictureClose.addEventListener('click', closeBigPicture);

  document.addEventListener('keydown', function (evt) {
    window.util.isEscEvent(evt, closeBigPicture);
  });
})();


