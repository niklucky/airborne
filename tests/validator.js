var Validator = require('./../lib/validator');
var validator = new Validator({
  id: {
    type: 'number',
    required: true
  },
  name: {
    type: 'string'
  },
  data: {
    type: 'array'
  }
},
  {
    convertStringToNumber: true
  }
);

var result = validator.validate({
  id: "1a",
  name: 'Test',
  data: [0,1]
});

console.log(result);