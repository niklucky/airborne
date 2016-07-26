let _password = '',
    _salt = '',
    _tokenKey = null;

class TestMysql {
  constructor(model) {
    if(model === undefined || model === null){
      model = {
        id: null,
        username: null,
        state: null,
      }
    }
    this.id = model.id || null;
    this.username = model.username || '';
    this.state = model.state || 'inactive';
    this.accessToken = '';
    this.uuid = model.uuid || null

    _password = model.password;
    _salt = model.salt;
  }

  setToken(token){
    _tokenKey = token;
    this.accessToken = token.replace(`user:${this.id}:`, '');
  }

  getPassword(){
    return _password;
  }

  setPassword(password){
    _password = password;
    return this;
  }

  getSalt(){
    return _salt;
  }

  setSalt(salt){
    _salt = salt;
    return this;
  }

  get(){
    return {
      id: this.id,
      username: this.username,
      password: this.getPassword(),
      salt: this.getSalt(),
      uuid: this.uuid,
      state: this.state
    }
  }

}

module.exports = TestMysql;
