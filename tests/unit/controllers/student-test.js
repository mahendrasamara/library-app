import { module, test } from 'qunit';
import { setupTest } from 'library-app/tests/helpers';

module('Unit | Controller | student', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:student');
    assert.ok(controller);
  });
});
