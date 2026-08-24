import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class StaffBooksController extends Controller {
  @service book;
  @service router;

  @tracked searchQuery = '';
  @tracked sortBy = 'title';
  @tracked sortOrder = 'asc';
  @tracked selectedGenre = '';
  @tracked selectedYear = '';

  get availableYears() {
    return this.book.availableYears;
  }

  get availableGenres() {
    return this.book.availableGenres;
  }

  get genreMap() {
    return this.book.genreMap;
  }


  get books() {
    return this.book.getFilteredAndSortedBooks({
      searchQuery: this.searchQuery,
      genreId: this.selectedGenre,
      publicationYear: this.selectedYear,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
    });
  }

  @action
  issueBook(book) {
    this.router.transitionTo('staff.issue', {
      queryParams: {
        isbn: book.isbn,
      },
    });
  }

  @action
  handleSearch(event) {
    this.searchQuery = event.target.value;
  }

  @action
  handleSortBy(event) {
    this.sortBy = event.target.value;
  }

  @action
  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  }

  @action
  handleGenreChange(event) {
    this.selectedGenre = event.target.value;
  }

  @action
  handleYearChange(event) {
    this.selectedYear = event.target.value;
  }

  @action
  resetFilters() {
    this.searchQuery = '';
    this.selectedGenre = '';
    this.selectedYear = '';
    this.sortBy = 'title';
    this.sortOrder = 'asc';
  }
}

