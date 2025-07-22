import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    globals: {
        transform: {
            '^.+\\.tsx?$': ['ts-jest', {//the content originally placed at "global"
                babel: true,
                tsConfig: 'tsconfig.json',
            }]
        },
    },
    moduleNameMapper: {
        '^@models/(.*)\\.js$': '<rootDir>/src/models/$1.ts',
        '^@service/(.*)\\.js$': '<rootDir>/src/service/$1',
        '^@graphql/(.*)$\\.js': '<rootDir>/src/graphql/$1',
        '^@utils/(.*)\\.js$': '<rootDir>/src/utils/$1',
        '^@configuration/(.*)\\.js$': '<rootDir>/src/configuration/$1',
    },
};

export default config;
