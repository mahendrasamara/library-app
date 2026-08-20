import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class IndexRoute extends Route {
  @service auth;
  @service router;

  beforeModel() {
    if (this.auth.isAuthenticated) {
      this.router.transitionTo(this.auth.currentUser?.role === 'student' ? 'student' : 'staff');
    } else {
      this.router.transitionTo('login');
    }
  }
}
