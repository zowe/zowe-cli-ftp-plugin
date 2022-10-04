#!/bin/bash
set -e

echo "================z/OS VIEW LIST SPOOL-FILES-BY-JOBID HELP==============="
zowe zos-ftp list spool-files-by-jobid --help

echo "================z/OS FTP LIST SPOOL-FILES-BY-JOBID HELP WITH RFJ==========="
zowe zos-ftp list spool-files-by-jobid --help --rfj
