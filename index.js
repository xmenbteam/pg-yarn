const { mkdir, writeFile, readFile, rm } = require("fs/promises");
const { execSync } = require("child_process");

const zshName = process.argv[1];
const zshUrl = process.argv[2];
const callBack = (err, success) => console.log(err ? err : success);

const projectGenerator = async (
  projectName,
  url = "www.placeholder.com",
  cb
) => {
  const dir = `${__dirname}/${projectName}`;
  const specDir = `${dir}/spec`;
  const readMeHeader = `# ${projectName}`;
  const helloWorld = 'console.log("hello, world!")';
  const testToDo = 'test.todo("Make some tests");';
  const eslintText = { toDo: "make some lint" };
  const gitignoreText = "node_modules";
  const installCommand = `cd ${dir} && yarn init -y`;
  const gitInit = `cd ${dir} && git init`;
  const installJest = `cd ${dir} && yarn add jest -D`;

  try {
    console.log("Writing Dir...");
    await mkdir(`${dir}`);

    console.log("Writing index.js...");
    await writeFile(`${dir}/index.js`, helloWorld);

    console.log("Initialising project...");
    execSync(installCommand, { stdio: "ignore" });

    console.log(".gitignore...");
    await writeFile(`${dir}/.gitignore`, gitignoreText);

    console.log("specDir/test.js...");
    await mkdir(specDir);
    await writeFile(`${specDir}/index.test.js`, testToDo);

    console.log("Readme...");
    await writeFile(`${dir}/README.md`, readMeHeader);

    console.log("Git init...");
    execSync(gitInit, { stdio: "ignore" });
    await writeFile(
      `${dir}/.eslintrc.json`,
      JSON.stringify(eslintText, null, 2)
    );

    console.log("Installing jest...");
    execSync(installJest, { stdio: "ignore" });

    console.log("Writing test script");
    const packageJSON = await readFile(`${dir}/package.json`);
    const parsedPackage = JSON.parse(packageJSON);
    newPackage = {
      ...parsedPackage,
      repository: url,
      scripts: { test: "jest" },
    };
    await writeFile(`${dir}/package.json`, JSON.stringify(newPackage, null, 2));

    cb(null, "Project built!!");
  } catch (err) {
    cb(err, null);
  }
};

module.exports = projectGenerator;
module.exports.pgyarn = projectGenerator(zshName, zshUrl, callBack);
