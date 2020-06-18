#!/bin/bash
dsn=$1
wait=$2
set -e

bright zos-ftp submit data-set "$dsn" --wait "$wait"