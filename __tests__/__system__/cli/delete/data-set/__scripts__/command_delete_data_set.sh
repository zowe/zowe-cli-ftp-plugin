#!/bin/bash
dsn=$1
set -e

zowe zos-ftp delete data-set "$dsn" -f
