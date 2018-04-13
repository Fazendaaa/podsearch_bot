/**
 * Jest configuration file.
 */
module.exports = {
    globals: {
        'ts-jest': {
            enableTsDiagnostics: true,
        },
    },
    verbose: true,
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    /**
     * Removing  the  dist  folder  because relative path to the original TS code will be linked as valid JS test cases.
     * This  would  mean inconsistency as the cases test run it. In the tsconfig.json the test folder is already removed
     * from  the  folders  to  be  compiled, though -- but in any case that flag could be removed and JS tests files are
     * generated, this option would prevented to run it.
     */
    coveragePathIgnorePatterns: [
        '<rootDir>/node_modules/',
        '<rootDir>/dist/',
    ],
    testRegex: '(./__tests__/.*| (\\.|/)(test|spec))\\.(jsx?|tsx?)$',
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
        'node'
    ],
    collectCoverage: true,
    useStderr: true,
    forceExit: true,
    coverageReporters: [
        "json",
        "lcov",
        "text"
    ],
    expand: true,
    logHeapUsage: true,
    bail: true
};
