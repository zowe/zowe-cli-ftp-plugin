#!/bin/bash
jobid=$1
set -e

bright zos-ftp delete job $jobid
