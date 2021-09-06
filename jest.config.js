module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  setupFiles: ['./node_modules/react-native-gesture-handler/jestSetup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@?react-native|@react-native-community|@react-navigation)',
  ],
  watchPathIgnorePatterns: ['<rootDir>/node_modules'],

  collectCoverageFrom: [
    '**/src/**/*.js',
    '!**/src/assets/**',
    '!**/src/firebase/**',
    '!**/__tests__/**',
    '!**/__server_tests__/**',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      statements: 75,
      branches: 40,
      functions: 75,
      lines: 45,
    },
  },
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};