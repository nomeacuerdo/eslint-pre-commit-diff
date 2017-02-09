const child = require('child_process');
const minimist = require('minimist');
const argv = minimist(process.argv);

module.exports = function() {
    let path = argv.path || '';
    let fileType = argv['file-type'] || '.js';
    let result = [];
    let files = child.execSync('git diff HEAD --name-only');
    files = files.toString('utf8').split('\n');
    files.forEach(file => {
        if (-1 < file.indexOf(path) && -1 < file.substr((-1 * fileType.length)).indexOf(fileType)) {
            result.push(file);
        }
    });

    result = result.join(' ');

    if (0 === result.length) {
        console.log('Sector clear!');
        process.exit(0);
    }

    child.exec(`node_modules/.bin/eslint -f node_modules/eslint-pre-commit-diff/lib/results.js ${result}`, (err, stdout, strerr) => {
        if (0 < stdout.length) {
            console.log(stdout);
            process.exit(1);
        } else {
            console.log('Sector clear!');
            process.exit(0);
        }
    });
};
