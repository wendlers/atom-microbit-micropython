# microbit-micropython package

Atom package to support [micropython](https://microbit-micropython.readthedocs.io/en/latest/)
development on the [mircobit](http://microbit.org/).

The package offers the following features:

* Flash Microbit with Micropython including the current Python file
* Create firmware HEX including Micropyton and current Python file
* Serial terminal to Micropython REPL
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

    cd $HOME/.atom/packages
    git clone https://github.com/wendlers/atom-microbit-micropython microbit-micropython

__Note__: this package will install `termination` and `tool-bar` packages as dependencies.

## Usage

* Connect your Microbit to your PC, make sure it is mounted as drive
* Open a Python file containing your Micropython code
* Open an REPL to the Microbit by calling `Microbit Micropython: REPL` or clicking on the terminal icon on the tool-bar (may take some seconds until it is able to connect, be patient)
* Flash your code by calling `Microbit Micropython: Flash`, or click the flash icon on the tool-bar

### Trouble Shooting

* Flash target was not found: auto-detection of `uflash` is not working in all cases. Try specifying the path to your Microbit drive in the settings.
* REPL not connecting: Maybe your port is not '/dev/ttyACM0'. Try specifying the correct port in the settings.
