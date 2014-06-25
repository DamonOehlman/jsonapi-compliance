module.exports = function(url, test) {
  var request = require('supertest')(url);

  test('can create a new post', function(t) {
    t.plan(2);

    request
      .post('/post')
      .send({ title: 'My experience with jsonapi' })
      .expect(201)
      .end(function(err, res) {
        t.ifError(err);
        t.ok(res.body && res.body.id, 'id generated');
      });
  });
};
