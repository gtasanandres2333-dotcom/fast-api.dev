module.exports = {
  env: {
    commonjs: true,
    es2020: true,
    node: true,
    jest: true
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'off',
    semi: ['error', 'never'],
    quotes: ['error', 'single']
  }
}
