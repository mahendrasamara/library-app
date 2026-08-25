import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { STUDENTS } from '../../data/studentsdata';

export default class StaffCollectController extends Controller {
  @service book;

  @tracked viewMode = 'students';
  @tracked statusMessage = '';

  get isStudentView() {
    return this.viewMode === 'students';
  }

  get isBookView() {
    return this.viewMode === 'books';
  }

  get activeLoansCount() {
    return this.book.loans.length;
  }

  get overdueLoansCount() {
    return this.book.loans.filter((loan) => this.book.getFineAmount(loan) > 0).length;
  }

  get pendingFineTotal() {
    return this.book.pendingFineTotal;
  }

  get studentGroups() {
    const groups = new Map();

    this.book.loans.forEach((loan) => {
      const existingLoans = groups.get(loan.studentName) || [];
      groups.set(loan.studentName, [...existingLoans, loan]);
    });

    return Array.from(groups, ([studentKey, loans]) => {
      const studentObj = STUDENTS.find((s) => s.username === studentKey || s.name === studentKey);
      const displayName = studentObj ? `${studentObj.name} (${studentObj.username})` : studentKey;
      return {
        studentName: displayName,
        fineAmount: loans.reduce((total, loan) => total + this.book.getFineAmount(loan), 0),
        loans: loans.map((loan) => this.#formatLoan(loan)),
      };
    });
  }

  get bookLoans() {
    return this.book.loans.map((loan) => this.#formatLoan(loan));
  }

  #formatLoan(loan) {
    const issuedAt =
      typeof loan.issuedAt === 'number'
        ? new Date(loan.issuedAt).toLocaleString()
        : loan.issuedAt;

    const fineAmount = this.book.getFineAmount(loan);
    const overdueMinutes = this.book.getOverdueMinutes(loan);
    const fineLabel = fineAmount > 0 ? `Rs. ${fineAmount}` : 'No fine';

    return { ...loan, fineAmount, fineLabel, issuedAt, overdueMinutes };
  }

  @action
  showStudents() {
    this.viewMode = 'students';
    this.statusMessage = '';
  }

  @action
  showBooks() {
    this.viewMode = 'books';
    this.statusMessage = '';
  }

  @action
  collectLoan(loan) {
    const collectedLoan = this.book.collectBook(loan.id);

    if (collectedLoan) {
      this.statusMessage = `"${collectedLoan.title}" collected from ${collectedLoan.studentName}. Fine collected: Rs. ${collectedLoan.fineAmount}.`;
    }
  }
}
