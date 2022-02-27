#!/bin/bash
ussfile=$1
set -e

zowe zos-ftp delete uss-file $ussfile -f
