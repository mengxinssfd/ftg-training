module.exports = {
  testEnvironment: 'jsdom',
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  collectCoverageFrom: [
    'src/**',
    'packages/**/src/**',
    '!**/packages/**/dist/**',
    '!**/packages/**/src/index.ts',
    // "!packages/**/node_modules",
  ],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      // 解决ts5报错 https://github.com/kulshekhar/ts-jest/issues/4081
      { tsconfig: './tsconfig.jest.json' },
    ],
  },
  moduleNameMapper: {
    '^@core$': '<rootDir>/packages/core/src',
    '^@/(.*?)$': '<rootDir>/packages/client/src/$1',
  },
  testRegex: '(/__tests__/.*\\.(test|spec))\\.(jsx?|tsx?)$',
  // moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'node'],
};
