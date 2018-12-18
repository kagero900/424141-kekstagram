'use strict';

(function () {
  var picturesList = document.querySelector('.pictures');
  var pictureTemplate = document.querySelector('#picture').content;
  var filters = document.querySelector('.img-filters');
  var filterPopularButton = filters.querySelector('#filter-popular');
  var filterNewButton = filters.querySelector('#filter-new');
  var filterDiscussedButton = filters.querySelector('#filter-discussed');

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

  var loadHandler = function (data) {
    var pictures = data.map(function (picture, index) {
      picture.id = index;

      return picture;
    });
    window.dataPictures = pictures;

    renderPictures(window.dataPictures);
    filters.classList.remove('img-filters--inactive');
  };

  var clearPicturesField = function () {
    Array.prototype.forEach.call(picturesList.querySelectorAll('.picture'), function (picture) {
      picture.parentNode.removeChild(picture);
    });
  };

  var popularButtonClickHandler = function () {
    clearPicturesField();
    window.debounce(renderPictures(window.dataPictures));
  };

  var newButtonClickHandler = function () {
    clearPicturesField();
    var newPictures = window.dataPictures.slice().sort(function () {
      return Math.random() - 0.5;
    }).slice(0, 10);
    window.debounce(renderPictures(newPictures));
  };

  var discussedButtonClickHandler = function () {
    clearPicturesField();
    var sortPictures = window.dataPictures.slice().sort(function (pictureA, pictureB) {
      return pictureB.comments.length - pictureA.comments.length;
    });
    window.debounce(renderPictures(sortPictures));
  };

  filterPopularButton.addEventListener('click', popularButtonClickHandler);

  filterNewButton.addEventListener('click', newButtonClickHandler);

  filterDiscussedButton.addEventListener('click', discussedButtonClickHandler);

  window.backend.load(loadHandler, window.util.errorHandler);
})();
