import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class StaffCollectController extends Controller {
  @service book;

  @tracked viewMode = 'students';
  @tracked studentSearch = '';
  @tracked bookSearch = '';
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

  get studentGroups() {
    const searchTerm = this.studentSearch.trim().toLowerCase();
    const groups = new Map();

    this.book.loans.forEach((loan) => {
      if (searchTerm && !loan.studentName.toLowerCase().includes(searchTerm)) {
        return;
      }

      const existingLoans = groups.get(loan.studentName) || [];
      groups.set(loan.studentName, [...existingLoans, loan]);
    });

    return Array.from(groups, ([studentName, loans]) => ({
      studentName,
      loans: loans.map((loan) => this.#formatLoan(loan)),
    }));
  }

  get bookLoans() {
    const searchTerm = this.bookSearch.trim().toLowerCase();

    return this.book.loans
      .filter((loan) => {
        if (!searchTerm) {
          return true;
        }

        return (
          loan.title.toLowerCase().includes(searchTerm) ||
          loan.author.toLowerCase().includes(searchTerm)
        );
      })
      .map((loan) => this.#formatLoan(loan));
  }

  #formatLoan(loan) {
    const issuedAt =
      typeof loan.issuedAt === 'number'
        ? new Date(loan.issuedAt).toLocaleString()
        : loan.issuedAt;

    return { ...loan, issuedAt };
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
  updateStudentSearch(event) {
    this.studentSearch = event.target.value;
  }

  @action
  updateBookSearch(event) {
    this.bookSearch = event.target.value;
  }

  @action
  collectLoan(loan) {
    const collectedLoan = this.book.collectBook(loan.id);

    if (collectedLoan) {
      this.statusMessage = `"${collectedLoan.title}" collected from ${collectedLoan.studentName}.`;
    }
  }
}
