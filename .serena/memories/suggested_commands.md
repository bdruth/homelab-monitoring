# Key Commands for Homelab Monitoring Project

## Setup Commands

```bash
# Use the required Node.js version
nvm use

# Install dependencies
yarn install

# Install Playwright browser (Chromium)
yarn playwright install chromium
```

## Development Commands

```bash
# Build TypeScript code
yarn build

# Run tests (automatically builds TypeScript first)
yarn test
```

## Environment Configuration

```bash
# For local development, create .env file with Pushover credentials
echo "PUSHOVER_TOKEN=your_token_here" > .env
echo "PUSHOVER_USER=your_user_key_here" >> .env
```

## CI Integration

Tests automatically run hourly via Gitea CI as configured in `.gitea/workflows/run-tests.yml`

## Utility Commands

```bash
# List files
ls -la

# Find in files (macOS)
grep -r "search_term" .

# View file contents
cat filename

# Git commands
git status
git add .
git commit -m "commit message"
git push
```
