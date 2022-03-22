import { projectGenerator } from "../index";
import fs from "fs";
import util from "util";
const exec = util.promisify(require("child_process").exec);
import { removeProject } from "../utils/utils";

jest.setTimeout(100000);

const projName: string = "my_new_project";
const url: string = "www.my-new-project.com";

//'remove the ".skip" on the describe to run the tests'
describe("project_generator", () => {
  const callBack = jest.fn((err, success) =>
    console.log(err ? `ERROR --> ${err}` : success)
  );

  beforeAll(() => {
    removeProject("my_new_project");
    return projectGenerator(projName, "./", "jest", false, false, "", callBack);
  });
  afterAll(() => removeProject("my_new_project"));

  test("writes a new project with the specified name", async () => {
    const folder = await fs.promises.access(
      "./my_new_project",
      fs.constants.F_OK
    );

    expect(folder).toBe(undefined); // <-- Will be undefined rather than throwing ENOENT error
  });
  test("project has an index.js file", async () => {
    const index = await fs.promises.readFile(
      "./my_new_project/index.js",
      "utf-8"
    );

    expect(index).toBe('console.log("hello, world!")');
  });
  test("project has a .gitignore ignoring node_modules", async () => {
    const gitignore = await fs.promises.readFile(
      "./my_new_project/.gitignore",
      "utf-8"
    );

    expect(gitignore).toBe("node_modules");
  });

  test("has a spec folder", async () => {
    const specFolder = await fs.promises.readdir(
      "./my_new_project/spec",
      "utf-8"
    );
    expect(specFolder).toEqual(["index.test.js"]);
  });
  test("has a index.test.js inside the spec folder", async () => {
    const testFile = await fs.promises.readFile(
      "./my_new_project/spec/index.test.js",
      "utf-8"
    );

    expect(testFile).toBe('test.todo("Make some tests");');
  });
  test("has a README file with a header containing the name of the project", async () => {
    const fileContents = await fs.promises.readFile(
      "./my_new_project/README.md",
      "utf-8"
    );

    expect(fileContents).toBe(`# ${"my_new_project"}`);
  });
  test("project is initialised as a git repository", async () => {
    const folder = await fs.promises.readdir("./my_new_project/.git", "utf-8");

    expect(folder).toEqual([
      "HEAD",
      "config",
      "description",
      "hooks",
      "info",
      "objects",
      "refs",
    ]);
  });
  test("project has a .eslintrc.json config file", async () => {
    const fileContents = await fs.promises.readFile(
      "./my_new_project/.eslintrc.json",
      "utf-8"
    );

    expect(JSON.parse(fileContents)).toEqual({ toDo: "make some lint" });
  });
  describe("Package.json", () => {
    test("project has a package.json file", async () => {
      const packageJSON = await fs.promises.readFile(
        "./my_new_project/package.json",
        "utf-8"
      );
      const parsedPackageJSON = JSON.parse(packageJSON);
      expect(parsedPackageJSON.version).toBe("1.0.0");
    });
    test("package.json has devDependencies", async () => {
      const packageJSON = await fs.promises.readFile(
        "./my_new_project/package.json",
        "utf-8"
      );
      const parsedPackageJSON = JSON.parse(packageJSON);
      expect(parsedPackageJSON).toHaveProperty("devDependencies");
    });
    test("package.json has custom test script", async () => {
      const packageJSON = await fs.promises.readFile(
        "./my_new_project/package.json",
        "utf-8"
      );
      const parsedPackageJSON = JSON.parse(packageJSON);
      expect(
        parsedPackageJSON.scripts.test !==
          'echo "Error: no test specified" && exit 1'
      ).toBe(true);
    });
  });
  test("Success Message - No Remote", () => {
    expect(callBack).toHaveBeenCalledTimes(1);
    expect(callBack).toHaveBeenCalledWith(
      null,
      "Project built, please add a github remote!"
    );
  });
});

describe("When a URL is provided but GH CLI is not installed", () => {
  const callBack = jest.fn((err, success) =>
    console.log(err ? `ERROR --> ${err}` : success)
  );

  beforeAll(() => {
    removeProject("my_new_project");
    return projectGenerator(
      projName,
      "./",
      "jest",
      true,
      false,
      "www.my-new-project.com",
      callBack
    );
  });
  afterAll(() => removeProject("my_new_project"));
  test("When provided with a URL, that URL is the git remote", async () => {
    const { stdout } = await exec(`cd ./my_new_project && git remote -v`, {
      stdio: "ignore",
    });

    const splitMsg = stdout.split(" ");
    const answerArr = [
      "origin\twww.my-new-project.com",
      "(fetch)\norigin\twww.my-new-project.com",
      "(push)\n",
    ];

    expect(callBack).toHaveBeenCalledTimes(1);
    expect(callBack).toHaveBeenCalledWith(null, "Project built!");
    expect(splitMsg).toEqual(answerArr);
  });
  test("Has remote stored in .git folder", async () => {
    const configFile = await fs.promises.readFile(
      "./my_new_project/.git/config",
      "utf-8"
    );

    const remoteOriginSearch = configFile.search(`[remote "origin"]`);
    const urlSearch = configFile.search(url);

    expect(urlSearch).toBeGreaterThan(0);
    expect(remoteOriginSearch).toBeGreaterThan(0);
  });
  test("Success Message - With Remote", () => {
    expect(callBack).toHaveBeenCalledTimes(1);
    expect(callBack).toHaveBeenCalledWith(null, "Project built!");
  });
});

describe.only("GH CLI is installed", () => {
  const callBack = jest.fn((err, success) =>
    console.log(err ? `ERROR --> ${err}` : success)
  );

  beforeAll(() => {
    removeProject("my_new_project");
    return projectGenerator(projName, "./", "jest", true, true, "", callBack);
  });
  afterAll(() => {
    // exec(`gh auth refresh -h github.com -s delete_repo`);
    // exec(`gh repo delete my_new_project --confirm`);
    return removeProject("my_new_project");
  });

  test("Inits on Github", async () => {
    const { stdout } = await exec(`cd ./my_new_project && git remote -v`, {
      stdio: "ignore",
    });

    console.log({ stdout });
  });
});
