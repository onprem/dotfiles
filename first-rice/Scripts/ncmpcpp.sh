#!/bin/bash

# Get fields from mpc, split by tabs.
IFS=$'\t' read album artist title \
  <<< "$(mpc --format="%album%\t%artist%\t%title%")"

notify-send --urgency=low --expire-time=5000 --app-name=ncmpcpp \
  --icon=audio-x-generic "$album" "$artist\n$title"