#!/bin/bash
localFile=$1
set -e

zowe zos-ftp submit local-file "$localFile"