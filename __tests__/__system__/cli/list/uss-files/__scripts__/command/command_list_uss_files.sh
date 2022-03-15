#!/bin/bash
ussdir=$1
set -e

zowe zos-ftp list uss-files "$ussdir"
