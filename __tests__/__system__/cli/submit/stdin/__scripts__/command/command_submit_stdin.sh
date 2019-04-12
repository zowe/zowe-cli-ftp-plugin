#!/bin/bash
localFile=$1
set -e
set -o pipefail

cat "$localFile" | bright zos-ftp submit stdin
