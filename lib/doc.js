"user strict";

class Doc {
  constructor(doc) {
    for(var c in doc) {
      this[c] = doc[c]
    }

    this.user = window.user || "someone"
  }

  deleted() {
    if(this._deleted === undefined || this._deleted !== true) {
      return false
    } else {
      return true
    }
  }
}

class Message extends Doc {
  constructor(doc) {
    super(doc)
    this.date = window.moment(doc._id).format("YYYY-MM-DD HH:mm:ss")
    this.from = doc.from || "someone"
  }
}

class Inbox {
  constructor(docs) {
    var doc, temp = {}
    this.users = []

    for(var i = 0; i < docs.length; i++) {
      doc = new Message(docs[i])
      if(temp[doc.from] === undefined) {
        temp[doc.from] = {
          username: doc.from,
          messages: []
        }
      }
      temp[doc.from].messages.push(doc)
    }

    for(var user in temp) {
      this.users.push(temp[user])
    }
  }
}
