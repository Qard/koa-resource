var assert  = require('assert')
var compose = require('koa-compose')
var method = require('koa-method-match')
var mount = require('koa-path-mount')
var route = require('koa-path')()

module.exports = resource

/**
 * Check whether a given function is a generator.
 *
 * @type {Boolean}
 */
var isLegal = function (fn) {
  return typeof fn == 'function' && 'GeneratorFunction' == fn.constructor.name
}

/**
 * Map of typical HTTP methods, paths and controller methods.
 *
 * @type {Array}
 */
var routes = [
  ['get',    '/',          'index'],
  ['get',    '/new',       'new'],
  ['post',   '/',          'create'],
  ['get',    '/:id',       'show'],
  ['get',    '/:id',       'read'],
  ['get',    '/:id/edit',  'edit'],
  ['put',    '/:id',       'update'],
  ['delete', '/:id',       'destroy']
]

/**
 * Transform a controller object into a generator for middleware.
 *
 * @param  {Object}            controller
 * @return {GeneratorFunction}
 */
function resource (controller, options) {
  options = options || {}
  options.id = options.id || 'id'
  var list = []

  // Enable functions to be run before the route starts.
  if (controller.before) {
    var befores = controller.before || []

    if ( ! Array.isArray(befores)) {
      befores = [befores]
    }

    befores.forEach(function (before) {
      assert(isLegal(before), 'The function must be a GeneratorFunction.')
      list.push(before)
    })
  }

  // Attach any nested controllers
  if (options.nested) {
    Object.keys(options.nested).forEach(function (path) {
      var resource = options.nested[path]
      path = path.replace(/^\//, '')
      list.push(mount('/:' + options.id + '/' + path, resource))
    })
  }

  // Add the route handlers for each method
  routes.forEach(function (def) {
    var fns     = controller[def[2]]
    var path    = def[1]

    // Allow custom ids, which are useful for nesting
    path = path.replace(':id', ':' + options.id)

    // Skip if there's no handlers
    if (typeof fns === 'undefined') {
      return
    }

    // Support arrays, like before hooks
    if ( ! Array.isArray(fns)) {
      fns = [fns]
    }

    // Validate handlers
    fns.forEach(function (fn) {
      assert(isLegal(fn), 'The function must be a GeneratorFunction.')
    })

    // Generate handler
    var handler = compose(fns)

    // Generate method and path scoped handler
    var scoped = method(def[0], route(path, handler))

    // Push it to the stack
    list.push(scoped)
  })

  // Compose a single middleware for the controller
  return compose(list)
}
