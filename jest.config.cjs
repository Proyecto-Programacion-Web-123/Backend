// Proyecto/Backend/jest.config.cjs
module.exports = {
  testEnvironment: 'node',
  testMatch: [ '**/test/**/*.test.js', 
    '**/tests/health.test.js',
    '**/routes/test/**/*.test.js',
    '**/models/test/**/*.test.js', 
    '**/tests/app.behavior.test.js',
    '**/controllers/test/**/*.test.js',
    '**/services/test/**/*.test.js'
  
  ], 

  collectCoverage: true,
  coverageReporters: ['text', 'lcov', 'html'],

  // Solo las clases con las que se cuentan los test
  collectCoverageFrom: [
    //'app.js',
    'routes/**/*.js',
    //'models/**/*.js',
    'controllers/**/*.js',
    'services/**/*.js'
  ],

  coveragePathIgnorePatterns: [
    '/node_modules/'
  ],

    testPathIgnorePatterns: [
    '/node_modules/',
    '/migrations/test/',
    '/services/test/orderService.test.js',
    '/controllers/test/orderController.test.js'
  ],

  globalTeardown: './jest.teardown.js',
  testTimeout: 10000
};
