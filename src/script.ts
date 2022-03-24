#!/usr/bin/env node

import inquirer from "inquirer";
import { projectGenerator } from "./index";
import { nameAndFrameWorkQs, gitHubQs, urlQ } from "./utils/questions";

const zshPath: string = process.cwd();

const initFunc = async () => {
  const { projectName, isTypeScript, testingFramework } = await inquirer.prompt(
    nameAndFrameWorkQs
  );

  const { isGithub, hasGitHubCLI } = await inquirer.prompt(gitHubQs);

  const { url } = await inquirer.prompt(urlQ);

  const callBack = (err: Error, success: string) =>
    console.log(err ? `ERROR --> ${err}` : success);

  console.log("ProjectName:", projectName);
  console.log("Path", zshPath);

  return projectGenerator(
    projectName,
    zshPath,
    isTypeScript,
    testingFramework,
    isGithub,
    hasGitHubCLI,
    url,
    callBack
  );
};

module.exports.pgyarn = initFunc();
