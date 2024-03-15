module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir : __dirname, 
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'unused-imports',
    'sonarjs',
    'simple-import-sort'
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'unused-imports/no-unused-imports': 'error',
    'sonarjs/cognitive-complexity': 'warn',
    'simple-import-sort/imports': [
      'error',
      {
        'groups': [
          // 3rd Party packages come first.
          ['^@?\\w'],
          // Internal packages.
          ['^(@app)(/.*|$)'],
          // Side effect imports.
          ['^\\u0000'],
          // Parent imports. Put `..` last.
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // Other relative imports. Put same-folder imports and `.` last.
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$']
        ]
      }
    ],
    'simple-import-sort/exports': 'error',
  },
};
