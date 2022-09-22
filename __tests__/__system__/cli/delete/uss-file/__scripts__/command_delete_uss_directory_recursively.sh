#!/bin/bash
ussdir=$1
set -e

zowe zos-ftp delete uss-file $ussdir -f --recursive
