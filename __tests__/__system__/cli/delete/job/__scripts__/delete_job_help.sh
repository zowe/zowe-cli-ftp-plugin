#!/bin/bash
set -e

echo "================z/OS VIEW DELETE JOB HELP==============="
zowe zos-ftp delete job --help

echo "================z/OS FTP DELETE JOB HELP WITH RFJ==========="
zowe zos-ftp delete job --help --rfj
