#!/bin/bash

port=$1
baudrate=$2

clear

echo "Starting microbit REPL"
echo "--------------------------------------"
echo "term    : microrepl.py"
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
clear

microrepl.py $port $baudrate
