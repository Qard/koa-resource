# koa-resource

koa-resource provides a similar pattern to what Rails resources use for matching functions to routes. It returns a self-contained koa app that can be mounted wherever you like. It also includes basic before and after hooks to manipulate any request within the controller and an optional function to add custom routes before returning the built koa app.

## Install

    npm install koa-resource

## Usage
    
    var users = resource({
      create: function *() {
        var user = yield User.create({ ... })
        this.body = user
      },
      login: function *() {
        this.session.user = yield User.find({ ... })
      }
    }, function (app, res) {
      app.use(route.post('/login', res.login))
    })

    app.use(mount('/users', users))

## Reference table

| HTTP Verb | Path      | Action  |
| --------- | --------- | ------- |
| GET       | /         | index   |
| GET       | /new      | new     |
| POST      | /         | create  |
| GET       | /:id      | read    |
| GET       | /:id/edit | edit    |
| PUT       | /:id      | update  |
| DELETE    | /:id      | destroy |

---

### Copyright (c) 2013 Stephen Belanger
#### Licensed under MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
