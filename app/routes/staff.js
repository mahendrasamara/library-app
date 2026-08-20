import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class StaffRoute extends Route {
  @service auth;
  @service book;
  @service router;

  beforeModel() {
    if (!this.auth.isAuthenticated || this.auth.currentUser?.role !== 'librarian') {
      this.router.transitionTo('login');
    }
  }

  model() {
    return this.book.loadBooks();
  }
}
