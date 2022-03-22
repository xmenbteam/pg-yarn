# Yarn Project Generator

- Initialises a Yarn repository with jest installed.

## Version 2.0.0

- Now with added Inquirer funtimes.
- _OPTIONAL_ Needs Github CLI tools to run https://github.com/cli/cli:

```bash
brew install gh
```

- Need to authorise `GH CLI`.

- Can also create a repo and add URL.

### < version 2.0.0

- Install:

```
npm install -g pg-yarn
```

- Run:

```bash
npm run pgyarn <project-name> [<github-url>]
```

- URL is optional.
- If URL is supplid and is a valid Github repo, the project will add, commmit, and push an original commit to the repo.
- If URL is not a valid Github repo, the project will be created without a remote.

# To install globally:

- Create update:

```bash

npm pack

```

- Install:

```bash

npm install -g ./pgyarn-<version number>.tgz

```

NB - if installing more than once, `--force` tag is useful. Can change version and install that instead.

- Then, in the folder you want to create your repo in:

```bash

pgyarn <project-name> <valid-empty-github-url>

```
