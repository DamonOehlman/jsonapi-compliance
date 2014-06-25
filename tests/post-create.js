module.exports = function(url, test) {
  var request = require('supertest')(url);

  test('can create a new post', function(t) {
    t.plan(1);

    request
      .post('/post')
      .send({ title: 'My experience with jsonapi' })
      .expect(201, t.ifError);
  });
};
