const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  moduleNameMapper: {
    '^@octokit/rest$': '<rootDir>/tests/mocks/octokit.js',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transformIgnorePatterns: [
    "node_modules/(?!@octokit|@octokit/rest|@octokit/webhooks|axios)"
  ],
  transform: {
    ...tsJestTransformCfg,
  },
};