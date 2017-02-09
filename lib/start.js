'use strict';

const child = require('child_process');

module.exports = function() {
    let result = []
    let files = child.execSync(`git diff HEAD --name-only`);
    files = files.toString('utf8').split('\n');
    files.forEach(file => {
        if (file.indexOf('app') > -1 && file.substr(-3).indexOf('.js') > -1) {
            result.push(file);
        }
    });

    result = result.join(' ');

    if (0 === result.length) {
        process.exit(0);
    }

    child.exec(`node_modules/.bin/eslint -f ./ui/linter/results.js ${result}`, (err, stdout, strerr) => {
        if (stdout.length > 0) {
            console.log(stdout);
            process.exit(1);
        } else {
            process.exit(0);
        }
    });
}
