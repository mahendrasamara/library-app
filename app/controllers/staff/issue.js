import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class StaffIssueController extends Controller {
  @service book;

  queryParams = ['isbn'];

  @tracked isbn = null;
  @tracked studentName = '';
  @tracked statusMessage = '';

  get selectedBook() {
    if (!this.isbn) {
      return null;
    }

    return this.book.getBookByIsbn(this.isbn);
  }

  get canIssueBook() {
    return this.selectedBook?.copies_available > 0 && this.studentName.trim().length > 0;
  }

  get cannotIssueBook() {
    return !this.canIssueBook;
  }

  @action
  updateStudentName(event) {
    this.studentName = event.target.value;
  }

  @action
  issueBook() {
    if (!this.canIssueBook) {
      return;
    }

    const loan = this.book.issueBook(this.selectedBook.isbn, this.studentName.trim());
    this.statusMessage = `"${loan.title}" issued to ${loan.studentName}.`;
    this.studentName = '';
  }
}
