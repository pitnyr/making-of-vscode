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

[commit-2021-11-01-20-15](https://github.com/pitnyr/making-of-vscode/commit/083a3f5115e879991ed200c66f57da15bddf5658)
```email
subject: Add first version of the generated code
```


<a id="commit-2021-11-01-20-30"></a>

## Modify the provided code

Next I'll rename the extension from "vscode-making-of" to just "making-of"
and the command from "vscode-making-of.helloWorld" to "making-of.commit",
and add a "category" to the displayed command name.

Furthermore, the code itself is changed to display a warning instead of an information message.

[commit-2021-11-01-20-30](https://github.com/pitnyr/making-of-vscode/commit/7db71ab808c6fb36d25b9875278e6dc066d97501)
```email
subject: Change command name and implementation
```


<a id="commit-2021-11-01-20-35"></a>

## Optimize the command display

By adding a so-called "menus.commandPalette" it is possible
to show the commit command only in Markdown files.

[commit-2021-11-01-20-35](https://github.com/pitnyr/making-of-vscode/commit/443e0a87fc2e9aa78bb09f64fa9f01e7aac6b14a)
```email
subject: Show command only in markdown files
```


<a id="commit-2021-11-01-20-40"></a>

## Get the name of the current file

Just as an example, I added a configuration (setting): the suffix for the directory with the making-of branch.

When executing the command, the current value of the setting is shown together with the name of the current file.
(The name of the current file is part of the information I want to pass to the shell command.)

[commit-2021-11-01-20-40](https://github.com/pitnyr/making-of-vscode/commit/e5916fa87699d5240d3f9dd2309e39a3dcd756f1)
```email
subject: Add configuration, get file name
```


<a id="commit-2021-11-01-20-45"></a>

## Get the selected text

The last thing I'd like to test in this feature branch is getting the currently selected text.
This all seems pretty easy.
(Though admittedly I don't know how to write more or less good Typescript code...)

[commit-2021-11-01-20-45](https://github.com/pitnyr/making-of-vscode/commit/be56be00fc88da5a9628b479096b6d59d55f975b)
```email
subject: Get selected text
```


## Done

OK, ready to be [merged into the main branch](main.md#commit-2021-11-01-21-00).