#!/bin/bash
set -e

echo "================z/OS FTP UPLOAD STDIN-TO-USS-FILE HELP ==============="
bright zos-ftp upload stdin-to-uss-file --help

echo "================z/OS FTP UPLOAD STDIN-TO-USS-FILE HELP WITH RFJ==========="
bright zos-ftp ul stuf --help --rfj
