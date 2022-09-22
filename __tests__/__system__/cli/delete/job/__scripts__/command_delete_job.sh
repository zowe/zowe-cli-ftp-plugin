#!/bin/bash
jobid=$1
set -e

zowe zos-ftp delete job $jobid
