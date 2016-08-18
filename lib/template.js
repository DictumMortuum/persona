"use strict";

(function() {
  var unit = function(path) {
    var api = {}
    var cache = {}

    api.init = function(templates) {
      var tpl = []

      for(var i = 0; i < templates.length; i++) {
        tpl.push(load(templates[i]))
      }

      return Promise.all(tpl)
    }

    function load(selector) {
      return new Promise(function(resolve, reject) {
        get(path + selector + '.mustache.html', function(err, template) {
          if(err) {
            reject(err)
          } else {
            cache[selector] = template.toString()
            resolve(template)
          }
        })
      })
    }

    api.load = load

    function retrieve(selector) {
      return cache[selector]
    }

    api.retrieve = retrieve

    api.render = function(selector, data, partial) {
      var template = cache[selector]
      Mustache.parse(template)
      var temp = {}

      if(partial !== undefined) {
        for(var i = 0; i < partial.length; i++) {
          temp[partial[i]] = retrieve(partial[i])
        }
      }

      return Mustache.render(template, data, temp)
    }

    return api
  }

  var get, Mustache

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    get = require('fs').readFile
    Mustache = require('mustache')
    module.exports = unit
  } else {
    get = function(theUrl, callback) {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
          callback(null, xmlHttp.responseText);
      }
      xmlHttp.open("GET", theUrl, true); // true for asynchronous
      xmlHttp.send(null);
    }
    Mustache = window.Mustache
    window.persona = window.persona || {}
    window.persona.template = unit
  }
})();
