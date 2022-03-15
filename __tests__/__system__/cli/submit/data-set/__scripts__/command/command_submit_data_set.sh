#!/bin/bash
dsn=$1
set -e

zowe zos-ftp submit data-set "$dsn"