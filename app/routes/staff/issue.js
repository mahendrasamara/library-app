import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class StaffIssueRoute extends Route {
  @service book;

  queryParams = {
    isbn: {
      refreshModel: true,
    },
  };

  model(params) {
    if (!params.isbn) {
      return null;
    }

    return this.book.fetchBookByIsbn(params.isbn);
  }

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.isbn = null;
      controller.studentName = '';
      controller.statusMessage = '';
    }
  }
}
