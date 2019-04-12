#!/bin/bash
localfile=$1
ussfile=$2
set -e

bright zos-ftp upload file-to-uss-file "$localfile" "$ussfile"
