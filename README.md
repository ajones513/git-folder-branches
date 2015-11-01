# git-folder-branches

Allows you to bookmark a bunch of repos, and folders containing several repos, automatically fetch them periodicially and show a summary view of your branches, working copy changes and if your branch is behind/ahead of its upstream.

It also allows you to open your repos in the great GUI SourceTree ([https://www.sourcetreeapp.com/](https://www.sourcetreeapp.com/)). This could easily be made configurable at some point.

Be aware that in order for quick access it takes over the command `g`.

# Installation

`npm install git-folder-branches -g`

# Usage

_`<directory>` can either be the directory to a repo, or a directory containing several repos._

`g <repo-path>` - open `<repo-path>` in SourceTree

`g` - show summary of bookmarked directories, which gives a numbered output

`g <number>` - open the repo corresponding to `<number>` last time `g` was run in SourceTree

`g -a <directory>` - add `<directory>` to bookmarks

`g -d <directory>` - delete `<directory>` from bookmarks

`gfbd` - start the fetch daemon. It `git fetch`es your bookmarks one every 30 seconds. In this release you just have to `kill` the daemon yourself if you want to stop it. No need to restart when you change your bookmarks though.

# Example Output

If in `/some-directory` you had two Git repos `/some-directory/my-repo` and `/some-directory/another-repo`, then ran:

`g -a /some-directory`

`g`

... you should see the something like the following output with some nice colour coding. Red means out of sync with upstream, green means working copy changes.

```
/some-directory
===============
1) /some-directory/my-repo *master some-branch
2) /some-directory/my-repo master *some-branch
```

It only shows a branch named 'master' if it has no upstream changes.
