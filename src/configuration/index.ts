type Env = 'local' | 'dev' | 'prod';

type ConfigType = Record<Env, {
    cors: { hosts: string[] };
    mongo: { url: string };
}>;

import rawConfig from 'configuration/config.json';
const config = rawConfig as ConfigType;

const local_env: Env = 'local';
const ENV: Env[] = ['local', 'dev', 'prod'];

const getEnv = (): Env => {
    const passed_env = process.env.NODE_ENV as Env | undefined;
    return passed_env && ENV.includes(passed_env) ? passed_env : local_env;
};

export const getMongoUrl = (): string => {
    return config[getEnv()].mongo.url;
};
