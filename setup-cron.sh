#!/bin/bash

CRON_FILE="cron.conf"
SERVICE_FILE="service.sh"
TEMPORARY_CRONTAB="crontab.tmp"
CRON_DIR="/var/spool/cron/crontabs"
USER="root"

for dir in schedules/*; do
	path="$PWD/$dir"
	touch TEMPORARY_CRONTAB
	paste -d' ' <(cat $path/$CRON_FILE) <(echo "$path/$SERVICE_FILE") >> $TEMPORARY_CRONTAB
done

mv -f $TEMPORARY_CRONTAB $CRON_DIR/$USER
