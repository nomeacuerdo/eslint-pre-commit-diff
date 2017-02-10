const child = require('child_process');
const Table = require('cli-table');

module.exports = function(results) {
    let errors = [];
    let lines = null;
    results.forEach(result => {
        let file = child.execSync(`git blame ${result.filePath}`);
        file = file.toString('utf8').split('\n');
        let error = {
            filePath: result.filePath,
            messages: [],
            errorCount: 0,
            warningCount: 0
        };

        file.forEach((line, ind) => {
            if (-1 < line.indexOf('Not Committed Yet')) {
                result.messages.forEach(message => {
                    if (message.line === ind + 1) {
                        if (2 === message.severity) {
                            error.errorCount++;
                            message.severity = 'error';
                        }

                        if (1 === message.severity) {
                            error.warningCount++;
                            message.severity = 'warning';
                        }

                        error.messages.push(message);
                    }
                });
            }
        });
        if (0 < error.errorCount || 0 < error.warningCount) {
            errors.push(error);
        }
    });

    if (0 < errors.length) {
        lines = '\n\n';
        lines += errors.map(error => {
            let errorFileText = '';
            let table = new Table({
                chars: { 'top': '',
                    'top-mid': '',
                    'top-left': '',
                    'top-right': '',
                    'bottom': '',
                    'bottom-mid': '',
                    'bottom-left': '',
                    'bottom-right': '',
                    'left': '',
                    'left-mid': '',
                    'mid': '',
                    'mid-mid': '',
                    'right': '',
                    'right-mid': '',
                    'middle': ' '
                },
                style: {
                    'padding-left': 0,
                    'padding-right': 0
                }
            });

            errorFileText += `\u001b[4m${error.filePath}\u001b[24m\n`;
            error.messages.map(message => {
                table.push([`\u001b[90m${message.line}:${message.column}\u001b[39m`, `\u001b[31m${message.severity}\u001b[39m`, `${message.message}`, `${message.ruleId}`]);
            });
            errorFileText += table.toString();

            return errorFileText;
        }).join('\n\n');
    }

    return lines;
};
