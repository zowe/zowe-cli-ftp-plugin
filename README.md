# z/OS FTP Plug-in for Zowe™ CLI

The z/OS FTP Plug-in for Zowe™ CLI lets you access z/OS data sets, USS files, and submit JCL, leveraging the z/OS FTP service. The plug-in lets you perform these z/OS operations through the Zowe CLI client without the use of IBM z/OSMF on the back end (such as situations where z/OSMF is down).

## How the plug-in works

This plug-in uses the [zos-node-accessor package](https://github.com/IBM/zos-node-accessor), intending to be as close as possible to the corresponding commands in core Zowe CLI in terms of syntax and response. However, there may be times where they differ slightly due to technical details of the zos-node-accessor package.

You can use the plug-in to perform various tasks:

* List, view, rename, or download a z/OS data set, partitioned dataset members or USS file.
* Upload a local file or the standard input (stdin) to a z/OS data set or USS file.
* List, view or download a job status and job spool files.
* Delete z/OS data sets, USS files, or jobs.
* Submit a job from a z/OS data set, a local file or the standard input (stdin).
* Create a USS directory.
* Allocate a z/OS data set.

## Software requirements

Before you install the plug-in, meet the following requirements:

* Install Zowe CLI on your PC.

    **Note:** For more information, see [Installing Zowe CLI](https://docs.zowe.org/active-development/user-guide/cli-installcli.html).

* Ensure the z/OS FTP service can be accessed remotely by connecting to z/OS from an FTP client. From the FTP client, run the command `rstat` to verify that the option `JESINTERFACELevel` is set to 2.

## Build the plug-in from source

**Follow these steps:**

1. Download the z/OS FTP plug-in source from the GitHub repository and issue the following command in the local directory:

    ```
    npm install
    ```

    The command installs the required dependencies and several development tools. When necessary, you can run the task at any time to update the tools.

2. To build your code changes, issue the following command:

    ```
    npm run build
    ```

    **Note:** When you update `package.json` to include new dependencies, or when you pull changes that affect `package.json`, issue the `npm update` command to download the dependencies.

3. To install the plug-in, issue the following command:

    ```
    npm run installPlugin
    ```

    The plug-in should now be installed.

## Install the z/OS FTP Plug-in

**Follow these steps:**

1.  Meet the prerequisites.

2.  Install the plug-in:

3.
    ```
    zowe plugins install @zowe/zos-ftp-for-zowe-cli@latest
    ```

    **Note**: The `latest` npm tag installs a version of the product that is intended for public consumption. You can use different npm tags to install other versions of the product. For example, you can install with the `@beta` tag to try new features that have not been fully validated. For more information about tag usage, see [NPM Tag Names](https://github.com/zowe/zowe-cli/blob/master/docs/MaintainerVersioning.md#npm-tag-names).

4.  (Optional) Verify the installation:

    ```
    zowe plugins validate @zowe/zos-ftp-for-zowe-cli
    ```

    When you install the plug-in successfully, the following message displays:

    ```
    _____ Validation results for plugin '@zowe/zos-ftp-for-zowe-cli' _____
    This plugin was successfully validated. Enjoy the plugin.
    ```
    **Note:** When an unsuccessful message displays, you can troubleshoot the installation by addressing the issues that the message describes. For more details, you can review the logs located in the directory where you installed the Zowe CLI.

5.  [Create a user profile](#create-a-user-profile).

## Creating a user profile

After you install the plug-in, create an FTP profile. An FTP profile is recommended to issue commands to via FTP. FTP profiles contain your host, port, user name, and password for connect to z/OS using FTP. You can create multiple profiles and switch between them as needed.

**Follow these steps:**
1.  Install the z/OS FTP Plug-in for Zowe CLI
2.  Create an FTP profile:

    ```
    zowe config init
    ```
3.  If using a non-standard port, set the port number to your FTP connection:

    ```
    zowe config set profiles.zftp.properties.port <port number>
    ```
4. If using a insecure connection, set the secureFtp value to false:

    ```
    zowe config set profiles.zftp.properties.secureFtp false
    ```

## Running tests

You can perform the following types of tests on the z/OS FTP plug-in:

- Unit
- System

**Note:** For detailed information about conventions and best practices for running tests against Zowe CLI plug-ins, see [Zowe CLI Plug-in Testing Guidelines](https://github.com/zowe/zowe-cli/blob/master/docs/PluginTESTINGGuidelines.md).

To define access credentials to the server, copy the file named `.../__tests__/__resources__/properties/example_properties.yaml` and rename it `custom_properties.yaml`. This file contains details on how to specify connection information and credentials.

For the z/OS LPAR where the system test will be run for the first time, issue the following command to prepare the required data set:

```
zowe zos-ftp upload file-to-data-set "$localfile" "$data-set" `
```

    - `$localfile`:

        Specifies an IEFBR14 job located in `__tests__/__resources__/IEFBR14.JCL`

    - `$data-set`:

        Specifies an IEFBR14 data set determined by the iefbr14Member option in `custom_properties.yaml`

**Note:** Information about how to customize the `custom_properties.yaml` file is provided in the yaml file itself.

Issue the following commands to run the tests:

1. `npm run test:unit`
2. `npm run test:system`

Any failures potentially indicate an issue with the set-up of the Rest API or configuration parameters that were passed in the `custom_properties.yaml` file.

## Uninstall the plug-in

**Follow these steps:**
1.  To uninstall the plug-in from a base application, issue the following command:
    ```
    zowe plugins uninstall @zowe/zos-ftp-for-zowe-cli
    ```
After the uninstallation process completes successfully, the Zowe CLI no longer contains the plug-in configuration.

## Contributing

For information about contributing to the plug-in, see the Zowe CLI [Contribution Guidelines](CONTRIBUTING.md). The guidelines contain standards and conventions for developing plug-ins for Zowe CLI. This includes information about running, writing, maintaining automated tests, developing consistent syntax in your plug-in, and ensuring that your plug-in integrates properly with Zowe CLI.

### Tutorials

To learn about building new commands or a new plug-in for Zowe CLI, see [Develop for Zowe CLI](https://docs.zowe.org/stable/extend/extend-cli/cli-devTutorials.html).

### Imperative CLI Framework documentation

[Imperative CLI Framework](https://github.com/zowe/imperative/wiki) documentation is a key source of information to learn about the features of Imperative CLI Framework (the code framework that you use to build plug-ins for Zowe CLI). Refer to the documentation as you develop your plug-in.

### Usage

The following script demonstrates how you can use the FTP plug-in to submit a job and download its contents.

```bash
#!/bin/bash

# Submit the JCL contents from a local file and retrieve the ID of the job
jobid=$(zowe zos-ftp submit local-file IEFBR14.jcl --rff jobid --rft string)
if [ ! "$jobid" ];then
   echo "Failed to submit job."
   exit -1
fi

echo "Submitted our job, JOB ID is $jobid"

# Wait for the job to complete by checking for the status to be OUTPUT
status="UNKNOWN"
while [[ "$status" != "OUTPUT" ]]; do
    echo "Checking status of job $jobid"
    status=$(zowe zos-ftp view job-status-by-jobid "$jobid" --rff status --rft string)
    echo "Current status is $status"
    sleep 5s
done;

echo "Job is in output status. Downloading output..."

# Download the spool files to the `job_output` directory
zowe zos-ftp download all-spool-by-jobid "$jobid" --directory job_output --ojd

```