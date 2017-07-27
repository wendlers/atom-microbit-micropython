'use babel';

import path from 'path';
import uflash from './uflash';
import Board from './board';

import { Disposable } from 'atom';
import { CompositeDisposable } from 'atom';

export default {

  subscriptions: null,
  toolBar: null,
  uFlash: null,
  terminal: null,
  terminalView: null,
  board: null,
  consolePanel: null,

  config: {
      uflashExecutable: {
      title: 'flash utility',
      description: 'For flashing the micropython firmware to ' +
                   'the microbit, the `uflash` utility is used. You could use ' +
                   '`sudo pip install uflash` to globally install it for your ' +
                   'system. If the `uflash` executable is in your path, it is ' +
                   'sufficient to specify `uflash` here. Otherwise give the ' +
                   'full path to `uflash`.',
      type: 'string',
      default: 'uflash',
      order: 10
    },
    microbitPath: {
      title: 'microbit drive',
      description: 'By default, the `uflash` utility tries to autodetect the ' +
                   'path to the microbit drive. However, if this is not working ' +
                   'for you, specify the full path to the drive here (e.g. ' +
                   'something like `/media/usb/MICROBIT`).',
      type: 'string',
      default: 'autodetect',
      order: 20
    },
    micropythonFirmware: {
      title: 'mcropython firmware',
      description: 'If you like to use a custom micropython firmware, ' +
                   'provide the full path to the HEX file here. If nothing ' +
                   'is given here, the built-in default from `uflash` is used.',
      type: 'string',
      default: 'builtin',
      order: 30,
    },
    serialTermCommand: {
      title: 'serial terminal command for REPL',
      description: 'Command used to start a serial terminal to display the ' +
                   'microbit REPL. To make use of the serial terminal, a package ' +
                   'which offers the `runInTerminal` service is needed. E.g. ' +
                   '`platformio-ide-terminal` or `termination`.',
      type: 'string',
      default: 'miniterm.py',
      enum: ['miniterm.py', 'microrepl.py', 'screen'],
      order: 40
    },
    serialTermPath: {
      title: 'path to serial terminal command',
      description: 'If the above command is not in your path, give the path to ' +
                   'it here. Else set it to `None`.',
      type: 'string',
      default: 'None',
      order: 50
    },
    serialTermPort: {
      title: 'serial port',
      description: 'The serial port used for connecting to the REPL of the microbit-micropython.',
      type: 'string',
      default: '/dev/ttyACM0',
      order: 60
    },
    serialTermBaudrate: {
      title: 'serial baudrate',
      description: 'The baudrate used for connecting to the REPL of the microbit-micropython. ' +
                   'Note, that only 115200 will work on the offical firmware.',
      type: 'integer',
      default: 115200,
      enum: [300, 1200, 2400, 4800, 9600,  14400, 19200, 28800,
             38400, 57600, 115200, 230400],
      order: 70
    }
  },

  activate(state)
  {
    require('atom-package-deps').install('microbit-micropython', true)
      .then(function() {
        console.log('dependencies installed for microbit-micropython');
      });

    this.uFlash = new uflash();
    this.board = new Board();

    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'microbit-micropython:pack': () => this.pack()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'microbit-micropython:flash': () => this.flash()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'microbit-micropython:enter-repl': () => this.enterRepl()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'microbit-micropython:exit-repl': () => this.exitRepl()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'microbit-micropython:execute-selected': () => this.executeSelected()
    }));
  },

  deactivate()
  {
    this.subscriptions.dispose();
  },

  consumeToolBar(toolbar) {
    this.toolBar = toolbar('microbit-micropython');

    this.toolBar.addButton({
      icon: 'triangle-right',
      callback: 'microbit-micropython:execute-selected',
      tooltip: 'Execute selected text'
    });

    this.toolBar.addButton({
      icon: 'zap',
      callback: 'microbit-micropython:flash',
      tooltip: 'Flash \"micropython.hex\"'
    });

    this.toolBar.addButton({
      icon: 'gift',
      callback: 'microbit-micropython:pack',
      tooltip: 'Pack \"micropython.hex\"'
    });

    this.toolBar.addButton({
      icon: 'browser',
      callback: 'microbit-micropython:enter-repl',
      tooltip: 'Open micropython REPL'
    });

    this.toolBar.addSpacer();

    this.toolBar.addButton({
      icon: 'gear',
      callback: 'application:show-settings',
      tooltip: 'Atom Settings'
    });
  },

  consumeRunInTerminal(terminal)
  {
    this.terminal = terminal;

    return new Disposable(() => {
      this.terminal = null;
    });
  },

  consumeConsolePanel(consolePanel) {
    this.consolePanel = consolePanel;

    this.board.registerOutput((data) => {
        consolePanel.log(data);
      }
    );
  },

  pack()
  {
    var editor = atom.workspace.getActiveTextEditor();

    if(editor && editor.getGrammar().name == "Python") {

      if(editor.isModified()) {
        atom.notifications.addError("Please save file first");
      }
      else {
        var source = editor.getPath();
        var target = source.substr(0, source.length - editor.getTitle().length);

        this.uFlash.pack(source, target);
      }
    }
    else {
      atom.notifications.addError("Pack only works on Python files");
    }
  },

  flash()
  {
    var editor = atom.workspace.getActiveTextEditor();

    if(editor && editor.isModified()) {
      atom.notifications.addError("Please save file first");
    }
    else if(editor && editor.getGrammar().name == "Python") {
      var source = editor.getPath();
      this.uFlash.flash(source);
    }
    else {
      atom.notifications.addError("Flash only works on Python files");
    }
  },

  enterRepl()
  {
    if(this.terminal) {

      this.board.close();
      this.consolePanel.clear();
      this.exitRepl();

      var resDir = path.join(
        atom.packages.resolvePackagePath('microbit-micropython'),
        'resources'
      );

      var term = atom.config.get('microbit-micropython.serialTermCommand');
      var termPath = atom.config.get('microbit-micropython.serialTermPath');

      if(termPath != "None") {
        term = path.join(termPath, term);
      }

      var port = atom.config.get("microbit-micropython.serialTermPort");
      var baudrate = atom.config.get("microbit-micropython.serialTermBaudrate");

      var script = "screen.sh";

      if(term == 'miniterm.py') {
        script = "miniterm.sh";
      }
      else if (term == 'microrepl.py') {
        script = "microrepl.sh";
      }

      var cmd = path.join(resDir, script + ' ' + port + ' ' + baudrate);
      this.terminal.run([cmd]);

      views = this.terminal.getTerminalViews();
      this.terminalView = views[views.length - 1];
    }
  },

  exitRepl()
  {
    if(this.terminalView) {
      this.terminalView.statusBar.activeTerminal = this.terminalView;
      this.terminalView.statusBar.destroyActiveTerm();
    }
  },

  executeSelected() {

    editor = atom.workspace.getActiveTextEditor();

    if(editor && editor.getGrammar().name == "Python") {
      this.exitRepl();
      this.board.execute(editor.getSelectedText());
    }
    else {
      atom.notifications.addError("Execute only works within Python files");
    }
  },
};
