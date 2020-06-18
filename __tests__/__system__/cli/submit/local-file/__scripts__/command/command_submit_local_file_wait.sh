#!/bin/bash
localFile=$1
wait=$2
set -e

bright zos-ftp submit local-file "$localFile" --wait "$wait"