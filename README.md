# git-folder-branches
Allows you to bookmark a bunch of repos, or folders containing a bunch of repos, automatically fetch them periodicially and show a summary view of your branches, working copy changes and if your branch is behind/ahead of its upstream.

# Installation

`npm install git-folder-branches -g`

# Usage
`gfb <repo-directory>` - show summary of `<repo-directory>`

`gfb <directory-above-repos>` - show summary of all the repos inside `<directory-above-repos>`

`gfb` - show summary of bookmarked directories

`gfb -a <repo-directory>` - add `<repo-directory>` to bookmarks

`gfb -a <directory-above-repos>` - add `<directory-above-repos>` to bookmarks


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
