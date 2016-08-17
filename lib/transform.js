"use strict";

(function() {
  var unit = function(config) {
    var api = {}

    api.message = function(doc) {
      doc.date = moment(doc._id).toString()
      if(doc.from === undefined) {
        doc.from = "someone"
      }
      return doc
    }

    api.deleted = function(doc) {
      if(doc._deleted === undefined || doc._deleted !== true) {
        return false
      } else {
        return true
      }
    }

    return api
  }

  var moment

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = unit
    moment = require("moment")
  } else {
    window.persona = window.persona || {}
    window.persona.transform = unit
    moment = window.moment
  }
})();
