#!/bin/bash
ussfile=$1
destinationfile=$2
set -e

zowe zos-ftp download uss-file "$ussfile" -f "$destinationfile" -b
