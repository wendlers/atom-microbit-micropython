'use babel';

import SerialPort from 'serialport';

const BoardStates = {
    WAIT_PROMPT: 0,
    WAIT_REBOOT: 1,
    RECEIVE: 2,
    EXEC: 3,
    IGNORE: 4
}

export default class Board {

  constructor() {

    this.stmt = '';
    this.state = BoardStates.IGNORE;
    this.timeout = null;

    var port = atom.config.get("microbit-micropython.serialTermPort");
    var baudrate = atom.config.get("microbit-micropython.serialTermBaudrate");

    this.serial = new SerialPort(port,
      {
        parser: this.rawReplParser(),
        baudrate: baudrate,
        autoOpen: false
      }
    );
  }

  destructor() {
      this.close();
  }

  startTimeout(msec) {
      this.stopTimeout();
      this.timeout = setTimeout(() => {
        atom.notifications.addError('microbit: script execution timeout',
        {detail: 'Unable to get response from Board. Try hard reset!'});
        this.state = BoardStates.IGNORE;
      }, msec);
  }

  stopTimeout() {
    if(this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  rawReplParser() {

    var eof = new Uint8Array([0x04]);                   // EOF
    var data = '';

    return (emitter, buffer) => {

      data += buffer.toString('utf8');

      switch(this.state) {

        case BoardStates.WAIT_PROMPT:

          if(data.endsWith('raw REPL; CTRL-B to exit\r\n>'))
          {
            console.log('=> prompt');

            this.serial.write(eof);

            data = ''
            this.startTimeout(1000);
            this.state = BoardStates.WAIT_REBOOT;
          }
          break;

        case BoardStates.WAIT_REBOOT:

          console.log('data: ' + data);

          if(data.endsWith('raw REPL; CTRL-B to exit\r\n>'))
          {
            console.log('=> reboot');

            atom.notifications.addInfo("microbit: script execution started");

            this.serial.write(this.stmt.replace('\n', '\r') + '\r', () => {
              this.serial.drain(() => {
                this.serial.write(eof);
              });
            });

            data = ''
            this.state = BoardStates.RECEIVE;
          }
          break;

        case BoardStates.RECEIVE:

          console.log('=> receive: ' + data);

          if(data.startsWith('OK')) {
            this.stopTimeout();
            console.log('=> receive done');
            data = data.substr(2);
            this.state = BoardStates.EXEC;
          }
          break;

        case BoardStates.EXEC:

          console.log('=> exec');

          if(data.endsWith('>')) {
            console.log('=> exec done');
            atom.notifications.addInfo("microbit: script execution ended");
            data = data.substr(0, data.length - 1);
            this.state = BoardStates.IGNORE;
          }

          // the parts which are logged need to be passed in line by line
          parts = data.split('\n');
          data = parts.pop();

          parts.forEach((part) => {
            emitter.emit('data', part);
          });
          break;

        default:

          console.log("=> ignore");
          data = '';
      }
    };
  }

  close() {
    if(this.serial.isOpen()) {
        var ctrl_c_ctrl_b = new Uint8Array([0x0d, 0x03, 0x03, 0x0d, 0x02]);

        this.serial.write(ctrl_c_ctrl_b);
        this.serial.close();
        atom.notifications.addInfo("microbit: conneciton closed");
    }
  }

  registerOutput(f) {
    this.serial.on('data', f);
  }

  execute(stmt) {

    this.stmt = stmt;
    this.state = BoardStates.WAIT_PROMPT;

    var ctrl_c = new Uint8Array([0x0d, 0x03, 0x03]);    // stop execution
    var ctrl_a = new Uint8Array([0x0d, 0x01]);          // enter raw repl
    var eof = new Uint8Array([0x04]);                   // EOF

    this.startTimeout(2000);

    if(!this.serial.isOpen()) {

      this.serial.on('open', () => {
          this.serial.write(ctrl_c, () => {
            this.serial.drain(() => {
              this.serial.write(ctrl_a);
            });
          });
      });

      var retry = 10;

      var openPort = () => {
        this.serial.open((err) => {
            if(err) {
              if(retry--) {
                  setTimeout(openPort, 1000);
                  console.log("Connect failed, retry in 1sec");
              }
              else {
                atom.notifications.addError(
                  "microbit: connecting to serial port failed",
                  {detail: err.message });
                }
            }
            else {
              atom.notifications.addSuccess("microbit: connected to serial port");
              this.serial.flush();
            }
          }
        );
      };

      openPort();
    }
    else {
      this.serial.write(ctrl_c, () => {
        this.serial.drain(() => {
          this.serial.write(ctrl_a);
        });
      });
    }
  }
}
