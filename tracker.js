module.exports = tracker

var util = require('util')
var tracks = {}

tracker.print = function () {
  if (Object.keys(tracks).length)
    console.error(tracks)
}

process.on('exit', function () {
  tracker.print()
})

function tracker (cb, options) {
  if (typeof options === 'string')
    options = { key: options }

  if (typeof options.key !== 'string' || !options.key)
    throw new Error('key option is required')

  var called = false

  // Make sure to get a unique id per call.
  var key = options.key
  var id = 0
  while (tracks.hasOwnProperty(key))
    key = options.key + '_' + (++id)

  trackedCb.key = key
  trackedCb.track = track

  return trackedCb

  function trackedCb () {
    if (called)
      throw new Error('Called cb() more than once: ' + key)

    called = true
    delete tracks[key]

    return cb.apply(this, arguments)
  }

  function track () {
    if (called)
      throw new Error('Called cb.track() after calling cb: ' + key)

    if (options.track !== false) {
      var message = util.format.apply(util, arguments)
      tracks[key] = tracks[key] || []
      tracks[key].push(message)
    }
  }
}
