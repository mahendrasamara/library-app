import CatalogController from '../catalog';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class StaffBooksController extends CatalogController {
  @service router;

  @action
  issueBook(book) {
    this.router.transitionTo('staff.issue', {
      queryParams: {
        isbn: book.isbn,
      },
    });
  }
}


