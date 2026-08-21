import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class StaffController extends Controller {
  @service auth;
  @service book;
  @service router;

  get currentUser() {
    return this.auth.currentUser || { username: 'Staff' };
  }

  get collectedFineTotal() {
    return this.book.collectedFineTotal;
  }

  get pendingFineTotal() {
    return this.book.pendingFineTotal;
  }

  @action
  handleLogout() {
    this.auth.logout();
    this.router.transitionTo('login');
  }
}
