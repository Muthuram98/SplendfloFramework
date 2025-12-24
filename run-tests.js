const { exec } = require('child_process');
const path = require('path');
const glob = require('glob');

// Get the input, which can be a module name or 'all' to run all tests
const input = process.argv[2];
const project = process.argv[3];
const tag = process.argv[4]; // Optional tag argument

if (!input || !project) {
    console.error('Usage: node run-tests.js <module-name> <project> [tag]');
    process.exit(1);
}

let searchPattern;
let moduleName;

if (input === 'allTests') {
    // Run all tests in the ./tests/ directory
    searchPattern = './tests/**/*.spec.js';
    moduleName = 'all-tests';
    console.log('Running all tests...');
}
else if (input.endsWith('.spec.js')) {
    // If input is a specific spec file
    searchPattern = input;
    moduleName = path.basename(path.dirname(input));
    console.log(`Running specific test file: ${input}`);
}
else {
    // Run tests in the specified module directory
    searchPattern = `./tests/**/${input}/*.spec.js`;
    moduleName = input;
    console.log(`Running tests for module or test_suite: ${input}`);
}

//this function searches your file system for files that match the searchPattern
const testFiles = glob.sync(searchPattern);

if (testFiles.length === 0) {
    console.error(`No test files found with the pattern: ${searchPattern}`);
    process.exit(1);
}

// Base command
let command = `npx playwright test ${testFiles.join(' ')} --project=${project}`;

// Add tag filter if provided
if (tag) {
    command += ` --grep @${tag}`;
}

console.log(`Executing: ${command}`);

// Run the command and capture logs
const testProcess = exec(command, { maxBuffer: 1024 * 1024 * 10 }); // 10MB buffer

testProcess.stdout.on('data', (data) => {
    console.log(`STDOUT: ${data}`);
});

testProcess.stderr.on('data', (data) => {
    console.error(`STDERR: ${data}`);
});

testProcess.on('close', (code) => {
    console.log(`Child process exited with code ${code}`);
    if (code !== 0) {
        process.exit(1);
    }
});

// Set environment variable for MODULE_NAME for use in respective buildspec.yml
process.env.MODULE_NAME = moduleName;