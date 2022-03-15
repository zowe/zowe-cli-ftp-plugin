#!/bin/bash
oldussfile=$1
newussfile=$2
set -e

zowe zos-ftp rename uss-file "$oldussfile" "$newussfile"