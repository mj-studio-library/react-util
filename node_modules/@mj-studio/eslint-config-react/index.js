module.exports = {
  extends: ['@mj-studio/eslint-config-node'],
  env: {
    browser: true,
    jest: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: [
    'react',
    'react-hooks',
    'simple-import-sort',
    'import',
  ],
  rules: {
    'jsx-quotes': ['error', 'prefer-double'],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'react/prefer-stateless-function': 'error',
    'react/button-has-type': 'error',
    'react/no-unused-prop-types': 'error',
    'react/jsx-pascal-case': 'error',
    'react/jsx-no-script-url': 'error',
    'react/no-children-prop': 'error',
    'react/no-danger': 'error',
    'react/no-danger-with-children': 'error',
    'react/no-unstable-nested-components': ['error', {allowAsProps: true}],
    'react/jsx-fragments': 'error',
    'react/jsx-no-leaked-render': ['error', {validStrategies: ['ternary']}],
    'react/jsx-max-depth': ['warn', {max: 8}],
    'react/function-component-definition': [
      'warn',
      {namedComponents: 'function-declaration'},
    ],
    'react/jsx-key': [
      'error',
      {
        checkFragmentShorthand: true,
        checkKeyMustBeforeSpread: true,
        warnOnDuplicates: true,
      },
    ],
    'react/jsx-no-useless-fragment': 'warn',
    'react/jsx-curly-brace-presence': 'warn',
    'react/no-typos': 'warn',
    'react/display-name': 'off',
    'react/self-closing-comp': 'warn',
    'react/jsx-sort-props': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/prop-types': 'off',
    'react/destructuring-assignment': 'off'
  },
};
