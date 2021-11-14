# VS Code Extension for Writing Making-Of Docs


## Goal

Support for writing "Making-Of" docs in VS Code.


## Features

- [ ] Automatically perform commits from within the "Making-Of" docs


## Plan

Here's a possible way to proceed:

For automatically performing commits I could use the "Edit With Shell Command" extension.
I decided to write my own extension instead,
because on one hand this extension offers way too much functionality,
while on the other hand it lacks a way to pass additional infos to the shell command.

I've never written a VS Code extension before,
so I think I'll start with the getting started example
and then add more and more functionality from the "Edit With Shell Command" extension.


## Step 1 - First Commit

<a id="commit-2021-11-01-19-45"></a>

[commit-2021-11-01-19-45](https://github.com/pitnyr/making-of-vscode/commit/376c967dbd660b7754afe229343a0a87c21f397b)
```email
subject: Add first commit: MIT license file
```


## Step 2 - Getting Started

For setting up the getting started example I create a feature branch named "[start](start.md)".

<a id="commit-2021-11-01-21-00"></a>

[commit-2021-11-01-21-00](https://github.com/pitnyr/making-of-vscode/commit/7f341007c49fb5c9bad93be71ad0daf02b73a41d)
```email
subject: Merge branch 'start'

Implement a first version of the VS Code extension.
```


## Step 3 - Edit With Shell Command

In feature branch "[shell](shell.md)" I'll copy the basics I need from the "Edit With Shell Command" extension.

But before that, I move the gh-pages workspace into a ".gitignored" subfolder of the project root
and add a VS Code workspace with the gh-pages folder and the root folder:

<a id="commit-2021-11-14-07-40"></a>

[commit-2021-11-14-07-40](https://github.com/pitnyr/making-of-vscode/commit/717856eda8f70d3fa5caad3e75a02ab415bee977)
```email
subject: Change editing environment
```

Implemented:

<a id="commit-2021-11-14-15-25"></a>

[commit-2021-11-14-15-25](https://github.com/pitnyr/making-of-vscode/commit/0adfe88f4bb40a911d95210fc022818d70e3365e)
```email
subject: Merge branch 'shell'

Edit With Shell Command.
```
