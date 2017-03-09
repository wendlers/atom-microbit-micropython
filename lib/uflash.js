'use babel';

import { BufferedProcess } from 'atom';

export default class uFlash {

  uflash(args) {

    console.log("uflash: " + args)

    notify = function(data) {
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

    fw = atom.config.get("microbit-micropython.micropythonFirmware");

    if(fw != "builtin") {
      this.uflash(["-r", fw, source, target]);
    }
    else {
      this.uflash([source, target]);
    }
  }

  flash(source) {

    path = atom.config.get("microbit-micropython.microbitPath");
    fw = atom.config.get("microbit-micropython.micropythonFirmware");

    if(fw != "builtin") {
      args = ["-r", fw, source];
    }
    else {
      args = [source]
    }

    if(path != "autodetect") {
      args = args.concat(path);
    }

    this.uflash(args);
  }
}
