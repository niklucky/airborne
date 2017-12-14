class Authorization {
  constructor(di) {
    this.di = di;
    this.result = {
      status: true,
      user: {
        id: 1
      }
    };
  }
  init() {
    return new Promise((resolve, reject) => {
      if (this.di.get('reject')) {
        return reject(null);
      }
      if (this.di.get('falseStatus') === '1') {
        this.result.status = false;
      }
      return resolve(this.result);
    });
  }
}

class UsersController {
  constructor(di) {
    this.di = di;
    this.data = {
      params: {
        a: 1
      },
      payload: {}
    };
  }
  validate() {
    return this.load(this.data);
  }
  load(params) {
    this.result = params;
    return this.result;
  }
}
const responseObj = {
  status: () => (true),
  send: () => (true)
};

const validator = {
  rules: {
    load: {
      id: {
        type: 'number',
        required: true
      },
      name: {
        type: 'string'
      },
      price: {
        type: 'float'
      },
      isActive: {
        type: 'boolean'
      },
      options: {
        type: 'array'
      },
      data: {
        type: 'object'
      }
    }
  },
  data: [
    {
      params: {
        id: 1,
        name: 'Test',
        price: 10.20,
        isActive: true,
        options: [1, 2],
        data: {
          id: 2, name: 'dataObject'
        }
      }
    },
    {
      params: {
        id: 1,
        name: 'Test',
        price: 10.20,
        isActive: true
      },
      payload: {
        options: [1, 2],
        data: {
          id: 2, name: 'dataObject'
        }
      }
    }
  ]
};
const responder = {
  config: {
    debug: false
  },
  response: responseObj
};

const routes = {
  '/': {},
  '/users': {
    get: {
      handler: UsersController,
      method: 'load',
      middlewares: []
    }
  }
};

// const routes = {
//   '/': {},
//   '/user': { auth: true }
// };
const services = {
  Authorization
};
const controllers = {
  UsersController
};

const controller = UsersController;

export default {
  controllers,
  controller,
  responder,
  routes,
  services,
  validator
};
