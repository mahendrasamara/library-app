import Controller from '@ember/controller';
import { service } from '@ember/service';

export default class StudentBorrowedbooksController extends Controller {
  @service auth;
  @service book;

  get currentUser() {
    return this.auth.currentUser || { username: 'student1', name: 'Alice Smith' };
  }

  get myLoans() {
    const user = this.currentUser;
    return this.book.loans
      .filter((loan) => loan.studentName === user?.username || loan.studentName === user?.name)
      .map((loan) => {
        const issuedAt =
          typeof loan.issuedAt === 'number'
            ? new Date(loan.issuedAt).toLocaleString()
            : loan.issuedAt;
        const fineAmount = this.book.getFineAmount(loan);
        return { ...loan, issuedAt, fineAmount };
      });
  }
}
