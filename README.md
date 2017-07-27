# microbit-micropython package

Atom package to support [micropython](https://microbit-micropython.readthedocs.io/en/latest/)
development on the [mircobit](http://microbit.org/).

The package offers the following features:

* Flash Microbit with Micropython including the current Python file
* Create firmware HEX including Micropyton and current Python file
* Serial terminal to Micropython REPL
* Directely execute selected Python code from editor on Microbit (without flashing)
* Configurable trough settings

![screenshot](https://raw.githubusercontent.com/wendlers/atom-microbit-micropython/master/doc/screen.png)

## Prerequisites

A working Python installation including the `pip` tool.

For combining the Python code with the Micropython firmware into a HEX
file and for flashing the firmware to the Microbit, the
[uflash](https://github.com/ntoll/uflash) utility is used. To install it
via `pip`:

    sudo pip install uflash

For the serial terminal to the REPL, you have the choice between `screen`,
`miniterm.py` and `microrepl.py`. On Linux `screen` would be the best choice
(and it most likely comes with your distro).

__Note__: you only have to install one of the below!

The [microrepl](https://github.com/ntoll/microrepl) could be installed with
`pip`:

    sudo pip install microrepl

`miniterm.py` is part of [pyserial](https://github.com/pyserial/pyserial),
also installable via `pip`:

    sudo pip install pyserial

### Optional

To have nice auto-completion when writing your Python code, I would recommend
installing e.g. [autocomplete-python](https://atom.io/packages/autocomplete-python):

    apm autocomplete-python

And to make Python known about the Microbit specific classes, you might want
install the dummy package:

    sudo pip install microbit-dummy

## Installation

To install this package from the package repository:

    apm install microbit-micropython

Or install from git:

    cd $HOME/$MY_GIT_REPOS
    git clone https://github.com/wendlers/atom-microbit-micropython

Change into the newly cloned directory and link the package into your atom install:

    cd atom-microbit-micropython
    apm link

Next, install required node packages:

    apm install

Now, when you start your atom next time, you will be asked to also install the
atom dependencies.

atom
__Note__: this package will ask to install `termination`, `console-panel` and
`tool-bar` packages as dependencies.

## Usage

* Connect your Microbit to your PC, make sure it is mounted as drive
* Open a Python file containing your Micropython code
* To open an REPL to the Microbit, call `Microbit Micropython: REPL` or
  clicking on the terminal icon on the tool-bar (may take some seconds until
  it is able to connect, be patient)
* To flash your code open the desirec Python file in the editor and call
  `Microbit Micropython: Flash`, or click the flash icon on the tool-bar
* To directly execute Python code (without flashing), select the code in the
  editor windows, right-click it and select `microbit: execute selected` (or
  call `Microbit Micropython: Execute Selected`, or click the tool-bar icon
  with the triangle).

### Known Issues

* Runs only on Linux (maybe on Mac too)
* Sometimes, when switching from REPL to direct script execution, the serial
  line seams to get messed up leading to "double echo" in the REPL and
  timeout errors in direct script execution. In this case a hard-reset (by
  using the button on the board) seams to be the only thing that fixes it.

### Trouble Shooting

* Flash target was not found: auto-detection of `uflash` is not working in all
  cases. Try specifying the path to your Microbit drive in the settings.
* REPL not connecting: Maybe your port is not `/dev/ttyACM0`. Try specifying the
  correct port in the settings.

### Improvements

* Monitor the flashing process:
  - check when HEX file is gone on drive
  - check error file
