#!/bin/bash
localFile=$1
option=$2
wait=$3
set -e

if [ "$2" == "--wait" ] 
then
bright zos-ftp submit local-file "$localFile" "$option" "$wait"
else
bright zos-ftp submit local-file "$localFile" "$option"
fi