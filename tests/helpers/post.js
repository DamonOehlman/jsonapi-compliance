var request = require('hyperquest');
var concat = require('concat-stream');

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

    req.write(typeof body == 'object' ? JSON.stringify(body) : body);
    req.end();
  };
};
