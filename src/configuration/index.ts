type Env = 'local' | 'dev' | 'prod' | 'install';

type ConfigType = Record<Env, {
    cors: { hosts: string[] };
    mongo: { url: string };
    blockstorage: string;
}>;

import rawConfig from './config.json' with { type: 'json' };
const config = rawConfig as ConfigType;

const local_env: Env = 'local';
const ENV: Env[] = ['local', 'dev', 'prod', 'install'];

export const getEnv = (): Env => {
    const passed_env = process.env.NODE_ENV as Env | undefined;
    return passed_env && ENV.includes(passed_env) ? passed_env : local_env;
};

export const getStoragePath = (): string => {
    return config[getEnv()].blockstorage;
}

export const getMongoUrl = (): string => {
    return config[getEnv()].mongo.url;
};


