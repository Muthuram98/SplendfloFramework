# Playwright Automation Framework

## Overview

This project contains automated tests written using Playwright for testing web applications. It includes test suites, utilities, and configurations for running automated tests efficiently.

## Features

- Test suites for functional testing of web applications.
- Support for multiple browsers (Chromium, Firefox, WebKit).
- Test reporting and result visualization.
- Continuous Integration (CI) integration with popular CI/CD platforms.

## Prerequisites

Before running the automated tests, ensure that you have the following prerequisites installed and configured:

- Node.js and npm
- Playwright
- Any additional dependencies required for your specific project

## Installation

To install the project dependencies, run the following command:

```bash
npm install --force

## Execution

#create .env file in local and add below details,
WEB_APP_URL=<WEPAPP URL>
AUTOMATION_ADMIN_EMAIL=email
AUTOMATION_OTP=<OTP>
PROJECT=staging/prod

#To run specific test module wise, use below command where "vault" is module name and staging is project/environment where we are running it.
```bash
npm run test -- allTests staging # To execute all test cases on stage
npm run test -- vault staging # To execute module specific test cases on stage
npm run test -- vault prod # To execute module specific test cases on prod
npm run test -- tests/settings/manageUsers.spec.js staging # To execute specific test case file on stage
