"use strict";

class Transform extends Module {
  inbox(docs) {
    var doc, temp = {}
    var args = {
      users: []
    }

    for(var i = 0; i < docs.length; i++) {
      doc = this.message(docs[i])

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

  message(doc) {
    doc.date = this.moment(doc._id).format("YYYY-MM-DD HH:mm:ss")
    if(doc.from === undefined) {
      doc.from = "someone"
    }
    return doc
  }

  deleted(doc) {
    if(doc._deleted === undefined || doc._deleted !== true) {
      return false
    } else {
      return true
    }
  }
}
