module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    serviceworker: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  globals: {
    // Global variables
    'tailwind': 'readonly',
    'gtag': 'readonly',
    'Sentry': 'readonly',
    'GeofisikaMataram': 'readonly'
  },
  rules: {
    // Error prevention
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'no-alert': 'warn',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-undef': 'error',
    'no-redeclare': 'error',
    'no-duplicate-imports': 'error',
    
    // Code style
    'indent': ['error', 4, { SwitchCase: 1 }],
    'quotes': ['error', 'single', { avoidEscape: true }],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'space-before-function-paren': ['error', 'never'],
    'keyword-spacing': ['error', { before: true, after: true }],
    'space-infix-ops': 'error',
    'eol-last': ['error', 'always'],
    'no-trailing-spaces': 'error',
    
    // Best practices
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    'brace-style': ['error', '1tbs'],
    'camelcase': ['error', { properties: 'never' }],
    'prefer-const': 'error',
    'no-var': 'error',
    'prefer-arrow-callback': 'error',
    'arrow-spacing': ['error', { before: true, after: true }],
    'prefer-template': 'error',
    'template-curly-spacing': ['error', 'never'],
    
    // Modern JavaScript
    'prefer-destructuring': ['error', {
      array: true,
      object: true
    }, {
      enforceForRenamedProperties: false
    }],
    'object-shorthand': ['error', 'always'],
    'prefer-spread': 'error',
    'prefer-rest-params': 'error',
    
    // Async/await
    'prefer-promise-reject-errors': 'error',
    'no-async-promise-executor': 'error',
    'require-await': 'error',
    
    // Performance
    'no-loop-func': 'error',
    'no-inner-declarations': 'error',
    
    // Security
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    
    // Accessibility
    'jsx-a11y/alt-text': 'off', // Not using JSX
    
    // Custom rules untuk project ini
    'max-len': ['warn', { 
      code: 120, 
      ignoreUrls: true, 
      ignoreStrings: true,
      ignoreTemplateLiterals: true
    }],
    'max-lines': ['warn', { max: 500, skipBlankLines: true, skipComments: true }],
    'max-params': ['warn', 5],
    'complexity': ['warn', 10],
    'max-depth': ['warn', 4],
    'max-nested-callbacks': ['warn', 3]
  },
  overrides: [
    {
      // Service Worker specific rules
      files: ['sw.js', 'service-worker.js'],
      env: {
        serviceworker: true,
        browser: false
      },
      globals: {
        'clients': 'readonly',
        'caches': 'readonly',
        'skipWaiting': 'readonly',
        'importScripts': 'readonly'
      }
    },
    {
      // Configuration files
      files: ['*.config.js', '.eslintrc.js'],
      env: {
        node: true,
        browser: false
      }
    },
    {
      // Test files (jika ada)
      files: ['**/*.test.js', '**/*.spec.js'],
      env: {
        jest: true
      },
      globals: {
        'describe': 'readonly',
        'it': 'readonly',
        'expect': 'readonly',
        'beforeEach': 'readonly',
        'afterEach': 'readonly',
        'beforeAll': 'readonly',
        'afterAll': 'readonly'
      }
    }
  ]
};