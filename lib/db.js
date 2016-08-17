"use strict";

(function() {
  var unit = function(config) {
    var api = {}
    var db = {}
    db.local = new PouchDB(config.local)
    db.remote = new PouchDB(config.remote)

    db.local.sync(db.remote, {live: true, retry: true})
    .on('change', config.change || change)
    .on('paused', config.paused || paused)
    .on('active', config.active || active)
    .on('denied', config.denied || denied)
    .on('complete', config.complete || complete)
    .on('error', config.error || error)

    function change(info) {
      // handle change
      console.log("replication change")
    }

    function paused(info) {
      // replication paused (e.g. replication up to date, user went offline)
      console.log("replication paused")
    }

    function active() {
      // replicate resumed (e.g. new changes replicating, user went back online)
      console.log("replication active")
    }

    function denied(err) {
      // a document failed to replicate (e.g. due to permissions)
      console.log("replication denied")
    }

    function complete(info) {
      // handle complete
      console.log("replication complete")
    }

    function error(err) {
      // handle error
      console.log("replication error")
    }

    function parse(options) {
      var ret = {}

      if(options === undefined) {
        options = {}
      }

      if(options.start !== undefined) {
        ret.startkey = moment(options.start).toISOString()
      }

      if(options.end !== undefined) {
        ret.endkey = moment(options.end).toISOString()
      }

      if(options.include_docs === undefined) {
        ret.include_docs = true
      }

      return ret
    }

    api.changes = function() {
      return db.local.changes({
        since: 'now',
        live: true,
        include_docs: true
      })
    }

    function query(callback, options) {
      return db.local.allDocs(parse(options)).then(function (result) {
        for (var i = 0; i < result.total_rows; i++) {
          if (result.rows[i] !== undefined) {
            callback(result.rows[i].doc)
          }
        }
      })
    }

    api.message = function(options) {
      var lookup = []

      function callback(doc) {
        var ret = false

        if(doc.type === "message") {
          if(options !== undefined) {
            if(options.characterId !== undefined && options.characterId === doc.from || options.characterId === doc.to) {
              ret = true
            }
            if(options.private !== undefined && options.private === doc.private) {
              ret = true
            }
          } else {
            ret = true
          }

          if(ret) {
            lookup.push(doc)
          }
        }
      }

      return new Promise(function(resolve, reject) {
        query(callback, options).then(function() {
          resolve(lookup)
        })
      })
    }

    api.user = function(options) {
      var lookup = []

      function callback(doc) {
        var ret = false

        if(doc.type === "user") {
          if(options !== undefined && options.userId !== undefined) {
            if(options.userId === doc._id) {
              ret = true
            }
          } else {
            ret = true
          }

          if(ret) {
            lookup.push(doc)
          }
        }
      }

      return new Promise(function(resolve, reject) {
        query(callback, options).then(function() {
          resolve(lookup)
        })
      })
    }

    api.character = function(options) {
      var lookup = []

      function callback(doc) {
        var ret = false

        if(doc.type === "character") {
          if(options !== undefined) {
            if(options.characterId !== undefined && options.characterId === doc._id) {
              ret = true
            }
            if(options.userId !== undefined && options.userId === doc.userId) {
              ret = true
            }
          } else {
            ret = true
          }

          if(ret) {
            lookup.push(doc)
          }
        }
      }

      return new Promise(function(resolve, reject) {
        query(callback, options).then(function() {
          resolve(lookup)
        })
      })
    }

    api.insert = function(doc) {
      return db.local.put(doc)
    }

    api.delete = function(doc) {
      return db.local.remove(doc)
    }

    api.remove = function(id, rev) {
      return db.local.remove(id, rev)
    }

    api.reference = function() {
      return db.local
    }

    api.init = function() {
      var p = []
      p.push(db.local.info())
      p.push(db.remote.info())
      p.push(db.remote.replicate.to(db.local))

      return Promise.all(p)
    }

    return api
  }

  var PouchDB, moment

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    PouchDB = require('pouchdb')
    moment = require('moment')
    module.exports = unit
  } else {
    PouchDB = window.PouchDB
    moment = window.moment
    window.persona = window.persona || {}
    window.persona.db = unit
  }
})();
