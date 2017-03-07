# microbit-micropython package

Atom package to support [micropython](https://microbit-micropython.readthedocs.io/en/latest/) developmentn on the [mircobit](http://microbit.org/).

The package offers the following features:

* Flash microbit with micropython including the current Python file
* Create firmware HEX including micropyton and current Python file
* Serial terminal to micropython REPL
* Configurable trough settings

![screenshot](https://raw.githubusercontent.com/wendlers/atom-microbit-micropython/master/doc/screen.png)

## Prerequisites

A working Python installation including the `pip` tool.

For combining the Python code with the micropython firmware into a HEX
file and for flashing the firmware to the microbit, the
[uflash](https://github.com/ntoll/uflash) utility is used. To install it
via `pip`:

    sudo pip install uflash

For the serial terminal to the REPL, you have the choice between `screen`,
`miniterm.py` and `microrepl.py`. On Linux `screen` would be the best choice
(and it most likely comes with your distro).

The [microrepl](https://github.com/ntoll/microrepl) could be installed with
`pip`:

    sudo pip install microrepl

`miniterm.py` is part of [pyserial](https://github.com/pyserial/pyserial),
also installable via `pip`:

    sudo pip install pyserial

Further more, a terminal for Atom is needed. Use
[termination](https://atom.io/packages/termination) or
[platformio-ide-terminal](https://atom.io/packages/platformio-ide-terminal). E.g.
to install termination:

    apm install termination

And to get a nice [tool-bar](https://atom.io/packages/tool-bar):

    apm install tool-bar

To have nice auto-completion when writing your Python code, I would recommand
installing e.g. [autocomplete-python](https://atom.io/packages/autocomplete-python):

    apm autocomplete-python

And to make Pyhon known about the microbit specific classes, you might install
the dummy packagage:

    sudo pip install microbit-dummy

## Installation

To install this package from the package repository:

    apm install microbit-micropython

Or install from git:

    cd $HOME/atom/packages
    git clone https://github.com/wendlers/atom-microbit-micropython microbit-micropython

## Usage

TODO
