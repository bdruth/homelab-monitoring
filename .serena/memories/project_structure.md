# Project Structure

## Main Files and Directories

```
homelab-monitoring/
├── .gitea/                      # CI configuration for Gitea
│   └── workflows/
│       └── run-tests.yml        # CI workflow definition
├── tests/                      # Test files
│   ├── indexer_app.spec.ts         # Prowlarr smoke test (TypeScript)
├── playwright.config.ts        # Playwright configuration (TypeScript)
├── tsconfig.json               # TypeScript configuration
├── package.json                # Node.js project definition
├── .nvmrc                      # Node version specification (v22)
├── .gitignore                  # Git ignore file
└── README.md                   # Project documentation
```

## Key Files

### playwright.config.ts

Configures Playwright with settings for timeouts, retries, screenshots, and video captures.

### tests/indexer_app.spec.ts

Implements smoke tests for Prowlarr application availability and indexer health in TypeScript.

### tsconfig.json

Configures TypeScript compiler options, targeting ES2022 with Node.js typings.

### .gitea/workflows/run-tests.yml

Defines CI pipeline for running tests hourly and on code changes, including TypeScript build step.

### package.json

Defines project dependencies and scripts:

- TypeScript for strong typing
- Playwright for testing
- Node.js v22+ requirement
- Yarn 4.9.2 as package manager
- Build and test commands
