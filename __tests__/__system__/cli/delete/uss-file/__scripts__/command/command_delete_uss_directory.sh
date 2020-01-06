#!/bin/bash
ussdir=$1
set -e

bright zos-ftp delete uss-file $ussdir -f
