module.exports = function(url, test) {
  var post = require('./helpers/post')(url);
  var get = require('./helpers/get')(url);
  var postId;

  test('post data with no "posts" array fails', function(t) {
    t.plan(2);
    post('/posts', { title: 'This should fail' }, function(err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 412);
    });
  });

  test('can create a new post', function(t) {
    t.plan(3);
    post('/posts', { posts: [{ title: 'My experience with jsonapi' }] }, function(err, res, body) {
      postId = body && body.posts && body.posts[0] && body.posts[0].id;

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
      t.ok(Array.isArray(body && body.posts), 'got posts');
    });
  });
};
