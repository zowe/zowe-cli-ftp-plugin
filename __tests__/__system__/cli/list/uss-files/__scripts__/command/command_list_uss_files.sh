#!/bin/bash
ussdir=$1
set -e

bright zos-ftp list uss-files "$ussdir"
