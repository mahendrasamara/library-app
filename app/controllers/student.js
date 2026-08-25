import CatalogController from './catalog';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class StudentController extends CatalogController {
  @service auth;
  @service router;

  get currentUser() {
    return this.auth.currentUser || { username: 'Student', name: 'Student' };
  }

  get isAuthenticated() {
    return this.auth.isAuthenticated;
  }

  get myLoans() {
    const username = this.currentUser?.username;
    return this.book.loans.filter((loan) => loan.studentName === username);
  }

  @action
  handleLogout() {
    this.auth.logout();
    this.router.transitionTo('login');
  }
}


