// app/controllers/student.js
import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class StudentController extends Controller {
  @service auth;  // ← Change from 'session' to 'auth'
  @service book;
  @service router;

  @tracked searchQuery = '';

  get currentUser() {
    return this.auth.currentUser || { username: 'Student', name: 'Student' };
  }

  get isAuthenticated() {
    return this.auth.isAuthenticated;
  }

  get books() {
    if (this.searchQuery.trim()) {
      return this.book.searchBooks(this.searchQuery);
    }

    return this.book.books;
  }

  @action
  handleLogout() {
    this.auth.logout();
    this.router.transitionTo('login');
  }

  @action
  handleQuickSearch(event) {
    this.searchQuery = event.target.value;
  }
}
