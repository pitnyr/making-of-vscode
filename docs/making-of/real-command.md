# Feature: Execute the real commit command


## Goals

- [x] [Check format of the selected text](#check-format-of-the-selected-text)
- [x] [Get commit id from current time](#execute-commit)
- [x] [Execute commit](#execute-commit)
- [x] [Replace selection with final text](#replace-selection-with-final-text)


<a id="commit-2021-11-15-05-35"></a>

## Check format of the selected text

The format should be:
- Not empty
- One line or at least three lines
- First line not longer than 50 characters
- Second line empty if present
- Third line not empty if present
- Third and every following line not longer than 72 characters
- Last line not empty

First, I refactor the existing code into multiple smaller `async` functions.
Using `async` allows to sequentially call several functions that could possibly fail,
and have one error handler for the whole sequence, something like
```typescript
try {
    const selectedText = await getSelectedText(editor);
    const cwd = await getCwd(vscode.workspace.workspaceFolders);

    const commandOutput = await executeCommand(selectedText, cwd);
    ...
} catch (error) {
    handleError('Making-Of Commit', error);
}
```

[commit-2021-11-15-05-35](https://github.com/pitnyr/making-of-vscode/commit/4850e28a17e449a362886cbf4607766e00d0a2fc)
```email
subject: Refactor to multiple async functions

This allows to sequentially call several functions that could possibly
fail, and have one error handler for the whole sequence.
```

<a id="commit-2021-11-15-08-15"></a>

For the link from the commit message to the making-of section I need the path to the published making-of files.
I think the easiest and most flexible would be to use a setting (configuration).
Thankfully I created one in the "[start](start.md)" feature.

I'll also add a second seetting for the path to the local making-of root.

With both it should be possible to build the links to the published making-of files.

[commit-2021-11-15-08-15](https://github.com/pitnyr/making-of-vscode/commit/533b227e96ff7ce30f40afc0de7acd615002df41)
```email
subject: Add local and published path settings

This allows to build the links to the published making-of files.
```

<a id="commit-2021-11-15-08-50"></a>

With all the mentioned checks in place, I finally can get the complete commit message!

[commit-2021-11-15-08-50](https://github.com/pitnyr/making-of-vscode/commit/9cf553dfa4293962061a94d339b2be3140aa873a)
```email
subject: Get complete commit message
```

<a id="commit-2021-11-15-09-00"></a>

## Execute commit

Now to the real part: perform the commit.
Should be easy to implement, interesting to test...

[commit-2021-11-15-09-00](https://github.com/pitnyr/making-of-vscode/commit/c09b7ae169e9a5176169c158cdaba0156ac392a3)
```email
subject: Execute commit
```


<a id="commit-2021-11-15-09-45"></a>

## Replace selection with final text

The desired final text can be seen above.

As it turns out, I need the URL of the source repository.
I'll use a third setting for that.

[commit-2021-11-15-09-45](https://github.com/pitnyr/making-of-vscode/commit/8c580ea4526c346ccc417f33f9422a89ac008415)
```email
subject: Add setting for source URL
```

<a id="commit-2021-11-15-09-50"></a>

Now I can build the final text.

[commit-2021-11-15-09-50](https://github.com/pitnyr/making-of-vscode/commit/59fc47297cf43a178f07cb797495298b19e421cc)
```email
subject: Build final text for the making-of file
```

<a id="commit-2021-11-15-10-45"></a>

Hmm, if the final text shall be the same as the commit message,
then the text in the commit message has to be trimmed, too.

[commit-2021-11-15-10-45](https://github.com/pitnyr/making-of-vscode/commit/dbaecbf99dbc8ad57d9de54cca929a897f53297a)
```email
subject: Trim text in making-of file, Refactoring
```


## Done

I think this is it. The extension should be usable now!

Ready to be [merged into the main branch](main.md#commit-2021-11-15-10-50).