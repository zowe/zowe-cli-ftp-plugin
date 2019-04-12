#!/bin/bash
oldussfile=$1
newussfile=$2
set -e

bright zos-ftp rename uss-file "$oldussfile" "$newussfile"