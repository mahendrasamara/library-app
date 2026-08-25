import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { STUDENTS } from '../../data/studentsdata';

export default class StaffIssueController extends Controller {
  @service book;
  @service router;

  queryParams = ['isbn'];

  @tracked isbn = null;
  @tracked searchQuery = '';
  @tracked selectedStudent = null;
  @tracked statusMessage = '';

  get filteredStudents() {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      return [];
    }

    return STUDENTS.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.phone.includes(query) ||
        s.username.toLowerCase().includes(query)
    );
  }

  get canIssueBook() {
    return this.model?.copies_available > 0 && this.selectedStudent !== null;
  }

  get cannotIssueBook() {
    return !this.canIssueBook;
  }

  @action
  handleSearchInput(event) {
    this.searchQuery = event.target.value;
    this.selectedStudent = null;
  }

  @action
  selectStudent(student) {
    this.selectedStudent = student;
    this.searchQuery = `${student.name} (${student.phone})`;
  }

  @action
  clearSelection() {
    this.selectedStudent = null;
    this.searchQuery = '';
  }

  @action
  async issueBook() {
    if (!this.canIssueBook) {
      return;
    }

    const loan = this.book.issueBook(this.model.isbn, this.selectedStudent.username);
    this.statusMessage = `"${loan.title}" issued to ${this.selectedStudent.name} (${this.selectedStudent.username}).`;
    this.selectedStudent = null;
    this.searchQuery = '';
    await this.router.refresh();
  }
}
