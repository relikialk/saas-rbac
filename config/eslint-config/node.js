/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['@rocketseat/eslint-config/node'],
  plugins: [
    'simple-import-sort',
    '@typescript-eslint'
  ],
  rules: {
    'simple-import-sort/imports': 'error',
    'no-useless-constructor': 'off',
    'quotes': [
      'error',
      'single'
    ]
  }
}