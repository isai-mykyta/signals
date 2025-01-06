module.exports = {
  preset: "ts-jest",
  rootDir: "src",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  collectCoverageFrom: [
    "**/*.(t|j)s"
  ],
  coverageDirectory: "../coverage",
  testTimeout: 30000,
  globalSetup: "./tests/globalSetup.ts",
  globalTeardown: "./tests/globalTeardown.ts",
  maxWorkers: 1,
  testEnvironment: "node",
  coveragePathIgnorePatterns: [
    "src/configs",
    "src/dtos",
    "src/middlewares",
    "src/models",
    "src/routes",
    "src/types",
    "src/validators",
    "src/app.ts",
    "src/server.ts",
  ]
};