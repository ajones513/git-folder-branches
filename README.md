# git-folder-branches
For each repo inside your current folder, this lists the branches inside each repo.

Also shows if each repo has working copy changes, and if there are upstream changes to be pulled down for each branch.

Launches a daemon process that performs a `git fetch` on each repo periodically (one repo each minute).

# Installation

`npm install git-folder-branches -g`

# Usage
`gfb`

`gfb ../some-directory`

# Example Output

If in `/some-directory` you had two Git repos `/some-directory/my-repo` and `/some-directory/another-repo`:

```
my-repo
=======
1 uncommitted change
* refs/heads/master [behind 60]
refs/heads/some-branch

another-repo
============
4 uncommitted changes
refs/heads/master
* refs/heads/some-branch

```
