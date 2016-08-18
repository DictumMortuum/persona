"use strict";

(function() {
  var unit = function(config) {
    var api = {}

    function hash(h) {
      window.location.hash = h || "#"
    }

    function render() {

    }

    api.render = render
    api.hash = hash

    return api
  }

  window.persona = window.persona || {}
  window.persona.view = unit
})();
