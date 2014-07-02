var pluck = require('whisk/pluck');

module.exports = function(url, test) {
  var post = require('./helpers/post')(url);
  var get = require('./helpers/get')(url);
  var peopleIds = [];

  test('can create a new person', function(t) {
    t.plan(3);
    post('/people', { people: [{ name: 'Dave Lister' }] }, function(err, res, body) {
      peopleIds = (body && body.people || []).map(pluck('id'));

      t.ifError(err);
      t.equal(res.statusCode, 201);
      t.ok(peopleIds[0], 'id generated');
    });
  });

  test('can get the newly created person', function(t) {
    t.plan(3);

    get('/people/' + peopleIds[0], function(err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 200);
      t.ok(Array.isArray(body && body.people), 'got posts');
    });
  });

  test('can create a second person', function(t) {
    t.plan(3);
    post('/people', { people: [{ name: 'Arnold Rimmer' }] }, function(err, res, body) {
      peopleIds = peopleIds.concat((body && body.people || []).map(pluck('id')));

      t.ifError(err);
      t.equal(res.statusCode, 201);
      t.ok(peopleIds[1], 'id generated');
    });
  });

  test('can get both people', function(t) {
    t.plan(3);

    get('/people/' + peopleIds.join(','), function(err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 200);
      t.deepEqual((body && body.people || []).map(pluck('name')), [
        'Dave Lister',
        'Arnold Rimmer'
      ]);
    });
  });
};
