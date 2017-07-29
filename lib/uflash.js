'use babel';

import { BufferedProcess } from 'atom';

export default class uFlash {

  uflash(args) {

    console.log("uflash: " + args)

    var execSuccess = true;

    const command = atom.config.get("microbit-micropython.uflashExecutable");

    const stdout = (data) => {
        if(data.includes("Unable") || data.includes("Err")) {
          execSuccess = false;
        }
    };

    const exit = (code) => {
      if(execSuccess) {
        atom.notifications.addSuccess("uFlash", {detail: "flashing success!"});
      }
      else {
        atom.notifications.addError("uFlash", {detail: "flashing failed!"});
      }
    };

    var proc = new BufferedProcess({command, args, stdout, exit});

    proc.onWillThrowError((err) => {
      err.handle();
      atom.notifications.addError("uflash", {detail: err.error.message});
    });
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
