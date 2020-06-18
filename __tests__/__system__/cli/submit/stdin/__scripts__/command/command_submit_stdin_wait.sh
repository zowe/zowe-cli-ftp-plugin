#!/bin/bash
localFile=$1
wait=$2
set -e
set -o pipefail

cat "$localFile" | bright zos-ftp submit stdin --wait "$wait"
