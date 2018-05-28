cd /sys/class/power_supply/BAT*

read C < <(cat $(pwd)/energy_full)

read O < <(cat $(pwd)/energy_full_design)

T=`bc <<< "scale=2;$C*1.0/$O*100.0"`

echo "Your battery can hold $T% of the Original amount."
