#!/bin/bash
dsn=$1
destinationfile=$2
set -e

zowe zos-ftp download data-set "$dsn" -f "$destinationfile" -b
