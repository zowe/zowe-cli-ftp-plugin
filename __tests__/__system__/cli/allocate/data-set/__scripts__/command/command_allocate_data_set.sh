#!/bin/bash
dsn=$1
set -e

bright zos-ftp allocate data-set "$dsn" 
