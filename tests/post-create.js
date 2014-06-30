var pluck = require('whisk/pluck');

module.exports = function(url, test) {
  var post = require('./helpers/post')(url);
  var get = require('./helpers/get')(url);
  var postIds = [];

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
      postIds = (body && body.posts || []).map(pluck('id'));

      t.ifError(err);
      t.equal(res.statusCode, 201);
      t.ok(postIds[0], 'id generated');
    });
  });

  test('can get the newly created post', function(t) {
    t.plan(3);

    get('/posts/' + postIds[0], function(err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 200);
      t.ok(Array.isArray(body && body.posts), 'got posts');
    });
  });

  test('can create a second post', function(t) {
    t.plan(3);
    post('/posts', { posts: [{ title: 'Another post' }] }, function(err, res, body) {
      postIds = postIds.concat((body && body.posts || []).map(pluck('id')));

      t.ifError(err);
      t.equal(res.statusCode, 201);
      t.ok(postIds[1], 'id generated');
    });
  });

  test('can get both posts', function(t) {
    t.plan(3);

    get('/posts/' + postIds.join(','), function(err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 200);
      t.deepEqual((body && body.posts || []).map(pluck('title')), [
        'My experience with jsonapi',
        'Another post'
      ]);
    });
  });
};
