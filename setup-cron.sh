#!/bin/bash

CRON_FILE="cron.conf"
SERVICE_FILE="service.sh"
TEMPORARY_CRONTAB="crontab.tmp"

echo "" > $TEMPORARY_CRONTAB

for dir in `ls schedules`; do
	path="$PWD/schedules/$dir"

	if [ -d "$path" ]
	then
    paste -d' ' <(cat "$path/$CRON_FILE") <(echo "$path/$SERVICE_FILE") <(echo ">/dev/null 2>&1") >> $TEMPORARY_CRONTAB
	fi
done

crontab $TEMPORARY_CRONTAB
