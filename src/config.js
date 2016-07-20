let _config = {
  path: './',
  host: 'localhost',
  port: 3000,
  debug: true
};

class Config {
  constructor(config){
    _config = this.merge(_config, config);
  }

  merge(config, userConfig) {
    for (var i in userConfig) {
      if (userConfig.hasOwnProperty(i)) {
        config[i] = userConfig[i];
      }
    }
    return config;
  }
  get(){
    return _config;
  }
}
module.exports = Config;
