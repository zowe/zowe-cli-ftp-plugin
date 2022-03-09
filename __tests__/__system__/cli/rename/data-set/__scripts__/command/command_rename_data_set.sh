#!/bin/bash
oldDataSet=$1
newDataSet=$2
set -e

zowe zos-ftp rename data-set "$oldDataSet" "$newDataSet"