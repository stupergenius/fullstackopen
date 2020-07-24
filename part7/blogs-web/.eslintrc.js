module.exports = {
  env: {
    es2020: true,
    browser: true,
    jest: true,
    "cypress/globals": true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: [
    'react', 'jest', 'cypress',
  ],
  rules: {
    indent: [
      'error',
      2,
    ],
    semi: 0,
    'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
    'consistent-return': 0,
    'react/prop-types': 0,
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
    'react/jsx-one-expression-per-line': 0,
    'no-alert': 0,
  },
}
