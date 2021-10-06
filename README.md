# A Question and Answer Bot Using Amazon Lex and Amazon Alexa

> Build a chat bot to answer questions.

## Overview

This repository contains code for the QnABot, described in the AWS AI blog post [“Creating a Question and Answer Bot with Amazon Lex and Amazon Alexa”](https://aws.amazon.com/blogs/ai/creating-a-question-and-answer-bot-with-amazon-lex-and-amazon-alexa/).

Refer to "Getting Started" to launch your own QnABot.

**See all the new features list for 4.7.4** [Improved Kendra web crawling support, Client Filtering, Improved support for Lambda hooks](#new-features)

4.7.4

- Support for Kendra's new Web Crawler
- Improved Lambda Hooks support
- "Client Filtering" QnaBot can respond to the same question differently based on client context such as the parent page for Lex Web UI dependent on a session attribute.

4.7.3

- The QnABot fulfillment Lambda function can now be configured for provisioned concurrency to further improve query
    response times after periods of inactivity.
  - Bug fix for proper invocation of ESWarmer lambda
  - Bug fix to resolve sporadic API Compression CloudFormation exception

4.7.1 provides performance improvements and component upgrades

- Amazon Elasticsearch version 7.10 is now utilized.
  - Encrypted Elasticsearch (production) instance types now use m6g.large.elasticsearch for improved price/performance/memory.
  - The QnABot fulfillment Lambda function has been optimized to reduce query response times and variability,
    especially after periods of inactivity.
  - LexV2 built-in Elicit Response bots have been added.
  - Custom settings can now be exported and imported from the Content Designer Settings page.
  - Bug fix when ES_SCORE_ANSWER_FIELD is set to true. Prior to this fix, answer fields were not
    utilized fully in Elasticsearch queries.

4.7.0 QnABot now supports LexV2 with voice interaction in multiple languages.

- Two installation/update modes are now available:
  - (i) LexV1 + LexV2 (default, recommended for most AWS regions.
    - (ii) LexV2-only (currently recommended for AWS regions where LexV1 is not available).
  


## Upgrade Notes

During an upgrade, we recommend that existing QnABot content first be exported and downloaded from the Content Designer prior to
the upgrade. In this release we expect upgrade to be smooth but just in case you should always have your QnABot content preserved.

## Prerequisites

- Run Linux. (tested on Amazon Linux)
- Install npm >7.10.0 and node >12.15.1. ([instructions](https://nodejs.org/en/download/))
- Clone this repo.
- Set up an AWS account. ([instructions](https://AWS.amazon.com/free/?sc_channel=PS&sc_campaign=acquisition_US&sc_publisher=google&sc_medium=cloud_computing_b&sc_content=AWS_account_bmm_control_q32016&sc_detail=%2BAWS%20%2Baccount&sc_category=cloud_computing&sc_segment=102882724242&sc_matchtype=b&sc_country=US&s_kwcid=AL!4422!3!102882724242!b!!g!!%2BAWS%20%2Baccount&ef_id=WS3s1AAAAJur-Oj2:20170825145941:s))
- Configure AWS CLI and a local credentials file. ([instructions](https://docs.AWS.amazon.com/cli/latest/userguide/cli-chap-welcome.html))

## Getting Started

Two approaches can be used to get started. Deploy from pre-created repositories or clone the repo and build a version yourself.

### Pre-created deployment

Sign in to the AWS Management Console and select the button to launch
the `aws-qnabot.template` AWS CloudFormation template.
Alternatively, you can download the template as a starting point for your
own implementation. The template launches in the US East (N. Virginia) Region by default. To launch the solution in a
different AWS Region, use the Region selector in the console navigation bar.

<a target="_blank" href="https://us-east-1.console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=QnABot&templateURL=https://solutions-reference.s3.amazonaws.com/aws-qnabot/latest/aws-qnabot-main.template"><span><img height="24px" src="https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png"/></span></a> 

The solution is supported in the following Regions:

| Region   |
|----------|
| Northern Virginia |
| Oregon |
| Ireland |
| Sydney |
| London |
| Frankfurt |
| Singapore |
| Tokyo |
| Canada Central |

### Clone the git repo and build a version

(Optionally, you can deploy QnABot from a [properly configured Cloud 9 environment](./docs/using_cloud9/README.md))

First, install all prerequisites:

```shell
npm install
```

Next, set up your configuration file:

```shell
npm run config
```

now edit config.json with you information.

| param | description |
|-------|-------------|
|region | the AWS region to launch stacks in |
|profile| the AWS credential profile to use |
|namespace| a logical name space to run your templates in such as dev, test and/or prod |
|devEmail(required) | the email to use when creating admin users in automated stack launches |

Next, use the following command to launch a CloudFormation template to create the S3 bucket to be used for lambda code and CloudFormation templates. Wait for this template to complete (you can watch progress from the command line or [AWS CloudFormation console](https://console.AWS.amazon.com/cloudformation/home))

```shell
npm run bootstrap
```

Finally, use the following command to launch template to deploy the QnA bot in your AWS account. When the stack has completed you will be able to log into the Designer UI (The URL is an output of the template). A temporary password to the email in your config.json:

```shell
npm run up
```

If you have an existing stack you can run the following to update your stack:

```shell
npm run update
```

#### Designer UI Compatibility

Currently the only browsers supported are:

- Chrome
- FireFox
We are currently working on adding Microsoft Edge support.

## Built With

- [Vue](https://vuejs.org/)
- [Webpack](https://webpack.github.io/)

## License

Refer to [LICENSE.md](LICENSE.md) file for details

## New features
Refer to [CHANGELOG.md](CHANGELOG.md) file for details of new features in each version.

A [workshop](https://qnabot.workshop.aws) is available
that will walk you through QnABot features.

## Known Behavior
When deploying the Cloudformation stack rarely, the custom resource creating Amazon OpenSearch Service resources timesout and causes the deployment fail. Deleting the failed deployment and re-deploying the Cloudformation stack fixes this issue.

---

Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Amazon Software License (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

    http://aws.amazon.com/asl/

### Version 4.7.4

- QnABot now uses the official [Kendra Web Crawler](https://docs.aws.amazon.com/kendra/latest/dg/data-source-web-crawler.html) instead of the built in "web indexer".See the updated [documentation](./docs/kendra_crawler_guide/README.md) for more information.
- [Client Filtering](./docs/client_filter/README.md) has been added.  This feature allows QnABot to answer the same set of questions differently based on information known about the client
such as the web page where QnABot is hosted or the type of contact calling in through Connect.
- New setting - ALT_SEARCH_KENDRA_RESPONSE_TYPES - to allow Kendra responses to be filtered based on [Response Types](https://docs.aws.amazon.com/kendra/latest/dg/response-types.html).
- New setting - ALT_SEARCH_KENDRA_ABBREVIATE_MESSAGE_FOR_SSML - Kendra will return an abbreviated response when set to "true" when used with a voice channel such as Amazon Connect, which is the current behavior.  
When set to "false", Kendra will return the entire first response.  This setting is best used along with ALT_SEARCH_KENDRA_RESPONSE_TYPES with a setting of "ANSWER,QUESTION_ANSWER".
- New feature - QnABot now supports the concept of "global Lambda hooks".  This allows you specify a Lambda that is called at the beginning (LAMBDA_PREPROCESS_HOOK) of the processing pipeline before the user profile data is loaded and at the end of the processing pipleline (LAMBDA_POSTPROCESS_HOOK) before the user profile data is saved to DynamoDB.
- New feature - A *beta* [Javascript Lambda Hook SDK](./docs/lambda_hook_sdk.MD) has been created. It will automatically be attached to [JavaScript Lambda Hooks](./templates/examples/extensions/js_lambda_hooks/README.md) added to your QnABot repository. Please see the [Recent Topics Lambda](./templates/examples/extensions/js_lambda_hooks/CreateRecentTopicsResponse/CreateRecentTopicsResponse.js) for an example.

### Version 4.7.3

- The CloudFormation template now allows configuration of provisioned concurrency for the Fulfillment Lambda function.
  The default is 0 but can be changed to a higher integer value. Provisioned concurrency will increase Lambda costs.

### Version 4.7.1

- LexV2 built-in Elicit Response bots have been added.
- Custom settings can now be exported and imported from the Content Designer Settings page.

### Version 4.7.0

- QnABot now supports LexV2 with voice interaction in multiple languages.
  - Two installation/update modes are now available:
    - (i) LexV1 + LexV2 (default, recommended for most AWS regions.
    - (ii) LexV2-only (currently recommended for AWS regions where LexV1 is not available).
  - LexV2 locales are specified via a new CloudFormation parameter
    - The default locales are US English, US Spanish and Canadian French.
- The QnABot web client now uses LexV2 and supports dynamic bot locale selection from a new title bar menu.
- Custom LexV2 Elicit Response bots are now supported. The built-in response bots still use LexV1 and are
  available only when QnABot is installed in LexV1+LexV2 mode.
- CloudFormation deployment is now available for Canada/Montreal region (LexV2-only mode).
- Amazon Connect integration in the Canada/Montreal region supports multiple voice languages using LexV2.
- The Content Designer 'Test All' feature now uses LexV2.
- Content Designer's "Rebuild Lex Bot" feature now rebuilds both LexV2 and LexV1 bots
- Non-English LexV2 bot locales are automatically generated with sample utterances translated from English questions using Amazon Translate.
- Content Designer's Import feature now supports Excel spreadsheets as well as the existing JSON format.
- QnABot's Elasticsearch cache is now automatically kept warm to improve query time consistency.
- Negative feedback (thumbs down) messages can now generate notifications (text, email, etc.) using Amazon SNS.



A [workshop](https://catalog.us-east-1.prod.workshops.aws/v2/workshops/20c56f9e-9c0a-4174-a661-9f40d9f063ac/en-US) is available that will walk you through using QnABot.
