var request = require('hyperquest');
var concat = require('concat-stream');
var debug = require('debug')('jsonapi-compliance:get');

module.exports = function(baseUrl) {
  return function(url, callback) {
    var req = request(baseUrl + url, {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.api+json',
      }
    });

    req.on('response', function(res) {
      res.pipe(concat(function(data){
        try {
          data = JSON.parse(data);
        }
        catch (e) {
          return callback(e);
        }

        callback(null, res, data);
      }));
    });

    debug('GET ' + baseUrl + url);
    req.end();
  };
};
