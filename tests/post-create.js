module.exports = function(url, test) {
  var post = require('./helpers/post')(url);
  var get = require('./helpers/get')(url);
  var postId;

  test('can create a new post', function(t) {
    t.plan(3);
    post('/posts', { title: 'My experience with jsonapi' }, function(err, res, body) {
      postId = body && body.id;

      t.ifError(err);
      t.equal(res.statusCode, 201);
      t.ok(postId, 'id generated');
    });
  });

  test('can get the newly created post', function(t) {
    t.plan(3);

    get('/posts/' + postId, function(err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 200);
      t.equal(body && body.title, 'My experience with jsonapi');
    });
  });
};
