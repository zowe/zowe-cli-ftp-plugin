#!/bin/bash
dsn=$1
destinationfile=$2
set -e

bright zos-ftp download data-set "$dsn" -f "$destinationfile"
