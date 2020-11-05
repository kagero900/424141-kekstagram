'use strict';

(function () {
  var SUCCESS_CODE = 200;
  var TIMEOUT = 5000;

  var errorToMessage = {
    '301': 'Moved Permanently',
    '302': 'Moved Temporarily',
    '400': 'Bad Request',
    '401': 'Unauthorized',
    '402': 'Payment Required',
    '403': 'Forbidden',
    '404': 'Not Found',
    '418': 'I\'m a teapot',
    '500': 'Internal Server Error',
    '502': 'Bad Gateway'
  };

  var createXHR = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + errorToMessage[xhr.status]);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;
    return xhr;
  };

  window.backend = {
    load: function (onLoad, onError) {
      var xhr = createXHR(onLoad, onError);

      xhr.open('GET', 'https://javascript.pages.academy/kekstagram/data');

      xhr.send();
    },

    upload: function (data, onLoad, onError) {
      var xhr = createXHR(onLoad, onError);

      xhr.open('POST', 'https://js.dump.academy/kekstagram');

      xhr.send(data);
    }
  };
})();
