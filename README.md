# z/OS FTP Plug-in for Zowe CLI

The z/OS FTP Plug-in for Zowe CLI lets you access z/OS datasets, USS files, and submit JCL, leveraging the z/OS FTP service. The plug-in lets you perform these z/OS operations through the Zowe CLI client without the use of IBM z/OSMF on the back end (such as situations where z/OSMF is down).

## How the plug-in works

This plug-in uses the [zos-node-accessor package](https://github.com/IBM/zos-node-accessor), intending to be as close as possible to the corresponding commands in core Zowe CLI in terms of syntax and response. However, there may be times where they differ slightly due to technical details of the zos-node-accessor package.

You can use the plug-in to perform various tasks, such as the following:

* List, view, rename, or download z/OS dataset or USS file.
* Upload local file or stdin to z/OS dataset or USS file.
* List, view or download job status, job spool files.
* Delete z/OS dataset, USS file, or job.

## Software Requirements

Before you install the plug-in, meet the following requirements:

* Install Zowe CLI on your PC.

    **Note:** For more information, see [Installing Zowe CLI](https://docs.zowe.org/active-development/user-guide/cli-installcli.html).

* Check to ensure z/OS FTP service can be accessed remotely. Connect z/OS with the FTP client and run command `rstat` in FTP client to check the option JESINTERFACELevel is set to 2.

## Build the Plug-in from Source

**Follow these steps:**

1. The first time that you download the z/OS FTP Plugin from the GitHub repository, issue the following command against the local directory:

    ```
    npm install
    ```

    The command installs the required dependencies and several development tools. When necessary, you can run the task at any time to update the tools.

2. To build your code changes, issue the following command:

    ```
    npm run build
    ```

    The first time you build your code changes, you will be prompted for the location of the Imperative CLI Framework package, which is located in the `node_modules/@zowe` folder in the directory where Zowe CLI was installed.

    **Note:** When you update `package.json` to include new dependencies, or when you pull changes that affect `package.json`, issue the `npm update` command to download the dependencies.

3. To install the plugin, issue the following command:

    ```
    npm run installPlugin
    ```

    The plugin should now be installed.

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
    **Tip:** When an unsuccessful message displays, you can troubleshoot the installation by addressing the issues that the message describes. You can also review the information that is contained in the log file that is located in the directory where you installed Zowe CLI.

5.  [Create a user profile](#create-a-user-profile).

## Create a User Profile

You can create a `zftp` user profile to avoid typing your connection details on every command. A `zftp` profile contains the host, port, username, and password for the z/OS you will connect. You can create multiple profiles and switch between them as needed.

**Follow these steps:**
1.  Create a zftp profile:

    ```
    zowe profiles create zftp <profile name> -H <host> -u <user> -p <password> -P <port> --secure-ftp true
    ```

    The result of the command displays as a success or failure message. You can use your profile when you issue commands in the zftp command group.

**Notice** The option `--secure-ftp true` is strongly recommended if FTPS (FTP over SSL) is enabled in z/OS FTP service. This is not the same as SFTP (FTP over SSH).

**Tip:** For more information about the syntax, actions, and options, for a profiles create command, open Zowe CLI and issue the following command:

```
zowe profiles create zftp -h
```

## Running tests

You can perform the following types of tests on the z/OS FTP Plugin:

- Unit
- System

**Note:** For detailed information about conventions and best practices for running tests against Zowe CLI plug-ins, see [Zowe CLI Plug-in Testing Guidelines](https://github.com/zowe/zowe-cli/blob/master/docs/PluginTESTINGGuidelines.md).

To define access credentials to the server, copy the file named `.../__tests__/__resources__/properties/example_properties.yaml` and create a file named `.../__tests__/__resources__/properties/custom_properties.yaml`.

For the z/OS LPAR where the system test will be ran for the first time, run the following command to prepare the required dataset:

`bright zos-ftp upload file-to-data-set "$localfile" "$dataset" `

where `$localfile` is an IEFBR14 JCL which is in `__tests__/__resources__/IEFBR14.JCL`, and `$dataset` is iefbr14Member which specified in custom_properties.yaml.


**Note:** Information about how to customize the `custom_properties.yaml` file is provided in the yaml file itself.

Issue the following commands to run the tests:

1. `npm run test:unit`
2. `npm run test:system`

Any failures potentially indicate an issue with the set-up of the Rest API or configuration parameters that were passed in the `custom_properties.yaml` file.

## Uninstall the Plug-in

**Follow these steps:**
1.  To uninstall the plug-in from a base application, issue the following command:
    ```
    zowe plugins uninstall @zowe/zos-ftp-for-zowe-cli
    ```
After the uninstallation process completes successfully, the product no longer contains the plug-in configuration.

## Contributing

For information about contributing to the plug-in, see the Zowe CLI [Contribution Guidelines](CONTRIBUTING.md). The guidelines contain standards and conventions for developing plug-ins for Zowe CLI. This includes information about running, writing, maintaining automated tests, developing consistent syntax in your plug-in, and ensuring that your plug-in integrates properly with Zowe CLI.

### Tutorials

To learn about building new commands or a new plug-in for Zowe CLI, see [Develop for Zowe CLI](https://docs.zowe.org/stable/extend/extend-cli/cli-devTutorials.html).

### Imperative CLI Framework documentation

[Imperative CLI Framework](https://github.com/zowe/imperative/wiki) documentation is a key source of information to learn about the features of Imperative CLI Framework (the code framework that you use to build plug-ins for Zowe CLI). Refer to the documentation as you develop your plug-in.

### Example usage

Here is a script showing how you can submit JCL and download spool files via FTP remotely.

```bash
#! /bin/env bash

jobid=$(zowe zos-ftp submit local-file IEFBR14.jcl --rff jobid --rft string)
if [ ! "$jobid" ];then
   echo "Failed to submit job."
   exit -1
fi

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

zowe zos-ftp download all-spool-by-jobid "$jobid" --directory job_output --ojd

```