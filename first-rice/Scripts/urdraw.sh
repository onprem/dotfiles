#!/bin/bash

# Draw a floating URxvt in i3
# Inspired by urdraw script for bspwm by github.com/addy-dclxvi

# Dependencies: 1) slop
# Preferred way of running this is setting a keybinding in i3 config file
# put following line in i3 config
# for_window [instance="floating"] floating enable

# Draw a rectangle using slop then read the geometry value
read -r X Y W H < <(slop -f "%x %y %w %h" -b 4 -t 0 -q)

# Depends on font width & height
(( W /= 9 ))
(( H /= 18 ))

# Create a variable to be used for URxvt flag option
g=${W}x${H}+${X}+${Y}

# Draw with floating rule
urxvt -name floating -g $g &

