import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

// Dummy users — swap for a real API call later
const USERS = [
  { username: 'student1', password: 'pass123', role: 'student' },
  { username: 'librarian1', password: 'pass123', role: 'librarian' },
];

export default class AuthService extends Service {
  @tracked currentUser = null;
  @tracked isAuthenticated = false;

  login(username, password) {
    const user = USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    this.currentUser = user;
    this.isAuthenticated = true;
    return user;
  }

  logout() {
    this.currentUser = null;
    this.isAuthenticated = false;
  }
}