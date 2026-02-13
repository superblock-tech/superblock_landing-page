#!/bin/sh
# Import sbxtoken DB dump on first container start
set -e
echo "Importing sbxtoken_backup.sql into sbxtoken database..."
mysql -u root -p"${MYSQL_ROOT_PASSWORD}" sbxtoken < /init-dump/sbxtoken_backup.sql
echo "Import completed."
