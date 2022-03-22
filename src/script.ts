#!/usr/bin/env node

import inquirer, { Answers } from "inquirer";
import { projectGenerator } from "./index";
import { nameAndFrameWorkQs, gitHubQs, urlQ } from "./utils/questions";

const zshPath: string = process.cwd();

const initFunc = async () => {
  const { projectName, testingFramework } = await inquirer.prompt(
    nameAndFrameWorkQs
  );

  const { isGithub, hasGitHubCLIInstalled } = await inquirer.prompt(gitHubQs);

  const { url } = await inquirer.prompt(urlQ);

  console.log({ url, isGithub });
  console.log("HELLOOOOO");

  const callBack = (err: Error, success: string) =>
    console.log(err ? `ERROR --> ${err}` : success);

  console.log("ProjectName:", projectName);
  console.log("Path", zshPath);

  return projectGenerator(
    projectName,
    zshPath,
    testingFramework,
    isGithub,
    hasGitHubCLIInstalled,
    url,
    callBack
  );
};

module.exports.pgyarn = initFunc();
