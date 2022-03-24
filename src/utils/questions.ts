import {
  Separator,
  Answers,
  InputQuestion,
  ListQuestion,
  ConfirmQuestion,
  QuestionCollection,
} from "inquirer";

const projectName: InputQuestion = {
  type: "input",
  name: "projectName",
  message: "What do you want your project to be called?!",
  default: "my_new_project",
};

const isTypeScript: ConfirmQuestion = {
  type: "confirm",
  name: "isTypeScript",
  message: "Would you like to set the project up with TypeScript?",
  default: true,
};

const testingFramework: ListQuestion = {
  type: "list",
  name: "testingFramework",
  message: "Which testing library would you like to use?",
  default: "jest",
  choices: ["jest", new Separator(), "mocha", new Separator(), "chai"],
};

const isGithub: ConfirmQuestion = {
  type: "confirm",
  name: "isGithub",
  message: "Would you like to set up a Github Repo?",
  default: true,
};

const hasGitHubCLIInstalled: ConfirmQuestion = {
  type: "confirm",
  name: "hasGitHubCLI",
  message: "Have you got GitHub CLI installed?",
  default: true,
};

const url: InputQuestion = {
  type: "input",
  name: "url",
  message:
    "Please provide a url (leave blank if you want to set this up later)",
};

export const nameAndFrameWorkQs: QuestionCollection<Answers> = [
  projectName,
  isTypeScript,
  testingFramework,
];

export const gitHubQs: QuestionCollection<Answers> = [
  isGithub,
  hasGitHubCLIInstalled,
];

export const urlQ: QuestionCollection<Answers> = [url];
