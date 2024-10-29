# tiny-ts-init

[![Test](https://github.com/alessandroraffa/tiny-ts-init/actions/workflows/test.yml/badge.svg)](https://github.com/alessandroraffa/tiny-ts-init/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/alessandroraffa/tiny-ts-init/branch/main/graph/badge.svg)](https://codecov.io/gh/alessandroraffa/tiny-ts-init)
[![npm version](https://badge.fury.io/js/tiny-ts-init.svg)](https://badge.fury.io/js/tiny-ts-init)

A minimal TypeScript project initializer that sets up a modern development environment with sensible defaults.

## Using the Package

### Installation

To create a new TypeScript project using this initializer:

```bash
npx tiny-ts-init [project-name]
```

### Usage Options

Create a new project in a new directory:

```bash
npx tiny-ts-init my-project
```

Initialize in the current directory:

```bash
npx tiny-ts-init
# or
npx tiny-ts-init .
```

### What Gets Created

When you run tiny-ts-init, it creates a new TypeScript project with:

- 🚀 Modern TypeScript configuration
- 📝 ESLint with strict rules
- ✨ Prettier code formatting
- 🛠️ VSCode integration
- 📦 Yarn v4 package manager
- 🔄 Node.js ESM support

The generated project includes these commands:

- `yarn start` - Run the TypeScript file
- `yarn lint` - Check for linting issues
- `yarn format` - Format all files with Prettier

## Development

This section is for contributors who want to work on the `tiny-ts-init` package itself.

### Prerequisites

- Node.js >= 20
- Yarn v4.5.1

### Setup

Clone the repository:

```bash
git clone https://github.com/alessandroraffa/tiny-ts-init.git
cd tiny-ts-init
```

Install dependencies:

```bash
yarn install
```

### Available Scripts

- `yarn build` - Build the package
- `yarn lint` - Run ESLint
- `yarn format` - Format code with Prettier
- `yarn test` - Run tests
- `yarn test:watch` - Run tests in watch mode
- `yarn test:coverage` - Run tests with coverage report
- `yarn prepublishOnly` - Build and test before publishing
- `yarn publish` - Publish the package

### Project Structure

```
.
├── src/
│   ├── __tests__/        # Test files
│   └── index.ts          # Main package source
├── .editorconfig         # Editor configuration
├── .eslintrc.cjs        # ESLint configuration
├── .prettierrc.cjs      # Prettier configuration
├── .yarnrc.yml          # Yarn configuration
├── jest.config.ts       # Jest configuration
├── package.json         # Package configuration
└── tsconfig.json        # TypeScript configuration
```

### Development Features

#### TypeScript Configuration

- ESM module system
- Strict type checking
- Modern ECMAScript features

#### Testing

- Jest for unit testing
- Code coverage reporting
- Coverage thresholds enforced (80% minimum)
- Continuous integration via GitHub Actions

#### Linting and Formatting

- ESLint with TypeScript support
- Prettier integration
- Strict code style rules

### Publishing

1. Update version in package.json
2. Run tests and ensure coverage meets thresholds
3. Build and publish:

```bash
yarn publish
```

## License

MIT
