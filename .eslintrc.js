module.exports = {
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    extends: [
      'airbnb-base',
      'plugin:playwright/recommended',
      'plugin:prettier/recommended',
    ],
    parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
    },
    rules: {
      quotes: ['error', 'double'],
      semi: ['error', 'always'],
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      'no-unused-vars': ['warn'],
      'no-console': 'warn',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'comma-dangle': ['error', 'always-multiline'],
      'space-before-function-paren': ['error', 'never'],
      'keyword-spacing': ['error', { before: true, after: true }],
      camelcase: ['error', { properties: 'never' }],
      'no-trailing-spaces': ['error'],
      'eol-last': ['error', 'always'],
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      'playwright/no-skipped-tests': 'error',
      'playwright/no-page-pause': 'error',
    },
    ignorePatterns: [
      '*',
      'node_modules/',
      'dist/',
      'src/legacy-code.js',
      'src/experimental/',
      '.eslintrc.js'
    ],
  };