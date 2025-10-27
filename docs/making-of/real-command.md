---
title: real-command
parent: Making-Of
nav_order: 3
---

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

{% include commit id="2021-11-15-05-35" %}
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

{% include commit id="2021-11-15-08-15" %}
```email
subject: Add local and published path settings

This allows to build the links to the published making-of files.
```

<a id="commit-2021-11-15-08-50"></a>

With all the mentioned checks in place, I finally can get the complete commit message!

{% include commit id="2021-11-15-08-50" %}
```email
subject: Get complete commit message
```

<a id="commit-2021-11-15-09-00"></a>

## Execute commit

Now to the real part: perform the commit.
Should be easy to implement, interesting to test...

{% include commit id="2021-11-15-09-00" %}
```email
subject: Execute commit
```


<a id="commit-2021-11-15-09-45"></a>

## Replace selection with final text

The desired final text can be seen above.

As it turns out, I need the URL of the source repository.
I'll use a third setting for that.

{% include commit id="2021-11-15-09-45" %}
```email
subject: Add setting for source URL
```

<a id="commit-2021-11-15-09-50"></a>

Now I can build the final text.

{% include commit id="2021-11-15-09-50" %}
```email
subject: Build final text for the making-of file
```

<a id="commit-2021-11-15-10-45"></a>

Hmm, if the final text shall be the same as the commit message,
then the text in the commit message has to be trimmed, too.

{% include commit id="2021-11-15-10-45" %}
```email
subject: Trim text in making-of file, Refactoring
```


## Done

I think this is it. The extension should be usable now!

Ready to be [merged into the main branch](main.md#commit-2021-11-15-10-50).