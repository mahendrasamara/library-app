import BookCard from '../../components/book-card';
import CatalogToolbar from '../../components/catalog-toolbar';

<template>
  <div class="books-section">
    <div class="section-header-flex">
      <h2 class="section-title">Available Books</h2>
      <span class="books-count-badge">{{@controller.books.length}} books</span>
    </div>

    {{!-- Catalog Toolbar --}}
    <CatalogToolbar
      @searchQuery={{@controller.searchQuery}}
      @onSearch={{@controller.handleSearch}}
      @selectedGenre={{@controller.selectedGenre}}
      @availableGenres={{@controller.availableGenres}}
      @onGenreChange={{@controller.handleGenreChange}}
      @selectedYear={{@controller.selectedYear}}
      @availableYears={{@controller.availableYears}}
      @onYearChange={{@controller.handleYearChange}}
      @sortBy={{@controller.sortBy}}
      @onSortByChange={{@controller.handleSortBy}}
      @sortOrder={{@controller.sortOrder}}
      @onToggleSortOrder={{@controller.toggleSortOrder}}
      @onReset={{@controller.resetFilters}}
    />

    <div class="books-grid">
      {{#each @controller.books as |book|}}
        <BookCard @book={{book}} @genreMap={{@controller.genreMap}} />
      {{else}}
        <p class="no-books">No books found matching your criteria.</p>
      {{/each}}
    </div>
  </div>
</template>
