#!/usr/bin/env node

const depcheck = require("depcheck");
const glob = require("glob");
const DotJson = require("dot-json");

const options = {};

const currentPackage = require(`${process.cwd()}/package.json`);
const lernaConfig = require(`${process.cwd()}/lerna.json`);

let { dependencies, devDependencies } = currentPackage;
//TODO parse all the packages blobs from lerna

if (!dependencies) {
  dependencies = {};
}

if (!devDependencies) {
  devDependencies = {};
}

glob(
  `${process.cwd()}/${lernaConfig.packages[0]}/package.json`,
  (er, files) => {
    if (er) {
      throw new Error(er);
    }
    files.forEach(file => {
      depcheck(file.replace("/package.json", ""), options, unused => {
        const packageJson = new DotJson(file);

        const built = Object.keys(unused.missing).reduce(
          (builtObject, currentDep) => {
            const foundInDependencies = dependencies[currentDep];
            const foundInDevDependencies = devDependencies[currentDep];
            if (foundInDependencies) {
              builtObject.dependencies[currentDep] = foundInDependencies;
            } else if (foundInDevDependencies) {
              builtObject.devDependencies[currentDep] = foundInDevDependencies;
            } else {
              console.log(
                `Did not find ${currentDep} in the original package.json. Adding with no version specified`
              );
              builtObject.dependencies[currentDep] = "*";
            }
            return builtObject;
          },
          {
            dependencies: packageJson.get("dependencies") || {},
            devDependencies: packageJson.get("devDependencies") || {}
          }
        );

        packageJson
          .set("dependencies", built.dependencies)
          .set("devDependencies", built.devDependencies)
          .save();
      });
    });
  }
);
