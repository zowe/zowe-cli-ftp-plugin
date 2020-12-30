#!/bin/bash
set -e

echo "================z/OS VIEW DELETE DATA-SET HELP==============="
bright zos-ftp allocate data-set --help

echo "================z/OS FTP DELETE DATA-SET HELP WITH RFJ==========="
bright zos-ftp allocate data-set --help --rfj

