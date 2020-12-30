#!/bin/bash
dsn=$1
dcb=$2
set -e

bright zos-ftp allocate data-set "$dsn" --dcb "$dcb"
