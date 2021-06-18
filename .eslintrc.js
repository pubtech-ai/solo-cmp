module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'google',
    'plugin:json/recommended',
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': [
        '.ts'
      ]
    },
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'no-tabs': ["error", { allowIndentationTabs: true }],
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'import/no-cycle': ['error', { maxDepth: 1 }],
    'max-len': ['error', {
      'ignoreUrls': true,
      'ignoreStrings': true,
      'ignoreTemplateLiterals': true,
      'ignoreRegExpLiterals': true,
      'code': 120
    }],
    'no-multiple-empty-lines':['error', {'max':1, 'maxEOF':0, 'maxBOF':0}],
    'require-jsdoc': [1],
    'semi': ['error', 'always'],
    'padded-blocks': ['error', 'always'],
    'no-console': 'error',
    'no-debugger': 'error',
    '@typescript-eslint/indent': ['error', 4],
    'indent': [
      'error', 4, {
        'ArrayExpression': 'first',
        'FunctionExpression': {'body': 1, 'parameters': 'first'},
        'ObjectExpression': 'first',
        'SwitchCase': 1,
        'CallExpression': {'arguments': 'first'},
      },
    ],
    'padding-line-between-statements': [
      'error',
      {'blankLine': 'any', 'prev': ['const', 'let', 'var'], 'next': ['const', 'let', 'var']},
      {'blankLine': 'always', 'prev': '*',  'next': 'class'},
      {'blankLine': 'always', 'prev': '*',  'next': 'function'},
      {'blankLine': 'always', 'prev': 'block-like',  'next': '*'},
      {'blankLine': 'always', 'prev': '*',  'next': 'block-like'},
    ],
    'new-cap': 'off'
  },
};
