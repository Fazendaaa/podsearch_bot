module.exports = (wallaby) => {
    return {
        files: [
            'src/*.ts',
        ],
        tests: [
            'test/*.test.ts',
        ],
    };
};
