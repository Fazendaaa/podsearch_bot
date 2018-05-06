module.exports = (wallaby) => {
    return {
        files: [
            'src/lib/**/*.ts',
        ],
        tests: [
            '__tests__/*.test.ts',
        ],
    };
};
