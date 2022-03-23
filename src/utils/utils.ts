import fs from "fs/promises";

export const removeProject = async (projectName: string) => {
  try {
    await fs.rm(`./${projectName}`, { recursive: true });
    console.log("project removed...");
  } catch (err) {
    console.log(err);
  }
};

export const testingFolder = (testingFramework: string): string => {
  switch (testingFramework) {
    case "jest":
      return "__tests__";

    case "mocha":
      return "test";

    case "chai":
      return "test";

    default:
      return "test";
  }
};
