import { existsSync, rmSync } from "fs";
import { join } from "path";
import { execa } from "execa";

describe("tiny-ts-init", () => {
  const testDir = "test-project";
  const testPath = join(process.cwd(), testDir);

  beforeEach(() => {
    // Clean up test directory if it exists
    if (existsSync(testPath)) {
      rmSync(testPath, { recursive: true, force: true });
    }
  });

  afterEach(() => {
    // Clean up after test
    if (existsSync(testPath)) {
      rmSync(testPath, { recursive: true, force: true });
    }
  });

  it("should create a new project with all required files", async () => {
    // Mock process.argv
    const originalArgv = process.argv;
    process.argv = ["node", "src/index.js", testDir];

    try {
      // Import and run the main function
      await import("../index.js");

      // Verify directory was created
      expect(existsSync(testPath)).toBe(true);

      // Verify essential files were created
      const expectedFiles = [
        "package.json",
        "tsconfig.json",
        ".eslintrc.json",
        ".prettierrc",
        ".vscode/settings.json",
        "index.ts",
      ];

      for (const file of expectedFiles) {
        expect(existsSync(join(testPath, file))).toBe(true);
      }

      // Verify package.json content
      const packageJson = require(join(testPath, "package.json"));
      expect(packageJson.scripts).toHaveProperty("start");
      expect(packageJson.scripts).toHaveProperty("lint");
      expect(packageJson.scripts).toHaveProperty("format");
    } finally {
      // Restore original argv
      process.argv = originalArgv;
    }
  });

  it("should fail when target directory already exists", async () => {
    // Create directory first
    await execa("mkdir", ["-p", testPath]);

    // Mock process.argv
    const originalArgv = process.argv;
    process.argv = ["node", "src/index.js", testDir];

    try {
      // Import and run the main function
      await expect(import("../index.js")).rejects.toThrow();
    } finally {
      // Restore original argv
      process.argv = originalArgv;
    }
  });
});
