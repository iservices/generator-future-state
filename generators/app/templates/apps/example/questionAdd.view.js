import Reng from 'reng';

/**
 * This is the view for adding a new question.
 */
@Reng.Component({
  selector: 'QuestionAdd',
  template: `<div>
    <form>
      <input id="questionSubjectIn" [value]="data.subject" (change)="data.subject = $event.target.value" type="text" placeholder="subject" />
      <input id="questionBodyIn" [value]="data.body" (change)="data.body = $event.target.value" type="text" placeholder="body" />
      <button id="questionCreate" type="button" (click)="handleClick()">Create</button>
    </form>
  </div>`
})
export default class QuestionAdd extends Reng.View {
  /**
   * Initialize this component.
   *
   * @return {void}
   */
  onInit() {
    // initialize the local state for this view
    this.data.subject = '';
    this.data.body = '';
  }

  /**
   * This function gets executed when the user clicks on the questionCreate button.
   * It will read the user input from the local state and dispatch a new action with those values.
   *
   * @returns {void}
   */
  handleClick() {
    // emit an AddQuestion event
    this.emit(
      'AddQuestion',
      {
        subject: this.data.subject,
        body: this.data.body
      }
    );

    // clear out inputs after creating question
    this.data.subject = '';
    this.data.body = '';
  }
}
