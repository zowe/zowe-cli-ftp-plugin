#!/bin/bash
set -e

echo "================z/OS FTP RENAME DATA-SET HELP ==============="
zowe zos-ftp rename data-set --help

echo "================z/OS FTP RENAME DATA-SET HELP WITH RFJ==========="
zowe zos-ftp mv ds --help --rfj
