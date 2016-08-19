"use strict";

class Module {
  constructor(config) {
    for(var c in config) {
      this[c] = config[c]
    }
  }
}
