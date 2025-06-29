export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
}; 