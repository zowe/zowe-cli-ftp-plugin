#!/bin/bash
dsn=$1
set -e

zowe zos-ftp allocate data-set "$dsn" 
