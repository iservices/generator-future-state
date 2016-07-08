import Reng from 'reng';
import QuestionList from './questionList.view';
import QuestionAdd from './questionAdd.view';
import QuestionReducer from './question.reducer';

/**
 * The view for this app.
 */
@Reng.Component({
  selector: 'QuestionApp',
  template: `<div>
    <QuestionAdd [emitter]="{ type: 'DISPATCH' }"></QuestionAdd>
    <div id="size">Size: {{input.questions.length}}</div>
    <QuestionList [input]="input.questions"></QuestionList>
  </div>`,
  directives: [QuestionAdd, QuestionList],
  reduce: { questions: QuestionReducer }
})
export default class QuestionApp extends Reng.View {
}

Reng.Page.bootstrap(QuestionApp);
