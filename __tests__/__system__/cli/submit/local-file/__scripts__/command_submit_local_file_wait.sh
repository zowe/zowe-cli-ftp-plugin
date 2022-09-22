#!/bin/bash
localFile=$1
option=$2
wait=$3
set -e

if [ "$2" == "--wait" ]
then
zowe zos-ftp submit local-file "$localFile" "$option" "$wait"
else
zowe zos-ftp submit local-file "$localFile" "$option"
fi