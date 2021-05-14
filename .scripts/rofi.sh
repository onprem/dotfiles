#!/bin/bash

# A messy & pathetic script to launch rofi with xrdb colours
# Cheers! addy

getcolors () {
	FOREGROUND=$(xrdb -query | grep 'foreground:'| awk '{print $NF}')
	BACKGROUND=$(xrdb -query | grep 'background:'| awk '{print $NF}')
	BLACK=$(xrdb -query | grep 'color0:'| awk '{print $NF}')
	RED=$(xrdb -query | grep 'color1:'| awk '{print $NF}')
	GREEN=$(xrdb -query | grep 'color2:'| awk '{print $NF}')
	YELLOW=$(xrdb -query | grep 'color3:'| awk '{print $NF}')
	BLUE=$(xrdb -query | grep 'color4:'| awk '{print $NF}')
	MAGENTA=$(xrdb -query | grep 'color5:'| awk '{print $NF}')
	CYAN=$(xrdb -query | grep 'color6:'| awk '{print $NF}')
	WHITE=$(xrdb -query | grep 'color7:'| awk '{print $NF}')
}

# Only use the function above if the cache of paintmybox couldn't be found
if [ -e ~/.cache/paintmyboxcache ]; then
	. ~/.cache/paintmyboxcache
	else
	getcolors
fi

# Launch rofi with custom configuration
rofi -show drun -sidebar-mode \
-modi run,drun,window \
-hide-scrollbar true \
-bw 2 \
-lines 12 \
-padding 24 \
-width 60 \
-location 0 \
-columns 3 \
-font "Noto Sans 12" \
-color-enabled true \
-color-window "$BACKGROUND,$BLACK,$BACKGROUND" \
-color-normal "$BACKGROUND,$FOREGROUND,$BACKGROUND,$BACKGROUND,$BLUE" \
-color-active "$BACKGROUND,$MAGENTA,$BACKGROUND,$BACKGROUND,$BLUE" \
-color-urgent "$BACKGROUND,$YELLOW,$BACKGROUND,$BACKGROUND,$BLUE"

# Theming help
# color window = background, border, separator
# color normal = background, foreground, background-alt, highlight-background, highlight-foreground
# color active = background, foreground, background-alt, highlight-background, highlight-foreground
# color urgent = background, foreground, background-alt, highlight-background, highlight-foreground
