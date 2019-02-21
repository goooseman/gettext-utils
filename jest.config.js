const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig");

module.exports = {
  preset: "ts-jest",
  errorOnDeprecated: true,
  coverageReporters: ["json-summary", "text", "html"],
  testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec).ts?(x)"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  collectCoverageFrom: ["src/**/*.ts"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/" }),
  globals: {
    "ts-jest": { isolatedModules: true },
  },
};
