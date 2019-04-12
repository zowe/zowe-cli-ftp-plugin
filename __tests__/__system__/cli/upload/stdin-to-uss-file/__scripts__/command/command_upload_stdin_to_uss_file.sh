#!/bin/bash
localfile=$1
ussfile=$2
set -e
set -o pipefail

cat "$localfile" | bright zos-ftp upload stdin-to-uss-file  "$ussfile"
