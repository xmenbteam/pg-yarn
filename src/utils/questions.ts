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
  message: "Please provide a url",
};

export const questions: QuestionCollection<Answers> = [
  projectName,
  testingFramework,
  isGithub,
  hasGitHubCLIInstalled,
  url,
];
