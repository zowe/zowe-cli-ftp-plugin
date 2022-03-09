#!/bin/bash
jobid=$1
set -e

zowe zos-ftp view job-status-by-jobid "$jobid"
