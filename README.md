This is a fork of [eslint-pre-commit-diff](https://github.com/evless/eslint-pre-commit-diff), translated to english.

## Installation
<code>npm i eslint-pre-commit-diff-en -D</code>

## Usage
<code>package.json</code>
<pre>
    "scripts": {
        "preCommitLinter": "node node_modules/eslint-pre-commit-diff-en --folder app"
    }
    // ...
    "pre-commit": {
        "run": ["preCommitLinter"]
    }
</pre>

## Options

<code>--folder</code> - @default: ''

<code>--file-type</code> - @default: '.js'
