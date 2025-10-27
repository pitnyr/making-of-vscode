---
title: start
parent: Making-Of
nav_order: 1
---

# Feature: Setup the "getting started" extension


## Goals

- [X] [Setup a working "getting started" extension](#setup-a-working-getting-started-extension)
- [X] [Modify the provided code](#modify-the-provided-code)
- [X] [Get the name of the current file](#get-the-name-of-the-current-file)
- [X] [Get the selected text](#get-the-selected-text)


<a id="commit-2021-11-01-20-15"></a>

## Setup a working "getting started" extension

The setup is pretty easy, as described here: https://code.visualstudio.com/api/get-started/your-first-extension

- Install Yeoman and VS Code Extension Generator
- Run the generator
- Open the folder in VS Code

That's it.
Now, we can start a new Extension Development Host window
and run the "Hello World" command.

{% include commit id="2021-11-01-20-15" %}
```email
subject: Add first version of the generated code
```


<a id="commit-2021-11-01-20-30"></a>

## Modify the provided code

Next I'll rename the extension from "vscode-making-of" to just "making-of"
and the command from "vscode-making-of.helloWorld" to "making-of.commit",
and add a "category" to the displayed command name.

Furthermore, the code itself is changed to display a warning instead of an information message.

{% include commit id="2021-11-01-20-30" %}
```email
subject: Change command name and implementation
```


<a id="commit-2021-11-01-20-35"></a>

## Optimize the command display

By adding a so-called "menus.commandPalette" it is possible
to show the commit command only in Markdown files.

{% include commit id="2021-11-01-20-35" %}
```email
subject: Show command only in markdown files
```


<a id="commit-2021-11-01-20-40"></a>

## Get the name of the current file

Just as an example, I added a configuration (setting): the suffix for the directory with the making-of branch.

When executing the command, the current value of the setting is shown together with the name of the current file.
(The name of the current file is part of the information I want to pass to the shell command.)

{% include commit id="2021-11-01-20-40" %}
```email
subject: Add configuration, get file name
```


<a id="commit-2021-11-01-20-45"></a>

## Get the selected text

The last thing I'd like to test in this feature branch is getting the currently selected text.
This all seems pretty easy.
(Though admittedly I don't know how to write more or less good Typescript code...)

{% include commit id="2021-11-01-20-45" %}
```email
subject: Get selected text
```


## Done

OK, ready to be [merged into the main branch](main.md#commit-2021-11-01-21-00).