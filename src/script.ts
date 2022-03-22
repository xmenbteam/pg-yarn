#!/usr/bin/env node

import inquirer, { Answers } from "inquirer";
import { projectGenerator } from "./index";
import { questions } from "./utils/questions";

const zshPath: string = process.cwd();
// const zshName: string = process.argv[2];
// const zshUrl: string = process.argv[3];

const answersFunc = async () => {
  const {
    projectName,
    testingFramework,
    isGithub,
    hasGitHubCLIInstalled,
    url,
  } = await inquirer.prompt(questions);

  const callBack = (err: Error, success: string) =>
    console.log(err ? `ERROR --> ${err}` : success);

  console.log("ProjectName:", projectName);
  console.log("Path", zshPath);
  // if (zshUrl) console.log("URL:", zshUrl);

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

module.exports.pgyarn = answersFunc();
