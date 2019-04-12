#!/bin/bash
set -e

echo "================z/OS VIEW DELETE JOB HELP==============="
bright zos-ftp delete job --help

echo "================z/OS FTP DELETE JOB HELP WITH RFJ==========="
bright zos-ftp submit local-file --help --rfj
