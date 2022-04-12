#!/bin/bash
jobid=$1
set -e

zowe zos-ftp download all-spool-by-jobid "$jobid"