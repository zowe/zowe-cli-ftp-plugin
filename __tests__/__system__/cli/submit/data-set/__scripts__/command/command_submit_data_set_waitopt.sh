#!/bin/bash
dsn=$1
option=$2
set -e

bright zos-ftp submit data-set "$dsn" "$option"