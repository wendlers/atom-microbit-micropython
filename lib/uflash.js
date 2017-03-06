'use babel';

import { BufferedProcess } from 'atom';

export default class uFlash {

  uflash(args) {

    notify = function(data) {
        if(data.includes("Unable") || data.includes("Err")) {
          atom.notifications.addError(data);
        }
        else {
          atom.notifications.addSuccess(data);
        }
    }

    const command = atom.config.get("microbit-micropython.uflashExecutable");
    const stdout = (output) => notify(output);

    new BufferedProcess({command, args, stdout});
  }

  pack(source, target) {
    this.uflash([source, target]);
  }

  flash(source) {

    path = atom.config.get("microbit-micropython.microbitPath");

    if(path == "autodetect") {
      this.uflash([source]);
    }
    else {
      this.uflash([source, path]);
    }
  }
}
