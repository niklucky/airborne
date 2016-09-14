# Routing
You can create nested routes with or whithout params.
Route file is just JS-file with routes.

Method called in controller is depending on methods table or custom method if specified.
| HTTP-method | Controller method |
|-------------|-------------------|
| `GET` | `load` |
| `POST` | `create` |
| `PUT` | `update` |
| `DELETE` | `remove` |
| `HEAD` | `status` |

## Simple routing
```
module.exports = {
  '/': {
    auth: false,
  }
};
```
In this example you just specified index route. It will call `IndexController` and method that depends on HTTP-method.

## Example with named params
```
module.exports = {
  '/': {},
  '/user/:id': {
    auth: true,
  }
};
```

## Setting module
If you set module, then router mask will be like this:
`/:module/:controller/:action/?:params`
Otherwise:
`/:controller/:action/?:params`

```
module.exports = {
  '/': {},
  '/user/:id': {
    auth: true,
    module: 'User'
  }
};
```

## Setting method
If you need custom method to process, you can define it in route:

```
module.exports = {
  '/': {},
  '/auth/login': {
    method: 'login'
  }
};
```
In this case instead of calling `AuthController.load` in `GET` method, `AuthController.login` method will be invoked.
