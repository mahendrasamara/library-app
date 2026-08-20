import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

// Dummy users — swap for a real API call later
const USERS = [
  { username: 'student1', password: 'pass123', role: 'student' },
  { username: 'librarian1', password: 'pass123', role: 'librarian' },
];

const AUTH_STORAGE_KEY = 'library-app-current-user';

export default class AuthService extends Service {
  @tracked currentUser = null;
  @tracked isAuthenticated = false;

  constructor() {
    super(...arguments);
    this.restoreSession();
  }

  restoreSession() {
    const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);

    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
      this.isAuthenticated = true;
    }
  }

  login(username, password) {
    const user = USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    this.currentUser = user;
    this.isAuthenticated = true;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));

    return user;
  }

  logout() {
    this.currentUser = null;
    this.isAuthenticated = false;
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}
