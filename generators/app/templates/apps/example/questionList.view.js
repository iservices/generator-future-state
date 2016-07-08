import Reng from 'reng';

/**
 * This is the view for displaying a list of questions.
 */
@Reng.Component({
  selector: 'QuestionList',
  template: `<div>
    <div *ngFor="let question of input">
      <b><span id="questionSubjectOut{{question.id}}">{{question.subject}}</span></b> -
         <span id="questionBodyOut{{question.id}}">{{question.body}}</span>
    </div>
  </div>`
})
export default class QuestionList extends Reng.View {
}
