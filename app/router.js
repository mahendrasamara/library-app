import EmberRouter from '@embroider/router';
import config from 'library-app/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('login');

  // this.route('student');
  this.route('student', function () {
    this.route('search');
  });

  this.route('staff');
});
