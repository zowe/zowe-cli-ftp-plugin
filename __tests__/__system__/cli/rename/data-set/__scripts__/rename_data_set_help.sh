#!/bin/bash
set -e

echo "================z/OS FTP RENAME DATA-SET HELP ==============="
bright zos-ftp rename data-set --help

echo "================z/OS FTP RENAME DATA-SET HELP WITH RFJ==========="
bright zos-ftp mv ds --help --rfj
