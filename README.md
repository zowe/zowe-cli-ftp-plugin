# z/OS FTP Plugin for Zowe CLI  

A plugin that attempts to  recreate commands from core Zowe CLI via FTP for z/OS systems without z/OSMF (or where zosmf is down) using the [zos-node-accessor package](https://github.com/IBM/zos-node-accessor).

The intent is that commands added with this plugin are as close as possible to the corresponding commands in core Zowe CLI in terms of syntax and response.

However there may be times where they differ slightly due to technical details of the zos-node-accessor package. 

## Install from source

You must have node.js, npm, and Zowe CLI installed on your machine before installing.

Navigate to the project root and submit the following command:
`npm run installPlugin`
    
The plugin should now be installed. 

## Automated Tests

In order to run automated tests, after you have cloned the repository and issued `npm install` and `npm run build`, 
copy `__tests__/__resources__/properties/default_properties.yaml` to `custom_properties.yaml` in the same directory, modifying it according to the instructions at the top of the file. 

After you have created and populated `custom_properties.yaml`, run `npm run test` to run the automated tests. 

The results will be available at `__tests__/__results__/`.

 
## Example usage

Here is a script showing how you can automate build logic via FTP 

```bash
#! /bin/env bash

#submit our job
jobid=$(zowe zos-ftp submit local-file jcl/build.txt --rff jobid --rft string)

echo "Submitted our job, JOB ID is $jobid"

#wait for it to go to output
status="UNKNOWN"
while [[ "$status" != "OUTPUT" ]]; do
    echo "Checking status of job $jobid"
    status=$(zowe zos-ftp view job-status-by-jobid "$jobid" --rff status --rft string)
    echo "Current status is $status"
    sleep 5s
done;

echo "Job is in output status. Downloading output..."

zowe zos-ftp download all-spool-by-jobid "$jobid" --directory build/job_output --ojd

echo "Eyecatcher of main binary after build :" 
zowe zos-ftp view data-set "myuser.project.loadlib(main)" -b | xxd -E | head  

```
