"use strict";

class Database extends Module {
  constructor(config) {
    super(config)
    this.db = {}
    this.db.local = new this.pouch(config.local)
    this.db.remote = new this.pouch(config.remote)

    var callback = {
      change: info => console.log("replication change"),
      paused: info => console.log("replication paused"),
      active: () => console.log("replication active"),
      denied: err => console.log("replication denied"),
      complete: info => console.log("replication complete"),
      error: err => console.log("replication error")
    }

    this.db.local.sync(this.db.remote, {
      live: true, retry: true
    })
    .on('change', config.change || callback.change)
    .on('paused', config.paused || callback.paused)
    .on('active', config.active || callback.active)
    .on('denied', config.denied || callback.denied)
    .on('complete', config.complete || callback.complete)
    .on('error', config.error || callback.error)
  }

  init() {
    var p = []
    p.push(this.db.local.info())
    p.push(this.db.remote.info())
    p.push(this.db.remote.replicate.to(this.db.local))
    return Promise.all(p)
  }

  query(allowed, options) {
    return this.db.local.allDocs({include_docs: true}).then((result) => {
      var ret = []
      for (var i = 0; i < result.total_rows; i++) {
        if (result.rows[i] !== undefined && allowed(result.rows[i].doc)) {
          ret.push(result.rows[i].doc)
        }
      }
      return ret
    })
  }

  insert(doc) {
    return this.db.local.put(doc)
  }

  delete(doc) {
    return this.db.local.remove(doc)
  }

  remove(id, rev) {
    return this.db.local.remove(id, rev)
  }
}
