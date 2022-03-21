import fs from "fs/promises";

export const removeProject = async (projectName: string) => {
  try {
    await fs.rm(`./${projectName}`, { recursive: true });
    console.log("project removed...");
  } catch (err) {
    console.log(err);
  }
};
