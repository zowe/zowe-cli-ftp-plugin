#!/bin/bash
set -e

echo "================z/OS VIEW DOWNLOAD DATA-SET HELP==============="
zowe zos-ftp download data-set --help

echo "================z/OS FTP DOWNLOAD DATA-SET HELP WITH RFJ==========="
zowe zos-ftp download data-set --help --rfj
