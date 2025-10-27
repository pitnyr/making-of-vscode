---
title: changes-2025-10
parent: Making-Of
---

# Feature: New Theme, More Flexible Bidirectional Links


## Goals

- [x] [New branch and directory structure](#check-format-of-the-selected-text)
- [x] [New theme `Just the Docs`](#new-theme-just-the-docs)
- [x] [Local test environment](#local-test-environment)
- [x] [Links to the documentation branch](#links-to-the-documentation-branch)
- [x] [More flexible bidirectional links](#more-flexible-bidirectional-links)


<a id="commit-2025-10-26-08-51"></a>

## New Branch and Directory Structure

To be able to work on the source code and the documentation in parallel,
I have previously checked out the documentation branch `gh-pages` with `git clone`
into the `.gh-pages` directory.

That was sub-optimal because changes in the `.gh-pages` Git repository
were not visible in the outer Git repository.
I had to push the changes to a Git remote first and then run a `git fetch` in the outer repository.

Since 2021 I’ve learned a better way: `git worktree`.
It’s designed exactly for having multiple versions of the same repository checked out simultaneously.
Therefore, from now on, I’m including the documentation branch via a Git worktree.

On this occasion, I’m also renaming the branch from `gh-pages` to `notes`.
I could also store and version other notes, scripts, etc. there,
which don’t belong in a source branch or the GitHub Pages branch.

So I run the following commands:
```bash
cd .gh-pages
git branch -m notes
git push origin origin/gh-pages:refs/heads/notes :gh-pages

cd ..
git fetch -p
git worktree add notes notes

rm -rf .gh-pages
```

The `.gitignore` file now has an entry for the `notes` directory instead of the previous `.gh-pages` directory.

I can also delete the VS Code workspace, since the special `notes` directory
is now managed correctly automatically.

And finally, from now on, I want to use this extension here, too, so I add the normal settings:

```json
{
    "making-of.publishUrl": "https://pitnyr.github.io/making-of-vscode/",
    "making-of.sourceUrl": "https://github.com/pitnyr/making-of-vscode/"
}
```

{% include commit id="2025-10-26-08-51" %}
```email
subject: Change branch and directory structure

- Git ignore the new `notes` directory
- Remove unnecessary the VS Code workspace
- Add settings for Making-Of extension
```


<a id="commit-2025-10-26-09-44"></a>

## New Theme "Just the Docs"

I haven’t been entirely happy with the Jekyll theme so far.

In the meantime, I’ve learned that GitHub Pages supports so-called “remote themes” in addition to the standard themes.
Of course, this opens up many more possibilities.

Without searching too long, I decided to start by using the “Just the Docs” theme.
(You can find the link to the theme in the footer of the navigation area.)

I tested this in another project, and I'm quite happy with the results.
I made the necessary settings in the `_config.yml` file
and added so-called "frontmatter" to the pages.

With the new theme, I don't need the `assets` directory anymore.

You can see the details in the following commit on the documentation branch:

{% include commit id="2025-10-26-09-44" %}
```email
subject: Switch to new Jekyll theme
```


<a id="commit-2025-10-26-13-46"></a>

## Local Test Environment

When I tested the new theme in another project,
I realized how nice it is to be able to test the documentation locally.

So I'm doing the same in this project and use `bundler` and a simple `Gemfile`
to be able to locally execute Jekyll.

I’m also adding a `Makefile` so I don’t have to remember the details of the commands…

{% include commit id="2025-10-26-13-46" %}
```email
subject: Add local Jekyll test environment
```

This was the second time I manually edited a link to a commit on the documentation branch,
so I’ll add the next goal that I hadn’t thought of before:


<a id="commit-2025-10-26-21-04"></a>

## Links to the Documentation Branch

Currently, this extension only automates the creation of bidirectional links
between the documentation and commits in a **source** branch.

However, as I've just seen, it can also be useful to automatically create links
between the documentation and commits in the **documentation** branch.

How should I differentiate between these two functions?
I don't want to add a second command to the extension,
so I think I’ll simply check the subject in the commit message for a specific prefix,
e.g., `docs:`.

For a link to the documentation commit I only have to change the working directory
where the `git commit` command is executed.
Other than the subject handling the remaining logic can be left unchanged.

{% include commit id="2025-10-26-21-04" %}
```email
subject: Add support for links to documentation commits
```


<a id="commit-2025-10-27-13-37"></a>

## More Flexible Bidirectional Links

If I want to rename a GitHub repository with making-of documentation or transfer it to another user,
the links from the commit messages to the documentation will have to change.
That can be done, for example, with `git filter-branch`.
In any case, this will change the commit hashes.

This in turn means that the links from the documentation to the commits also need to be updated.
The same may be necessary if the commit history is changed, for example by `git rebase`.

Currently, this would have to be done manually, which would of course be very time-consuming and error-prone.

Fortunately, with ChatGPT, I found a way to automate this as well.

The basic idea is to create a file `_data/commits.yml` in which the commit IDs (timestamps like "2025-10-26-21-04") are mapped to the commit hashes, for example:

```yaml
2025-10-26-08-51: e4300fdd228b9b1b8d6a140ce0dcb4506298bb89
2025-10-26-09-44: dbf53ad41dd4dfcf2006b2e667cf14ce5ac839e6
2025-10-26-13-46: c30b14ec7aa6e5fd4a097d221ab1f462d4674bca
2025-10-26-21-04: 6bcf3e85e5ea25ef92de50defbd370a8ba9aced5
```

Having such a file, the links to the commits can be changed from

```markdown
[commit-2025-10-26-21-04](https://github.com/pitnyr/making-of-vscode/commit/6bcf3e85e5ea25ef92de50defbd370a8ba9aced5)
```

to

```markdown
{% raw %}[commit-2025-10-26-21-04](https://github.com/{{ site.github_user }}/{{ site.github_repo }}/commit/{{ site.data.commits['2025-10-26-21-04'] }}){% endraw %}
```

with two definitions for `github_user` and `github_repo` in file `_config.yml`.
If we add an include file `_includes/commit` with the content

```markdown
{% raw %}[commit-{{ include.id }}](https://github.com/{{ site.github_user }}/{{ site.github_repo }}/commit/{{ site.data.commits[include.id] }}){% endraw %}
```

the link syntax can be shortened to

```markdown
{% raw %}{% include commit id="2025-10-26-21-04" %}{% endraw %}
```
😃

The best part is: if the commit hashes change, only the `_data/commits.yml` file needs to be updated.
And this can even be done automatically!

A possible command is

```bash
git log --branches \
    --grep="See https://.*\.html#commit-" \
    --pretty="%H" | \
while read h; do 
    echo "$(git log -1 --pretty='%b' $h | \
        head -n 1 | \
        sed 's/.*commit-//'): $h"
done | \
sort
```

The question is: should this be integrated into the extension?

On the one hand, I could just add this command to the `Makefile` and be done.

Ont the other hand, for other users of this extension (including my later self),
it would be nice to have commands like:

- init - prepare a repository for making-of
- src commit - add a commit on a source branch
- doc commit - add a commit on the documentation branch
- rehash - recreate `_data/commits.yml`
- verify - compare commit ids in commit messages, doc anchors, doc links, and `_data/commits.yml`

Lazy as I am, I will add the command to the `Makefile` and change the extension to just...

- use the new commit link syntax
- add a line to `_data/commits.yml` for every commit

{% include commit id="2025-10-27-13-37" %}
```email
subject: Support more flexible bidirectional links
```


## Done

That's it for now.
I'll [merge this feature branch into the main branch](main.md#commit-2025-10-27-13-53).
