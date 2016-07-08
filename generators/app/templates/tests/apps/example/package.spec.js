import * as assert from 'assert';
import testPackage from '../../../apps/example/package';

/**
 * Tests for the package file.
 */
describe('/src/apps/example/package.js', function () {
  /**
   * Check properties from page return.
   */
  it('should contain questions property.', function (done) {
    assert.ok(testPackage, 'package is not ok.');
    assert.ok(testPackage.getPage, 'package.getPage is not ok.');
    testPackage.getPage()
      .then(result => {
        assert.ok(result, 'result is not ok.');
        assert.ok(result.input, 'result.input is not ok.');
        assert.ok(result.input.questions, 'result.input.questions is not ok.');
        done();
      })
      .catch(err => {
        done(err);
      });
  });
});
