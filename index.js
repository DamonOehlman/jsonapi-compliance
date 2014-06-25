var tape = require('tape');
var reTrailingSlash = /\/$/;

/**
  # jsonapi-compliance

  This is a suite of tests that checks a HTTP endpoint for compatibility
  with <http://jsonapi.org>.  At this stage it is designed to be invoked
  programmatically as part of another test suite.

  ## Usage

  To be completed.

  ## Schema Setup

  The tests that are run assume the schema (which is similar to what is
  outlined in the jsonapi.org docs).

  (to be completed).
**/

module.exports = function(opts, callback) {
  var test = tape.createHarness();
  var stream = test.createStream({ objectMode: true });
  var url = ((opts || {}).url || '').replace(reTrailingSlash, '');

  function endTest(err) {
    if (callback) {
      callback(err);
    }

    callback = undefined;
  }

  stream
    .on('data', function(data) {
      if (data.type === 'assert' && (! data.ok)) {
        return endTest(new Error('not ok'));
      }
    })
    .on('end', endTest);

  require('./tests/post-create')(url, test);
};
