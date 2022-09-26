#!/bin/bash
localFile=$1
set -e

cat "$localFile" | zowe zos-ftp submit stdin
