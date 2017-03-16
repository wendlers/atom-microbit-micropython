#!/bin/bash

port=$1
baudrate=$2

clear

echo "Starting microbit REPL"
echo "--------------------------------------"
echo "term    : screen"
echo "port    : $port"
echo "baudrate: $baudrate"
echo "--------------------------------------"
echo -n "Waiting for serial port: "

sleep 0.5

while ! [ -c $port ];
do
  echo -n "."
  sleep 1
done
echo " OK"

sleep 0.5

screen -q -d -m -S microbit-repl $port $baudrate
screen -q -S microbit-repl -X autodetach off
screen -q -S microbit-repl -r
screen -q -S microbit-repl -X kill
