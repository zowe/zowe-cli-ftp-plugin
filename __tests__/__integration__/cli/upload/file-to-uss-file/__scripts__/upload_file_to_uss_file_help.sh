#!/bin/bash
set -e

echo "================z/OS FTP UPLOAD FILE-TO-USS-FILE HELP ==============="
zowe zos-ftp upload file-to-uss-file --help

echo "================z/OS FTP UPLOAD FILE-TO-USS-FILE HELP WITH RFJ==========="
zowe zos-ftp ul ftuf --help --rfj
