// app/controllers/student.js
import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class StudentController extends Controller {
  @service auth;  // ← Change from 'session' to 'auth'
  @service book;
  @service router;

  get currentUser() {
    return this.auth.currentUser || { username: 'Student', name: 'Student' };
  }

  get isAuthenticated() {
    return this.auth.isAuthenticated;
  }

  get books() {
    return this.book.books;
  }

  @action
  handleLogout() {
    this.auth.logout();
    this.router.transitionTo('login');
  }

  @action
  handleQuickSearch(event) {
    const query = event.target.value;
    if (query.length > 2) {
      this.router.transitionTo('student.search', { queryParams: { q: query } });
    }
  }
}
