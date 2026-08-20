import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class StudentRoute extends Route {
  @service auth;
  @service book;
  @service router;

  beforeModel() {
    if (!this.auth.isAuthenticated || this.auth.currentUser?.role !== 'student') {
      this.router.transitionTo('login');
    }
  }

  async model() {
    return this.book.loadBooks();
  }
}
