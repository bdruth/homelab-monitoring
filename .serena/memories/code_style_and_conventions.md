# Code Style and Conventions

## TypeScript Conventions

- **Strong Typing**: Uses TypeScript interfaces for type definitions
- **Module System**: ES modules with import/export syntax
- **Async Patterns**: Uses async/await for asynchronous code
- **Error Handling**: Try-catch blocks with detailed error messages and type checking (e.g., `error instanceof Error`)

## Documentation

- **TSDoc Comments**: Functions are documented with TSDoc comments
- **Parameter Types**: Types are specified in interfaces and function signatures
- **Return Types**: Return types are explicitly defined
- **Test Comments**: Test files include clear comments on test purpose and steps

## Testing Patterns

- **Test Structure**:
  - Define constants (URLs, test names)
  - Navigate to application
  - Verify availability
  - Check component health
  - Handle errors and notifications
- **Logging**: Uses console.log for step completion indicators
- **Error Reporting**: Captures and reports failures via Pushover

## Project Organization

- **Source Organization**: TypeScript files (.ts) in the project root and tests directory
- **Tests Directory**: Contains test files (`*.spec.ts`)
- **TypeScript Config**: Basic tsconfig.json with ES2022 target
- **CI Configuration**: In `.gitea/workflows/`
- **No Overengineering**: Follows YAGNI principles to keep code simple and maintainable. Keep things as simple and straightforward as possible. Do not do extra "nice-to-have" things until they're requested. Do not add any "defensive programming" code and configuration
