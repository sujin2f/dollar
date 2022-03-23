module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['<rootDir>/src/**/?(*.)+(spec).ts?(x)'],
    testPathIgnorePatterns: ['/node_modules/'],
    moduleNameMapper: {
        'src/(.*)': '<rootDir>/src/$1',
    },
    collectCoverage: true,
    collectCoverageFrom: [
        '<rootDir>/src/utils/**/*.{ts,tsx}',
        '<rootDir>/src/client/utils/**/*.{ts,tsx}',
        '<rootDir>/src/client/hooks/**/*.{ts,tsx}',
        '<rootDir>/src/client/store/**/*.{ts,tsx}',
        '<rootDir>/src/server/utils/**/*.{ts,tsx}',
        '<rootDir>/src/server/routes/graphql.ts',
        '!<rootDir>/src/**/*.spec.{ts,tsx}',
        '!<rootDir>/src/**/*.d.{ts,tsx}',
    ],
    coverageDirectory: '<rootDir>/coverage',
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
    verbose: true,
}
