module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    'middleware/**/*.js',
    '!**/node_modules/**'
  ],
  setupFilesAfterEnv: ['./tests/setup.js'],
  reporters: [
    'default',
    ['./node_modules/jest-html-reporter', {
      pageTitle: 'IT Resource Management System Test Report',
      outputPath: './test-report.html'
    }]
  ]
};