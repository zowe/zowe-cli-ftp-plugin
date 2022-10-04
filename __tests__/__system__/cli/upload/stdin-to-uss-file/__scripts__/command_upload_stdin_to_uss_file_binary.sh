#!/bin/bash
localfile=$1
ussfile=$2
set -e

cat "$localfile" | zowe zos-ftp upload stdin-to-uss-file  "$ussfile" -b
