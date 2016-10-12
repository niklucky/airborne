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
export default {
  validator
};
