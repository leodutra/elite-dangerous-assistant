module.exports = {
    'env': {
        'browser': true,
        'node': true,
        'commonjs': true,
        'es6': true,
        'jest': true
    },
    'extends': [
        'standard'
    ],
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
    'parserOptions': {
        'ecmaVersion': 2018
    },
    'rules': {
        'indent': ['error', 4]
    }
}
