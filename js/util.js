'use strict';

(function () {
  var KEY_CODE = {
    ENTER: 13,
    ESC: 27
  };

  window.util = {
    ENTER_KEYCODE: KEY_CODE.ENTER, // может сразу 13 и 27?
    ESC_KEYCODE: KEY_CODE.ESC,

    getRandomInRange: function (min, max) {
      return Math.floor(min + Math.random() * (max + 1 - min));
    }
  };
})();
