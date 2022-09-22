#!/bin/bash
dsn=$1
set -e

zowe zos-ftp list data-set-members "$dsn"