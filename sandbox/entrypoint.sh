#!/bin/bash

# Function to handle SIGTERM
cleanup() {
    echo "Received SIGTERM. Exiting..."
    exit 0
}
trap cleanup SIGTERM


if [ "$1" == "" ] || [ ! -e "$1"/"$1".out ]; then
  printf "\n\nBuild failed.\n"
  exit 0
else
  chmod +x "$1/$1.out"
  timeout -k 1s 10s ./"$1/$1.out"
  printf "\n\nProgram exited with code %d.\n" $?
  exit 0
fi
