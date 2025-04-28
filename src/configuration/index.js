const configurationFile = require('../configuration/config.json')
const local_env = "local";
const ENV = ["local", "staging", "production", "install", "test"];

const getEnv = () => {
    const passed_env = process.env.NODE_ENV || local_env ;
    return ENV.includes(passed_env) ? passed_env : local_env;
};

module.exports = {
     getMongoUrl:  () => {
        return configurationFile[getEnv()].mongo.url;
    }
}
