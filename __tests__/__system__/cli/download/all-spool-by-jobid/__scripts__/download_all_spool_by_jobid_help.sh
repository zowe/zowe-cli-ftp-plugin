#!/bin/bash
set -e

echo "================z/OS DOWNLOAD ALL-SPOOL-BY-JOBID HELP==============="
bright zos-ftp download all-spool-by-jobid --help

echo "================z/OS FTP DOWNLOAD ALL-SPOOL-BY-JOBID HELP WITH RFJ==========="
bright zos-ftp download all-spool-by-jobid --help --rfj
