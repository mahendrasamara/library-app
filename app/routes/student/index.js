import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class StudentIndexRoute extends Route {
  @service router;

  beforeModel() {
    this.router.transitionTo('student.books');
  }
}
