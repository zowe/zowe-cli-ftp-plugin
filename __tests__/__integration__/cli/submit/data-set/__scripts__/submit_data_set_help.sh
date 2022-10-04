#!/bin/bash
set -e

echo "================z/OS VIEW SUBMIT DATA-SET HELP==============="
zowe zos-ftp submit data-set --help

echo "================z/OS FTP SUBMIT DATA-SET HELP WITH RFJ==========="
zowe zos-ftp submit data-set --help --rfj
