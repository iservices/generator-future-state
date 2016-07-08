import Reng from 'reng';

/**
 * A reducer that is used to add new questions to the application state in response to an action.
 */
export default class QuestionReducer extends Reng.Reducer {
  /**
   * Initialize reducer.
   *
   * @return {void}
   */
  onInit() {
    this.mQuestionIdNext = 0;
  }

  /**
   * Create a new state in response to an event with event.type === 'AddAction' being dispatched.
   *
   * @param {Object} state - The current state of the application.  Always treat this object as immutable.
   * @param {Object} event - The event to process on the state.
   * @return {Object} The new state of the application after processing the given event.
   */
  actionAddQuestion(state, event) {
    // state is expected to be an array of existing questions.
    // since state is treated as immutable we return a new array instance
    // instead of pushing the new question onto the existing array.
    return [...state, {
      id: ++this.mQuestionIdNext,
      subject: event.args.subject,
      body: event.args.body
    }];
  }
}
