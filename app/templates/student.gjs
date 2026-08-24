import '../styles/student.css';
import BookCard from '../components/book-card';
import ProfileMenu from '../components/profile-menu';
import CatalogToolbar from '../components/catalog-toolbar';
import { pageTitle } from 'ember-page-title';

<template>
  {{pageTitle "Student Dashboard - YourCollegeLibrary"}}

  {{!-- Student Header --}}
  <header class="student-header">
    <div class="header-container">
      <div class="brand-section">
        <div class="logo">📚</div>
        <div class="brand-text">
          <h1 class="site-title">YourCollegeLibrary</h1>
          <span class="user-greeting">Welcome, {{@controller.currentUser.username}}!</span>
        </div>
      </div>
      
      <div class="header-actions">
        <div class="user-menu">
          <span class="badge student-badge">Student</span>
          <ProfileMenu @username={{@controller.currentUser.username}} @onLogout={{@controller.handleLogout}} />
        </div>
      </div>
    </div>
  </header>

  {{!-- Main Content --}}
  <main class="student-content">
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
    {{outlet}}
  </main>


  {{!-- Student Footer --}}
  <footer class="student-footer">
    <div class="footer-container">
      <p>&copy; 2024 YourCollegeLibrary. All rights reserved.</p>
      <div class="footer-links">
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
        <a href="#help">Help</a>
      </div>
    </div>
  </footer>
</template>
