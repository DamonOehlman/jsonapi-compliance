module.exports = function(url, test) {
  var post = require('./helpers/post')(url);

  test('can create a new post', function(t) {
    t.plan(3);
    post('/post', { title: 'My experience with jsonapi' }, function(err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 201);
      t.ok(body && body.id, 'id generated');
    });
  });
};
