module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    // Use logger.ts instead of console — enforced to prevent PII leaks in prod.
    'no-console': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    // TODO(phase-1): add custom no-hardcoded-design-tokens rule here once
    // the eslint plugin is scaffolded in src/lib/eslint-rules/.
  },
  env: {
    browser: false,
    node: true,
  },
  ignorePatterns: ['node_modules/', '.expo/', 'babel.config.js', 'metro.config.js', 'tailwind.config.js'],
};
