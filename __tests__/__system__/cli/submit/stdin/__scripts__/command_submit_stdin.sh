#!/bin/bash
localFile=$1
set -e
set -o pipefail

cat "$localFile" | zowe zos-ftp submit stdin
