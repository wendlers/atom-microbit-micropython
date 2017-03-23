'use babel';

import { BufferedProcess } from 'atom';

export default class uFlash {

  uflash(args) {

    console.log("uflash: " + args)

    notify = (data) => {
        if(data.includes("Unable") || data.includes("Err")) {
          atom.notifications.addError("Microbit uFlash", {detail: data});
        }
        else {
          atom.notifications.addSuccess("Microbit uFlash", {detail: data});
        }
    }

    const command = atom.config.get("microbit-micropython.uflashExecutable");
    const stdout = (output) => notify(output);

    new BufferedProcess({command, args, stdout});
  }

  pack(source, target) {

    var fw = atom.config.get("microbit-micropython.micropythonFirmware");

    if(fw != "builtin") {
      this.uflash(["-r", fw, source, target]);
    }
    else {
      this.uflash([source, target]);
    }
  }

  flash(source) {

    var path = atom.config.get("microbit-micropython.microbitPath");
    var fw = atom.config.get("microbit-micropython.micropythonFirmware");
    var args = [source];

    if(fw != "builtin") {
      args = ["-r", fw, source];
    }

    if(path != "autodetect") {
      args = args.concat(path);
    }

    this.uflash(args);
  }
}
