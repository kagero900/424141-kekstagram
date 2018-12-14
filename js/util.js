'use strict';

(function () {
  var KEY_CODE = {
    ENTER: 13,
    ESC: 27
  };

  window.util = {
    isEscEvent: function (evt, action) {
      if (evt.keyCode === KEY_CODE.ESC) {
        action();
      }
    },
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === KEY_CODE.ENTER) {
        action();
      }
    }
  };
})();
