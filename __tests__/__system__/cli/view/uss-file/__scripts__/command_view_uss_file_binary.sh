#!/bin/bash
ussfile=$1
set -e

zowe zos-ftp view uss-file "$ussfile" -b
