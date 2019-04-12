#!/bin/bash
dsn=$1
set -e

bright zos-ftp submit data-set "$dsn"