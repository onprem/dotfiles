#!/bin/sh

c0='#00000000' # clear
c1='#101012ff' # black
c2='#ffffffff' # white
c3='#ff0000ff' # red
c4='#0000ffff' # blue

i3lock \
--insidevercolor=$c0	\
--ringvercolor=$c4	\
--insidewrongcolor=$c0	\
--ringwrongcolor=$c3	\
\
--insidecolor=$c0	\
--ringcolor=$c0		\
--separatorcolor=$c0	\
--linecolor=$c0		\
\
--timecolor=$c1		\
--datecolor=$c1		\
--keyhlcolor=$c1	\
--bshlcolor=$c1		\
\
--blur 5                \
--clock                 \
--indicator             \
--radius 180		\
--ring-width 10		\
--timestr="%H:%M"	\
--datestr="%A, %B %d."	\
\
--veriftext=""			\
--wrongtext=""			\
--timesize=80			\
--datesize=20			\


