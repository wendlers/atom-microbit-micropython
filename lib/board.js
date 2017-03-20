'use babel';

import SerialPort from 'serialport';

BoardStates = {
    WAIT: 0,
    RECEIVE: 1,
    EXEC: 2
}

export default class Board {

  constructor() {

    this.stmt = '';
    this.state = BoardStates.WAIT;

    port = atom.config.get("microbit-micropython.serialTermPort");
    baudrate = atom.config.get("microbit-micropython.serialTermBaudrate");

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

  rawReplParser() {

    data = '';

    return (function(emitter, buffer) {

      switch(this.state) {
        case BoardStates.WAIT:

          if(buffer.toString('utf8').endsWith('>')) {
            data = ''

            atom.notifications.addInfo("Script execution started");

            this.serial.write(this.stmt.replace('\n', '\r') + '\r', function() {
              this.drain(function() {
                this.write(eof);
              });
            });

            this.state = BoardStates.RECEIVE;
          }
          break;

        case BoardStates.RECEIVE:

          data += buffer.toString('utf8');

          console.log('data: ' + data);

          if(data.startsWith('OK')) {
              data = data.substr(2);
              this.state = BoardStates.EXEC;
          }
          break;

        default:
          data += buffer.toString('utf8')

          // console.log('data: ' + data);

          if(data.endsWith('>')) {
            atom.notifications.addInfo("Script execution ended");
            data = data.substr(0, data.length - 1);
            this.state = BoardStates.WAIT;
          }

          parts = data.split('\n');
          data = parts.pop();

          parts.forEach(function(part) {
            emitter.emit('data', part);
          });
      }
    }).bind(this);
  }

  close() {
    if(this.serial.isOpen()) {
        ctrl_c_ctrl_b = new Uint8Array([0x0d, 0x03, 0x03, 0x0d, 0x02]);

        this.serial.write(ctrl_c_ctrl_b);
        this.serial.close();
        atom.notifications.addInfo("Conneciton closed");
    }
  }

  registerOutput(f) {
    this.serial.on('data', f);
  }

  execute(stmt) {

    this.stmt = stmt;
    this.state = BoardStates.WAIT;

    ctrl_c = new Uint8Array([0x0d, 0x03, 0x03]);    // stop execution
    ctrl_a = new Uint8Array([0x0d, 0x01]);          // enter raw repl
    eof = new Uint8Array([0x04]);                   // EOF

    if(!this.serial.isOpen()) {

      this.serial.on('open', function() {
          this.write(ctrl_c, function() {
            this.drain(function() {
              this.write(ctrl_a);
            });
          });
      });

      retry = 10;

      openPort = (function() {
        this.serial.open(function(err) {
            if(err) {
              if(retry--) {
                  setTimeout(openPort, 1000);
                  console.log("Connect failed, retry in 1sec");
              }
              else {
                atom.notifications.addError(
                  "Connecting to serial port failed",
                  {detail: err.message });
                }
            }
            else {
              atom.notifications.addSuccess("Connected to serial port");
              this.flush();
            }
          }
        );
      }).bind(this);

      openPort();
    }
    else {
      this.serial.write(ctrl_c, function() {
        this.drain(function() {
          this.write(ctrl_a);
        });
      });
    }
  }
}
