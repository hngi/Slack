module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
        mocha: true,
    },
    extends: 'airbnb-base',
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    rules: {
        camelcase: 'off',
        "max-len": ["error", { "code": 160 }],
        "import/prefer-default-export": false,
        "no-console": 0,
        "no-useless-return": 0,
        "no-unused-vars": 0,
    },
};