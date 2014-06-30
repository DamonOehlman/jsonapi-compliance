var request = require('hyperquest');
var concat = require('concat-stream');
var debug = require('debug')('jsonapi-compliance:get');
var resOK = /^(2|3)\d{2}$/;

module.exports = function(baseUrl) {
  return function(url, body, callback) {
    var req = request(baseUrl + url, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json'
      }
    });

    req.on('response', function(res) {
      if (! resOK.test(res.statusCode)) {
        return callback(null, res);
      }

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

    debug('POST ' + baseUrl + url);
    req.write(typeof body == 'object' ? JSON.stringify(body) : body);
    req.end();
  };
};
