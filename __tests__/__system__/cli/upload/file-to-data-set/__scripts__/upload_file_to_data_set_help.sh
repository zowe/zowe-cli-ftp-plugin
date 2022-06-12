#!/bin/bash
set -e

echo "================z/OS FTP UPLOAD FILE-TO-DATA-SET ==============="
zowe zos-ftp upload file-to-data-set --help

echo "================z/OS FTP UPLOAD FILE-TO-DATA-SET ==========="
zowe zos-ftp ul ftds --help --rfj
