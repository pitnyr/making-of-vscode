---
title: Making-Of
has_toc: false
---

# VS Code Extension for Writing Making-Of Docs


## Goal

Support for writing "Making-Of" docs in VS Code.


## Features

- [x] [Automatically perform commits from within the "Making-Of" docs](#plan)


## Possible enhancements

- [x] [Write a short README and optimize jekyll theme styling](#final-touches)


## Revival

- [x] [2025-10: New theme, more flexible bidirectional links](#new-theme-more-flexible-bidirectional-links)


## Plan

Here's a possible way to proceed:

For automatically performing commits I could use the "Edit With Shell Command" extension.
I decided to write my own extension instead,
because on one hand this extension offers way too much functionality,
while on the other hand it lacks a way to pass additional infos to the shell command.

I've never written a VS Code extension before,
so I think I'll start with the getting started example
and then add more and more functionality from the "Edit With Shell Command" extension.


<a id="commit-2021-11-01-19-45"></a>

## Step 1 - First Commit

{% include commit id="2021-11-01-19-45" %}
```email
subject: Add first commit: MIT license file
```


<a id="commit-2021-11-01-21-00"></a>

## Step 2 - Getting Started

For setting up the getting started example I create a feature branch named "[start](start.md)".

{% include commit id="2021-11-01-21-00" %}
```email
subject: Merge branch 'start'

Implement a first version of the VS Code extension.
```


<a id="commit-2021-11-14-07-40"></a>

## Step 3 - Edit With Shell Command

In feature branch "[shell](shell.md)" I'll copy the basics I need from the "Edit With Shell Command" extension.

But before that, I move the gh-pages workspace into a ".gitignored" subfolder of the project root
and add a VS Code workspace with the gh-pages folder and the root folder:

{% include commit id="2021-11-14-07-40" %}
```email
subject: Change editing environment
```

<a id="commit-2021-11-14-15-25"></a>

Implemented:

{% include commit id="2021-11-14-15-25" %}
```email
subject: Merge branch 'shell'

Edit With Shell Command.
```


<a id="commit-2021-11-15-10-50"></a>

## Step 4 - Execute the real command

This is handled in feature branch "[real-command](real-command.md)".

{% include commit id="2021-11-15-10-50" %}
```email
subject: Merge branch 'real-command'

Execute the real command.
```

The extension should be usable now!


<a id="commit-2021-11-18-12-28"></a>

## Final touches

{% include commit id="2021-11-18-12-28" %}
```email
subject: Final touches

Write a short README and change some extension properties.
```


<a id="commit-2025-10-27-13-53"></a>

## New Theme, More Flexible Bidirectional Links

This is handled in feature branch "[changes-2025-10](changes-2025-10.md)".

{% include commit id="2025-10-27-13-53" %}
```email
subject: Merge branch 'changes-2025-10'

- New branch and directory structure
- New theme "Just the Docs"
- Local test environment
- Links to the documentation branch
- More flexible bidirectional links
```
