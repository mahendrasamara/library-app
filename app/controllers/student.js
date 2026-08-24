// app/controllers/student.js
import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class StudentController extends Controller {
  @service auth;
  @service book;
  @service router;

  @tracked searchQuery = '';
  @tracked sortBy = 'title';
  @tracked sortOrder = 'asc';
  @tracked selectedGenre = '';
  @tracked selectedYear = '';

  get currentUser() {
    return this.auth.currentUser || { username: 'Student', name: 'Student' };
  }

  get isAuthenticated() {
    return this.auth.isAuthenticated;
  }

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
  handleLogout() {
    this.auth.logout();
    this.router.transitionTo('login');
  }

  @action
  handleQuickSearch(event) {
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

