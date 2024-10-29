#!/usr/bin/env node

import { existsSync, writeFile } from "fs-extra";
import { join, resolve } from "path";
import chalk from "chalk";
import { execa } from "execa";

const FILES_TO_CREATE = [
  "index.ts",
  "package.json",
  "tsconfig.json",
  ".eslintrc.json",
  ".prettierrc",
  ".vscode/settings.json",
];

interface ProjectConfig {
  targetDir: string;
  isNewDir: boolean;
}

async function parseArgs(): Promise<ProjectConfig> {
  const args = process.argv.slice(2);

  if (args.length > 1) {
    console.error(chalk.red("Error: Too many arguments"));
    console.log(chalk.yellow("\nUsage:"));
    console.log("  npx tiny-ts-init        # use current directory");
    console.log("  npx tiny-ts-init .      # use current directory");
    console.log("  npx tiny-ts-init my-app # create and use my-app directory");
    process.exit(1);
  }

  const dirArg = args[0] || ".";
  const isNewDir = dirArg !== ".";
  const targetDir = resolve(process.cwd(), dirArg);

  return { targetDir, isNewDir };
}

async function ensureDirectoryExists(config: ProjectConfig): Promise<void> {
  if (config.isNewDir) {
    if (existsSync(config.targetDir)) {
      console.error(
        chalk.red(`Error: Directory ${config.targetDir} already exists`),
      );
      process.exit(1);
    }
    await execa("mkdir", ["-p", config.targetDir]);
  }
}

async function checkExistingFiles(config: ProjectConfig): Promise<void> {
  const existingFiles = FILES_TO_CREATE.filter((file) =>
    existsSync(join(config.targetDir, file)),
  );

  if (existingFiles.length > 0) {
    console.error(chalk.red("Error: The following files already exist:"));
    existingFiles.forEach((file) => console.error(chalk.red(`- ${file}`)));
    process.exit(1);
  }
}

async function createDirectory(
  config: ProjectConfig,
  path: string,
): Promise<void> {
  const dirname = join(config.targetDir, path);
  if (!existsSync(dirname)) {
    await execa("mkdir", ["-p", dirname]);
  }
}

async function main(): Promise<void> {
  const config = await parseArgs();

  console.log(
    chalk.blue(`Initializing TypeScript project in ${config.targetDir}`),
  );

  await ensureDirectoryExists(config);
  await checkExistingFiles(config);

  // Template content for the starter project
  const templates = {
    "index.ts": `// Your TypeScript code goes here
console.log('Hello from TypeScript!');\n
console.log('Created by tiny-ts-init');\n`,

    "package.json": {
      name: config.isNewDir
        ? config.targetDir.split("/").pop()
        : "typescript-project",
      version: "1.0.0",
      type: "module",
      main: "index.ts",
      scripts: {
        start: "node --loader ts-node/esm index.ts",
        lint: "eslint . --ext .ts",
        format: "prettier --write .",
      },
      devDependencies: {
        "@types/node": "^20.11.0",
        "@typescript-eslint/eslint-plugin": "^6.18.1",
        "@typescript-eslint/parser": "^6.18.1",
        eslint: "^8.56.0",
        "eslint-config-prettier": "^9.1.0",
        "eslint-plugin-prettier": "^5.1.3",
        prettier: "^3.1.1",
        "ts-node": "^10.9.2",
        typescript: "^5.3.3",
      },
      engines: {
        node: ">=18.0.0",
      },
      packageManager: "yarn@4.5.1",
    },

    ".yarnrc.yml": `yarnPath: .yarn/releases/yarn-4.5.1.cjs
nodeLinker: node-modules
`,

    "tsconfig.json": {
      $schema: "https://json.schemastore.org/tsconfig",
      compilerOptions: {
        target: "ESNext",
        module: "NodeNext",
        moduleResolution: "NodeNext",
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        outDir: "./dist",
        rootDir: ".",
        isolatedModules: true,
        verbatimModuleSyntax: true,
      },
      include: ["*.ts"],
      exclude: ["node_modules", "dist"],
    },

    ".eslintrc.json": {
      root: true,
      env: {
        node: true,
        es2024: true,
      },
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint", "prettier"],
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "prettier",
      ],
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
      },
      rules: {
        "prettier/prettier": "error",
        "@typescript-eslint/explicit-function-return-type": "error",
        "@typescript-eslint/no-unused-vars": [
          "error",
          { argsIgnorePattern: "^_" },
        ],
        "@typescript-eslint/no-floating-promises": "error",
      },
    },

    ".prettierrc": {
      semi: true,
      trailingComma: "all",
      singleQuote: true,
      printWidth: 100,
      tabWidth: 2,
    },

    ".vscode/settings.json": {
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "editor.formatOnSave": true,
      "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true,
      },
      "eslint.validate": ["typescript"],
      "files.eol": "\n",
    },
  };

  try {
    // Create .vscode directory
    await createDirectory(config, ".vscode");

    // Write all files
    for (const [filename, content] of Object.entries(templates)) {
      const fileContent =
        typeof content === "string"
          ? content
          : JSON.stringify(content, null, 2);
      await writeFile(join(config.targetDir, filename), fileContent);
    }

    console.log(chalk.green("Files created successfully!"));

    // Run yarn install
    console.log(chalk.blue("Installing dependencies..."));

    if (config.isNewDir) {
      // For new directory, we need to cd into it first
      process.chdir(config.targetDir);
    }

    await execa("yarn", ["install"], { stdio: "inherit" });

    console.log(
      chalk.green("\nTypeScript project initialized successfully! 🎉"),
    );
    console.log(chalk.blue("\nAvailable commands:"));
    console.log(chalk.yellow("yarn start    - Run the TypeScript file"));
    console.log(chalk.yellow("yarn lint     - Check for linting issues"));
    console.log(chalk.yellow("yarn format   - Format all files with Prettier"));

    if (config.isNewDir) {
      console.log(chalk.blue("\nTo get started:"));
      console.log(chalk.yellow(`cd ${config.targetDir.split("/").pop()}`));
      console.log(chalk.yellow("yarn start"));
    }
  } catch (error) {
    console.error(chalk.red("Error during setup:"), error);
    process.exit(1);
  }
}

void main().catch((error) => {
  console.error(chalk.red("Unexpected error:"), error);
  process.exit(1);
});
