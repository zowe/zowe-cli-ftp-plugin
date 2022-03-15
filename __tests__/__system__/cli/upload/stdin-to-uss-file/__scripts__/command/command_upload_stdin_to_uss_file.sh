#!/bin/bash
localfile=$1
ussfile=$2
set -e
set -o pipefail

cat "$localfile" | zowe zos-ftp upload stdin-to-uss-file  "$ussfile"
