"use strict";

(function() {
  var unit = function(config) {
    var api = {}

    api.message_view = function(docs) {
      var doc, temp = {}
      var args = {
        users: []
      }

      for(var i = 0; i < docs.length; i++) {
        doc = message(docs[i])

        if(temp[doc.from] === undefined) {
          temp[doc.from] = {
            username: doc.from,
            messages: []
          }
        }

        temp[doc.from].messages.push(doc)
      }

      for(var user in temp) {
        args.users.push(temp[user])
      }

      return args
    }

    function message(doc) {
      doc.date = moment(doc._id).format("YYYY-MM-DD HH:mm:ss")
      if(doc.from === undefined) {
        doc.from = "someone"
      }
      return doc
    }

    function deleted(doc) {
      if(doc._deleted === undefined || doc._deleted !== true) {
        return false
      } else {
        return true
      }
    }

    api.message = message
    api.deleted = deleted

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
