/*
* This program and the accompanying materials are made available under the terms of the *
* Eclipse Public License v2.0 which accompanies this distribution, and is available at *
* https://www.eclipse.org/legal/epl-v20.html                                      *
*                                                                                 *
* SPDX-License-Identifier: EPL-2.0                                                *
*                                                                                 *
* Copyright Contributors to the Zowe Project.                                     *
*                                                                                 *
*/

@Library('shared-pipelines') import org.zowe.pipelines.nodejs.NodeJSPipeline

import org.zowe.pipelines.nodejs.models.SemverLevel

/**
 * This is the product name used by the build machine to store information about
 * the builds
 */
def PRODUCT_NAME = "Zowe CLI - ZFTP Plugin"

node('zowe-jenkins-agent') {
    // Initialize the pipeline
    def pipeline = new NodeJSPipeline(this)

    // Build admins, users that can approve the build and receieve emails for
    // all protected branch builds.
    pipeline.admins.add("liangqi", "gejohnston", "zfernand0", "mikebauerca", "markackert", "dkelosky", "awharn", "tjohnsonbcm")

    // Comma-separated list of emails that should receive notifications about these builds
    pipeline.emailList = "liangqi@cn.ibm.com, fernando.rijocedeno@broadcom.com"

    // Protected branch property definitions
    pipeline.protectedBranches.addMap([
        [name: "master", tag: "latest", level: SemverLevel.MINOR, devDependencies: ["@zowe/cli": "zowe-v1-lts"], aliasTags: ["zowe-v1-lts"]]
        //[name: "master", tag: "latest", devDependencies: ["@zowe/cli": "latest"]],
        //[name: "zowe-v1-lts", tag: "zowe-v1-lts", devDependencies: ["@zowe/cli": "zowe-v1-lts"]]
    ])

    // Git configuration information
    pipeline.gitConfig = [
        email: 'zowe.robot@gmail.com',
        credentialsId: 'zowe-robot-github'
    ]

    // npm publish configuration
    pipeline.publishConfig = [
        email: pipeline.gitConfig.email,
        credentialsId: 'zowe.jfrog.io',
        scope: '@zowe'
    ]

    pipeline.registryConfig = [
        [
            email: pipeline.publishConfig.email,
            credentialsId: pipeline.publishConfig.credentialsId,
            url: 'https://zowe.jfrog.io/zowe/api/npm/npm-release/',
            scope: pipeline.publishConfig.scope
        ]
    ]

    // Initialize the pipeline library, should create 5 steps
    pipeline.setup()

    // Create a custom lint stage that runs immediately after the setup.
    pipeline.createStage(
        name: "Lint",
        stage: {
            sh "npm run lint"
        },
        timeout: [
            time: 2,
            unit: 'MINUTES'
        ]
    )

    // Build the application
    pipeline.build(timeout: [
        time: 5,
        unit: 'MINUTES'
    ])

    def TEST_ROOT = "__tests__/__results__"
    def UNIT_TEST_ROOT = "$TEST_ROOT"
    def UNIT_JUNIT_OUTPUT = "$UNIT_TEST_ROOT/junit.xml"

    // Perform a unit test and capture the results
    pipeline.test(
        name: "Unit",
        operation: {
            sh "npm run test:unit"
        },
        testResults: [dir: "${UNIT_TEST_ROOT}/jest-stare", files: "index.html", name: "${PRODUCT_NAME} - Unit Test Report"],
        coverageResults: [dir: "${UNIT_TEST_ROOT}/coverage/lcov-report", files: "index.html", name: "${PRODUCT_NAME} - Unit Test Coverage Report"],
        junitOutput: UNIT_JUNIT_OUTPUT
    )

    // Check for Vulnerabilities
    pipeline.checkVulnerabilities()

    // Check that the changelog has been updated
    pipeline.checkChangelog(
        file: "CHANGELOG.md",
        header: "## Recent Changes"
    )

    // Deploys the application if on a protected branch. Give the version input
    // 30 minutes before an auto timeout approve.
    pipeline.deploy(
        versionArguments: [timeout: [time: 30, unit: 'MINUTES']]
    )

    // Update the changelog when merged
    pipeline.updateChangelog(
        file: "CHANGELOG.md",
        header: "## Recent Changes"
    )

    // Once called, no stages can be added and all added stages will be executed. On completion
    // appropriate emails will be sent out by the shared library.
    pipeline.end()
}
