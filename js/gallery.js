'use strict';

(function () {
  var MAX_NEW_PHOTOS = 10;
  var ACTIVE_CLASSNAME = 'img-filters__button--active';

  var picturesList = document.querySelector('.pictures');
  var pictureTemplate = document.querySelector('#picture').content;
  var filters = document.querySelector('.img-filters');
  var filtersButtons = filters.querySelectorAll('.img-filters__button');

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

  var updatePictures = function (data) {
    clearPicturesField();
    window.debounce(function () {
      renderPictures(data);
    });
  };

  var clearActive = function () {
    filtersButtons.forEach(function (item) {
      item.classList.remove(ACTIVE_CLASSNAME);
    });
  };

  var getPopularPhotos = function () {
    return window.dataPictures;
  };

  var getNewPhotos = function () {
    return window.dataPictures.slice().sort(function () {
      return Math.random() - 0.5;
    }).slice(0, MAX_NEW_PHOTOS);
  };

  var getMaxCommentsPhotos = function () {
    return window.dataPictures.slice().sort(function (pictureA, pictureB) {
      return pictureB.comments.length - pictureA.comments.length;
    });
  };

  var filterToSortData = {
    'popular': getPopularPhotos,
    'new': getNewPhotos,
    'discussed': getMaxCommentsPhotos
  };

  var showFilteredPictures = function (evt) {
    var target = evt.target;

    if (target.closest('.img-filters__button')) {
      var filter = target.dataset.sortFilter;

      clearActive();
      target.classList.add(ACTIVE_CLASSNAME);
      updatePictures(filterToSortData[filter]());
    }
  };

  filters.addEventListener('click', showFilteredPictures);

  window.backend.load(loadHandler, window.util.errorHandler);
})();
