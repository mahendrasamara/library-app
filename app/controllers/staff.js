import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class StaffController extends Controller {
  @service auth;
  @service book;
  @service router;

  @tracked selectedBook = null;
  @tracked studentName = '';
  @tracked statusMessage = '';

  get currentUser() {
    return this.auth.currentUser || { username: 'Staff' };
  }

  get books() {
    return this.book.books;
  }

  get canIssueSelectedBook() {
    return this.selectedBook?.copies_available > 0 && this.studentName.trim().length > 0;
  }

  get cannotIssueSelectedBook() {
    return !this.canIssueSelectedBook;
  }

  get canCollectSelectedBook() {
    return this.selectedBook?.copies_available < this.selectedBook?.copies_total;
  }

  get cannotCollectSelectedBook() {
    return !this.canCollectSelectedBook;
  }

  @action
  selectBook(book) {
    this.selectedBook = book;
    this.statusMessage = '';
  }

  @action
  updateStudentName(event) {
    this.studentName = event.target.value;
  }

  @action
  issueSelectedBook() {
    if (!this.canIssueSelectedBook) {
      return;
    }

    this.book.issueBook(this.selectedBook.isbn);
    this.statusMessage = `"${this.selectedBook.title}" issued to ${this.studentName.trim()}.`;
    this.selectedBook = this.book.getBookByIsbn(this.selectedBook.isbn);
    this.studentName = '';
  }

  @action
  collectSelectedBook() {
    if (!this.canCollectSelectedBook) {
      return;
    }

    this.book.collectBook(this.selectedBook.isbn);
    this.statusMessage = `"${this.selectedBook.title}" collected from student.`;
    this.selectedBook = this.book.getBookByIsbn(this.selectedBook.isbn);
  }

  @action
  handleLogout() {
    this.auth.logout();
    this.router.transitionTo('login');
  }
}
