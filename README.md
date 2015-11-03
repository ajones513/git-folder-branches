# git-folder-branches

Allows you to:
* 'Bookmark' a repo
* 'Bookmark' folders containing several repos
* Automatically fetch your bookmarked repos periodicially
* Show a summary view of:
  * Your repo's branches
  * Your repo's working copy changes
  * If a branch is behind/ahead of its upstream
* Quickly `git pull` your repos
* Quickly `cd` into your repos
* Quickly open you repos in the great SourceTree GUI ([https://www.sourcetreeapp.com/](https://www.sourcetreeapp.com/))

Be aware that in order for quick access it takes over a few short commands:
* `g`
* `ga`
* `gc` (after `.bash_profile` update)
* `gp`
* `gs`
* `gfbcd`
* `gfbd`

# Installation

`npm install git-folder-branches -g`

Then, put ```function gc() { cd `gfbcd "$@"` ;}``` at the bottom of your `~/.bash_profile` to enable the quick `cd` functionality. Without this `gc` won't work. You'll probably need to restart your shell session for it to take effect.

# Compatability

Tested on OS X. Might just work on Linux. Some tweaks probably needed for Windows.

# Usage

![](https://github.com/ajones513/git-folder-branches/blob/1.5.4/usage.gif)
