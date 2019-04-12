#!/bin/bash
dsn=$1
set -e

bright zos-ftp delete data-set "$dsn" -f
