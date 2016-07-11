/* eslint-env node, mocha */
import * as assert from 'assert';
import Test from 'reng/lib/local/testHarness';
import ExampleView from '../../../apps/example/questionApp.view';

/**
 * Tests for the example application.
 */
describe('/src/apps/example/', function () {
  /**
   * Simple test of the inital page render.
   */
  it('should render as expected and respond dynamically to input.', function (done) {
    Test.run(
      ExampleView,
      { questions: [] },
      {
        store: {
          action: {
            // check for new state after question is added
            AddQuestion: () => {
              // check new values
              assert.equal(Test.getInnerHTML('#size'), 'Size: 1', 'updated size is incorrect.');
              assert.equal(Test.getInnerHTML('#questionSubjectOut1'), 'Test Subject', 'updated question subject is incorrect.');
              assert.equal(Test.getInnerHTML('#questionBodyOut1'), 'Test Body', 'updated question body is incorrect.');
              done();
            }
          }
        }
      })
    .then(() => {
      // check initial size and for the existence of the first question
      assert.equal(Test.getInnerHTML('#size'), 'Size: 0', 'size is not the correct value.');
      assert.ok(!Test.exists('#questionSubjectOut1'), 'question subject exists when it should not.');
      assert.ok(!Test.exists('#questionBodyOut1'), 'question body exists when it should not.');

      // create a new question
      Test.setValue('#questionSubjectIn', 'Test Subject');
      Test.setValue('#questionBodyIn', 'Test Body');
      Test.click('#questionCreate');
    });
  });
});
