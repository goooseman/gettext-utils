# Trucknet Boilerplate for nodejs project on Typescript

> A sample node project on typescript with tslint (and trucknet tslint config), prettier, lint-staged, commitizen, jest, ts-jest, jest-coverage-badges preinstalled and preconfigured.

## Getting started

1. `git clone` this repository
2. `rm -rf .git`
3. `git init`
4. `git remote add origin`
5. `git flow init`
6. Edit package.json to change name, description and git repository

## Start

`npm run build` to build js, `npm start` to start

## Tests

`npm test` to launch all tests.

Unit tests should be near the file with `.spec.ts` extention.
Integration tests should be in **tests**

## Release

`npm test patch/minor/major` will start a release/ branch (using git flow), edit package.json (and lock) to update the version, commit, finish the release and push including all branches and tags
