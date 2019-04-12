#!/bin/bash
localFile=$1
set -e

bright zos-ftp submit local-file "$localFile"