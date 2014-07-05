var assert  = require('assert')
var route   = require('koa-route')
var compose = require('koa-compose')

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
module.exports = function (controller, options) {
  options = options || {}
  var list = []

  // Enable functions to be run before the route starts.
  if (controller.before) {
    var befores = controller.before || []

    if (!Array.isArray(befores)) {
      befores = [befores]
    }

    befores.forEach(function (before) {
      assert(isLegal(before), 'The function must be a GeneratorFunction.')
      list.push(before)
    })
  }

  // Add the route handlers for each method
  routes.forEach(function (def) {
    var handler = route[def[0]]
    var fns     = controller[def[2]]
    var path    = def[1]

    // Allow custom ids, which are useful for nesting
    if (options.id) {
      path = path.replace(':id', ':' + options.id)
    }

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

    // Compose
    list.push(handler(path, compose(fns)))
  })

  // Compose a single middleware for the list.
  return compose(list)
}
