/**@type {import('eslint').ESLint.} */
module.exports = {
  root: true,
  extends: ['eslint-config-apadconfig'],
  rules:{
    '@typescript-eslint/no-extra-semi':0
  },
  ignorePatterns: ["**/dist/*"]
}
