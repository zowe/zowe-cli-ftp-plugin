#!/bin/bash
dsn=$1
option=$2
wait=$3
set -e
if [ "$2" == "--wait" ] 
then
bright zos-ftp submit data-set "$dsn" "$option" "$wait"
else 
 bright zos-ftp submit data-set "$dsn" "$option"   
fi