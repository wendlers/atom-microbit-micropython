'use babel';

import path from 'path';
import { BufferedProcess } from 'atom';

export default class pyOCD {

  createHexAndflash(source, target, busySignal) {
    console.log("pyocd-flashtool: createHexAndflash")

    busySignal.begin("pyocd-flashtool", "flashing: " + source);

    var createHexSuccess = true;

    const exit = (code) => {

      if(createHexSuccess) {

        const command = atom.config.get("microbit-micropython.pyocdFlashToolExecutable");
        const exit = (code) => {
            if(code == 0) {
              atom.notifications.addSuccess("pyocd-flashtool", {detail: "successfully flashed!"});
              busySignal.end("pyocd-flashtool", true);
            }
            else {
              atom.notifications.addError("pyocd-flashtool", {detail: "failed to flash!"});
              busySignal.end("pyocd-flashtool", false);
            }
        };

        atom.notifications.addInfo("pyocd-flashtool", {detail: "flashing started ..."});

        var args = ["-hp", "-se", path.join(target, "micropython.hex")];
        var proc = new BufferedProcess({command, args, exit});

        proc.onWillThrowError((err) => {
          err.handle();
          atom.notifications.addError("pyocd-flashtool", {detail: err.error.message});
          busySignal.end("pyocd-flashtool", false);
        });
      }
      else {
        atom.notifications.addError("pyocd-flashtool", {detail: "failed to create hex file!"});
        busySignal.end("pyocd-flashtool", false);
      }
    };

    const command = atom.config.get("microbit-micropython.uflashExecutable");
    const stdout = (data) => {
        if(data.includes("Unable") || data.includes("Err")) {
          createHexSuccess = false;
        }
    };

    var fw = atom.config.get("microbit-micropython.micropythonFirmware");
    var args = [source, target];

    if(fw != "builtin") {
      args = ["-r", fw, source, target];
    }

    var proc = new BufferedProcess({command, args, exit});

    proc.onWillThrowError((err) => {
      err.handle();
      atom.notifications.addError("pyocd-flashtool", {detail: err.error.message});
      busySignal.end("pyocd-flashtool", false);
    });
  }
}
