#!/bin/bash

BLANK='#00000000'  # blank
CLEAR='#ffffff22'  # clear ish

YTISH='#ffffffaa' # white-ish
WHITE='#ffffffff' # white
RED='#d92121ff'
DARK='#142b47ff'
RUST='#6e0b0bff'

i3lock-fancy-rapid \
	5 pixel                   \
	--nofork                  \
	\
	--insidevercolor=$CLEAR   \
	--ringvercolor=$WHITE     \
	\
	--insidewrongcolor=$CLEAR \
	--ringwrongcolor=$RED     \
	\
	--insidecolor=$BLANK      \
	--ringcolor=$YTISH        \
	--linecolor=$BLANK        \
	--separatorcolor=$DARK    \
	\
	--verifcolor=$WHITE       \
	--wrongcolor=$WHITE       \
	--timecolor=$WHITE        \
	--datecolor=$WHITE        \
	--keyhlcolor=$DARK        \
	--bshlcolor=$RUST         \
	\
	--indicator               \
	--radius=25               \
	--indpos="x+85:y+1040"    \
	--force-clock             \
	--timestr="%R"            \
	--timepos="x+1900:iy"     \
	--time-font="Rubik"       \
	--date-font="Rubik"       \
	\
	--veriftext=""            \
	--wrongtext=""            \
	--noinputtext=""          \
        --timesize=48
# --modsize=10
# --timefont=comic-sans
# --datefont=monofur
# etc
