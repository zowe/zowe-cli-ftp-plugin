#!/bin/bash
localfile=$1
dataset=$2
set -e

zowe zos-ftp upload file-to-data-set "$localfile" "$dataset"