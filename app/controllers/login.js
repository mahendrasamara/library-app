import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class LoginController extends Controller {
  @service auth;
  @service router;

  @tracked username = '';
  @tracked password = '';
  @tracked errorMessage = '';

  @action
  updateUsername(event) {
    this.username = event.target.value;
  }

  @action
  updatePassword(event) {
    this.password = event.target.value;
  }

  @action
  login(event) {
    event.preventDefault();
    try {
      const user = this.auth.login(this.username, this.password);
      this.errorMessage = '';
      this.router.transitionTo(user.role === 'student' ? 'student' : 'librarian');
    } catch (e) {
      this.errorMessage = 'Invalid username or password';
    }
  }
}