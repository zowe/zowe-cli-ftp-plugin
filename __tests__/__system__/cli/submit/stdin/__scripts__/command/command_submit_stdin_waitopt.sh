#!/bin/bash
localFile=$1
option=$2
set -e
set -o pipefail

cat "$localFile" | bright zos-ftp submit stdin "$option"
