# Airborne: Controllers

## What you should know
Request processing mode:

First segment of URI it's a Controller name with \*Controller suffix;

HTTP Method is a Controller method by specified rules (see below).

Another way is to use *Modules*.

Then it will be:

First segment of URI it's a Module name

Second segment of URI it's a Controller name with \*Controller suffix

HTTP Method is a Controller method by specified rules (see below).

### HTTP method rules
```
GET - load
POST - create
PUT - update
DELETE - remove
```

### Custom Controller methods
Of course you can specify your own methods in Router (docs soon).

## Validation
In class constructor you have to specify *this.rules* Object with all required or optional keys.
Without this object you won't get any params in your controller.
More info in Validator (soon)

```
class TestController {
  constructor(di){
    super(di);
    this.rules = {
      get: { // method name
        id: {
          type: number, // number, string, array
          required: true // boolean, optional
        }
        ...
      }
      ...
    }
  }
}
```

# More soon...
