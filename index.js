var compose = require('koa-compose')
var assert = require('assert')
var _ = require('koa-route')

module.exports = resource

// map of http methods, paths and expected function names
var routes = [
  ['get',   '/',          'index'],
  ['get',   '/new',       'new'],
  ['post',  '/',          'create'],
  ['get',   '/:id',       'read'],
  ['get',   '/:id/edit',  'edit'],
  ['put',   '/:id',       'update'],
  ['del',   '/:id',       'destroy']
]

// receives an object, typically a required module
function resource (controller) {
  var list = []

  // before hook
  if (controller.before) {
    // ensure before list is an array
    var befores = controller.before || []
    if ( ! Array.isArray(befores)) {
      befores = [befores]
    }

    // push everything onto the middleware stack
    befores.forEach(function (before) {
      assert(isLegal(before), 'The function must be a GeneratorFunction.')
      list.push(before)
    })
  }

  // resource routes
  routes.forEach(function (def) {
    var handler = _[def[0]]
    var route = def[1]
    var name = def[2]
    var fn = controller[name]

    // push onto the middleware stack
    if (fn) {
      assert(isLegal(fn), 'The function must be a GeneratorFunction.')
      list.push(handler(route, fn))
    }
  })

  // compose a single middleware for the list
  return compose(list)
}

/**************************** HELPER FUNCTIONS ********************************/

function isLegal (fn) {
  return typeof fn == 'function' && 'GeneratorFunction' == fn.constructor.name
}
