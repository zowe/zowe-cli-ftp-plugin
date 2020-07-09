#!/bin/bash
localFile=$1
option=$2
set -e

bright zos-ftp submit local-file "$localFile" "$option"