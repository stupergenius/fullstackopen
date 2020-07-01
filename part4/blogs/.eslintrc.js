module.exports = {
  env: {
    commonjs: true,
    es2020: true,
    node: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    indent: ['error', 2],
    semi: 0,
    'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
    'consistent-return': 0,
    'no-underscore-dangle': 0,
  },
}
