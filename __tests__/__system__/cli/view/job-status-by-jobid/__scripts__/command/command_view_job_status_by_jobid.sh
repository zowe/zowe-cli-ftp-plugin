#!/bin/bash
jobid=$1
set -e

bright zos-ftp view job-status-by-jobid "$jobid"
