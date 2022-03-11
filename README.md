# Yarn Project Generator

- Initialises a Yarn repository with jest installed.

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

npm install -g pgyarn-1.0.2.tgz

```

NB - if installing more than once, `--force` tag is useful. Probably a better way but meh.

- Then, in the folder you want to create your repo in:

```bash

pgyarn <project-name> <valid-empty-github-url>

```
