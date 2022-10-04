#!/bin/bash
ussdir=$1
set -e

zowe zos-ftp make uss-directory  "$ussdir"