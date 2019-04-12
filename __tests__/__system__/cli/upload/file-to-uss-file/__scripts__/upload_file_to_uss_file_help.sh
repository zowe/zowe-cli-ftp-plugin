#!/bin/bash
set -e

echo "================z/OS FTP UPLOAD FILE-TO-USS-FILE HELP ==============="
bright zos-ftp upload file-to-uss-file --help

echo "================z/OS FTP UPLOAD FILE-TO-USS-FILE HELP WITH RFJ==========="
bright zos-ftp ul ftuf --help --rfj
