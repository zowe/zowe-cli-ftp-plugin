#!/bin/bash
localfile=$1
dataset=$2
dcb=$3
set -e

bright zos-ftp upload file-to-data-set "$localfile" "$dataset" --dcb "$dcb"