import Controller from '@ember/controller';
import { service } from '@ember/service';

export default class StudentBorrowedbooksController extends Controller {
  @service auth;
  @service book;

  get currentUser() {
    return this.auth.currentUser || { username: 'Student', name: 'Student' };
  }

  get myLoans() {
    const username = this.currentUser?.username;
    return this.book.loans.filter((loan) => loan.studentName === username);
  }
}
