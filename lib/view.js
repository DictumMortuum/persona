"use strict";

(function() {
  var unit = function(config) {
    var api = {}

    return api
  }

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = unit
  } else {
    window.persona = window.persona || {}
    window.persona.view = unit
  }
})();
