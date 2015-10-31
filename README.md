# git-folder-branches
For each repo inside your current folder, this lists the branches inside each repo.

Also shows if each repo has working copy changes, and if there are upstream changes to be pulled down for each branch.

It only shows a branch named 'master' if it has no upstream changes.

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
Uncommitted changes
* refs/heads/master [behind 60]
refs/heads/some-branch

another-repo
============
Uncommitted changes
refs/heads/master
* refs/heads/some-branch

```
