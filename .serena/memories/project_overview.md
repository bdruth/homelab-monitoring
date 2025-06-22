# Homelab Monitoring Project

## Purpose

Automated TypeScript and Playwright-based monitoring for homelab applications. This project runs smoke tests to verify that applications in a homelab environment are functioning correctly and sends notifications on failure.

## Current Capabilities

- **Indexer App Monitoring**: Verifies application availability and indexer health.
- **Dashboard App Monitoring**: Verifies that a dashboard application is accessible and not displaying "No Data" errors. This test handles authentication via an authentication proxy.
- **Notification System**: Uses Pushover to send alerts on test failures.
- **Scheduled Execution**: Tests run hourly through Gitea CI.

## Tech Stack

- TypeScript for type-safe code
- Node.js v22+
- Yarn 4.9.2 as package manager
- Playwright for browser automation
- 1Password CLI for local credential management
- 1Password GitHub Action for CI credential management
- Pushover API for notifications
- Gitea CI for continuous integration

## Core Features

- Smoke tests for application availability
- Component health checks
- Authenticated testing for applications behind a proxy
- Failure notifications via Pushover
- Scheduled monitoring via CI

This project follows a minimalist approach, focusing on essential functionality without unnecessary complexity (YAGNI principles).