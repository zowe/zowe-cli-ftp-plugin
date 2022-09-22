#!/bin/bash
dsn=$1
dcb=$2
set -e

zowe zos-ftp allocate data-set "$dsn" --dcb "$dcb"
