#!/bin/bash
dsn=$1
set -e

zowe zos-ftp view ds "$dsn" -b