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
                if (line.indexOf('Not Committed Yet') > -1) {
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
        if (error.errorCount > 0 || error.warningCount > 0) {
            errors.push(error);
        }
    });

    if (errors.length > 0) {
        lines = '\n\n';
        lines += errors.map(error => {
            let errorFileText = '';
            let table = new Table({});

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
