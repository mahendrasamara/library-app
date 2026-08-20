import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class StaffBooksController extends Controller {
  @service book;
  @service router;

  get books() {
    return this.book.books;
  }

  @action
  issueBook(book) {
    this.router.transitionTo('staff.issue', {
      queryParams: {
        isbn: book.isbn,
      },
    });
  }
}
