"use strict";

class View extends Module {
  constructor(config) {
    super(config)
    this.jQuery(window).on("hashchange", () => {
      this.render(decodeURI(window.location.hash))
    })
  }

  hash(h) {
    if(h !== undefined) {
      window.location.hash = h
    }
    return decodeURI(window.location.hash) || "#"
  }

  render(location) {
    location = this.hash(location)

    switch(location) {
      case "#home": {
        this.home()
        break
      }
      case "#inbox": {
        this.inbox()
        break
      }
    }
  }

  login() {

  }

  home() {
    this.jQuery(".main").html(this.template.render("home", {
      areas: [
        "inbox", "characters", "timeline"
      ]
    }, [
        "navbar"
      ]
    ))
  }

  inbox() {
    //var template = this.template
    //var jQuery = this.jQuery

    this.db.query(
      d => d.type === "message"
    ).then(function(docs) {
      this.jQuery(".main").html(this.template.render("list", new Inbox(docs), [
        "user", "message", "navbar"
      ]))
    }.bind(this))
  }

  character() {

  }
}
