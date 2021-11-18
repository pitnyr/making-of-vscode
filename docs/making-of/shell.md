# Feature: Copy the basics of the "Edit With Shell Command" extension


## Goals

- [x] [Be able to start a shell command from within the extension](#be-able-to-start-a-shell-command-from-within-the-extension)
- [x] [Set the correct working directory](#set-the-correct-working-directory)
- [x] [Get the output into the current editor](#replace-the-currently-selected-text-with-the-output)
- [x] [Pass the currently selected text as input](#replace-the-currently-selected-text-with-the-output)
- [x] [Replace the currently selected text with the output](#replace-the-currently-selected-text-with-the-output)
- [x] [Show Errors somewhere without changing the selected text](#replace-the-currently-selected-text-with-the-output)


<a id="commit-2021-11-14-12-35"></a>

## Be able to start a shell command from within the extension

This should be the biggest part.
If I remember correctly, the code of the extension is very flexible using a lot of small specialized services.
I don't think I'll keep the structure, so let's start... where?
Starting a NodeJS process?

- I have to use the "spawn" method from the "child_process" module
- The command to start would be "/bin/sh", the args "-c" and the command(s) to execute
- The command to execute by the shell would be something like "git commit --quiet --file=- && git rev-parse --verify HEAD"

Let's start with something simple, yet useful: "pwd && whoami".
This can be used to determine the default working directory the command is run.

Fighting Typescript and Javascript, I finally am able to execute "pwd && whoami" and get the result back.

[commit-2021-11-14-12-35](https://github.com/pitnyr/making-of-vscode/commit/04ee906b4e4286883a65222960e949da5e018380)
```email
subject: Execute shell command and capture stdout
```


<a id="commit-2021-11-14-15-00"></a>

## Set the correct working directory

The desired diretory should be the shortest path of the workspace folders,
given that there currently are two: the root and the .gh-pages folder.
Suprisingly (for me): there are no higher order functions like "minBy".

[commit-2021-11-14-15-00](https://github.com/pitnyr/making-of-vscode/commit/689deebf835e43a937e34aac14ecc0d976c33048)
```email
subject: Execute shell command in correct directory
```


<a id="commit-2021-11-14-15-20"></a>

## Replace the currently selected text with the output

Also:
- Get the output into the current editor
- Pass the currently selected text as input
- Show Errors somewhere without changing the selected text

This can be found in the "Edit With Shell Command" extension for sure!

[commit-2021-11-14-15-20](https://github.com/pitnyr/making-of-vscode/commit/f8fa23827d4c43861a225774e6a22d76f1e0704b)
```email
subject: Replace currently selected text with shell output
```


## Done

OK, ready to be [merged into the main branch](main.md#commit-2021-11-14-15-25).