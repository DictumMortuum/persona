"use strict";

class Template extends Module {
  constructor(config) {
    super(config)
    this.cache = {}
  }

  get(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        callback(null, xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
  }

  init(templates) {
    var tpl = []

    for(var i = 0; i < templates.length; i++) {
      tpl.push(this.load(templates[i]))
    }

    return this.promise.all(tpl)
  }

  load(selector) {
    var path = this.path + selector + '.mustache.html'
    var get = this.get
    var cache = this.cache

    return new this.promise(function(resolve, reject) {
      get(path, (err, template) => {
        if(err) {
          reject(err)
        } else {
          cache[selector] = template.toString()
          resolve(template)
        }
      })
    })
  }

  retrieve(selector) {
    return this.cache[selector]
  }

  render(selector, data, partial) {
    var template = this.cache[selector]
    this.engine.parse(template)
    var temp = {}

    if(partial !== undefined) {
      for(var i = 0; i < partial.length; i++) {
        temp[partial[i]] = this.cache[partial[i]]
      }
    }

    return this.engine.render(template, data, temp)
  }
}
