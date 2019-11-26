#!/bin/bash
ussfile=$1
set -e

bright zos-ftp delete uss-file $ussfile -f
