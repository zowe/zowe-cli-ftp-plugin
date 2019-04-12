#!/bin/bash
oldDataSet=$1
newDataSet=$2
set -e

bright zos-ftp rename data-set "$oldDataSet" "$newDataSet"