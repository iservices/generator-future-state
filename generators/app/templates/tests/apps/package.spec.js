import * as assert from 'assert';
import testPackage from '../../apps/package';

/**
 * Tests for the package file.
 */
describe('/src/apps/package.js', function () {
  /**
   * Check for reng.
   */
  it('should contain reng module reference.', function () {
    assert.ok(testPackage, 'package is not ok.');
    assert.ok(testPackage.modules, 'package.modules is not ok.');
    let found = false;
    for (let i = 0; i < testPackage.modules.length; i++) {
      if (testPackage.modules[i].require === 'reng') {
        found = true;
        break;
      }
    }
    assert.ok(found, 'reng module not found.');
  });
});
