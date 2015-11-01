# git-folder-branches
Allows you to bookmark a bunch of repos, and folders containing several repos, automatically fetch them periodicially and show a summary view of your branches, working copy changes and if your branch is behind/ahead of its upstream.

# Installation

`npm install git-folder-branches -g`

# Usage

_`<directory>` can either be the directory to a repo, or a directory containing several repos._

`gfb <directory>` - show summary of `<directory>`

`gfb` - show summary of bookmarked directories

`gfb -a <directory>` - add `<directory>` to bookmarks

`gfb -l` - list bookmarks

`gfb -d <directory>` - delete `<directory>` from bookmarks

`gfbd` - start the fetch daemon. It `git fetch`es your bookmarks one every 30 seconds. In this release you just have to `kill` the daemon yourself if you want to stop it. No need to restart when you change your bookmarks though.

# Example Output

If in `/some-directory` you had two Git repos `/some-directory/my-repo` and `/some-directory/another-repo`, and you:

* Run `gfb -a /some-directory` then run `gfb`
* Run `gfb /some-directory`
* Run `gfb /some-directory/my-repo /some-directory/another-repo`

... you should see the following output with some nice colour coding:

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
