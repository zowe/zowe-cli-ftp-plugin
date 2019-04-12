#!/bin/bash
set -e

echo "================z/OS VIEW SUBMIT LOCAL-FILE HELP==============="
bright zos-ftp submit local-file --help

echo "================z/OS FTP SUBMIT LOCAL-FILE HELP WITH RFJ==========="
bright zos-ftp submit local-file --help --rfj
