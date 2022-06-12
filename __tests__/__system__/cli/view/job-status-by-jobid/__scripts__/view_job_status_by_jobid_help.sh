#!/bin/bash
set -e

echo "================z/OS FTP VIEW JOB-STATUS-BY-JOBID HELP==============="
zowe zos-ftp view job-status-by-jobid --help


echo "================z/OS FTP VIEW JOB-STATUS-BY-JOBID HELP WITH RFJ==========="
zowe zos-ftp vw jsbj --help --rfj
