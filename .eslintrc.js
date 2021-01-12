module.exports = {
  root: true,
  env: {
    commonjs: true,
    es6: true,
    browser: true,
    node: true,
  },
  ignorePatterns: ["node_modules"],
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  // add your custom rules here
  rules: {
    'no-console': 'off',
    'prettier/prettier': 'error',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'no-plusplus': 'off',
    'require-await': 'off',
    'no-unused-vars': 'off',
    'no-useless-escape': 'off',
    'no-proto': 'off',
    // 链式判断
    'no-unused-expressions': 'off',
    camelcase: 0,
    'react-hooks/exhaustive-deps': 0,
    'react-hooks/rules-of-hooks': 0,
    'react/jsx-pascal-case':0,
    'no-template-curly-in-string':0,

    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-unused-vars': 0,
    'prefer-const': 0,
    // 临时的
    '@typescript-eslint/no-explicit-any': 0,
    'react-hooks/exhaustive-deps': 0,
    'no-case-declarations':0
  },
}
