var _ = require('koa-route')
var koa = require('koa')

module.exports = function (c, fn) {
  var app = koa()

  // Attach before and after behaviours
  if (c.before)   app.use(c.before)
  if (c.after)    app.use(function* (next) {
    yield next
    yield c.after
  })

  // Attach standard routes
  if (c.index)    app.use(_.get('/', c.index))
  if (c.new)      app.use(_.get('/new', c.new))
  if (c.create)   app.use(_.post('/', c.create))
  if (c.read)     app.use(_.get('/:id', c.read))
  if (c.edit)     app.use(_.get('/:id/edit', c.edit))
  if (c.update)   app.use(_.put('/:id', c.update))
  if (c.destroy)  app.use(_.del('/:id', c.destroy))

  // Run optional function to attach other stuff
  if (fn)         fn(app, c)

  return app
}
