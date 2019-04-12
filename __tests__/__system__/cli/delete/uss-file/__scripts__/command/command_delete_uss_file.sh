#!/bin/bash
ussfile=$1
set -e

bright zos-ftp view uss-file "$ussfile"
