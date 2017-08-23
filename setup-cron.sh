#!/bin/bash

CRON_FILE="cron.conf"
SERVICE_FILE="service.sh"
TEMPORARY_CRONTAB="crontab.tmp"
CRON_DIR="/var/spool/cron/crontabs"
USER="root"


touch $TEMPORARY_CRONTAB

for dir in `ls schedules`; do
	path="$PWD/schedules/$dir"

	if [ -d  $path ]
	then 
		touch TEMPORARY_CRONTAB
		paste -d' ' <(cat $path/$CRON_FILE) <(echo "$path/$SERVICE_FILE") >> $TEMPORARY_CRONTAB
	fi
done

mv -f $TEMPORARY_CRONTAB $CRON_DIR/$USER
