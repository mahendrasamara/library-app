import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class StaffIssueController extends Controller {
  @service book;
  @service router;

  queryParams = ['isbn'];

  @tracked isbn = null;
  @tracked studentName = '';
  @tracked phoneNumber = '';
  @tracked statusMessage = '';

  get canIssueBook() {
    return this.model?.copies_available > 0 && this.studentName.trim().length > 0 && this.phoneNumber.trim().length == 10;
  }

  get cannotIssueBook() {
    return !this.canIssueBook;
  }

  @action
  updateStudentName(event) {
    this.studentName = event.target.value;
  }

  @action
  updatePhoneNumber(event){
    this.phoneNumber = event.target.value;
  }

  @action
  async issueBook() {
    if (!this.canIssueBook) {
      return;
    }

    const loan = this.book.issueBook(this.model.isbn, this.studentName.trim());
    this.statusMessage = `"${loan.title}" issued to ${loan.studentName}.`;
    this.studentName = '';
    this.phoneNumber = '';
    await this.router.refresh();
  }
}
