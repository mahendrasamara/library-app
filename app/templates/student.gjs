// app/templates/student.gjs
import '../styles/student.css';
import BookCard from '../components/book-card';
import ProfileMenu from '../components/profile-menu';
import { pageTitle } from 'ember-page-title';
import { on } from '@ember/modifier';

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
          {{!-- Or use: {{this.currentUser.name}} if you have a name field --}}
        </div>
      </div>
      
      <div class="header-actions">
        <div class="quick-search">
          <input 
            type="text" 
            placeholder="Search books..." 
            class="search-input"
            value={{@controller.searchQuery}}
            {{on "input" @controller.handleQuickSearch}}
          />
          <span class="search-icon">🔍</span>
        </div>
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
      <h2 class="section-title">Available Books</h2>
      <div class="books-grid">
        {{#each @controller.books as |book|}}
          <BookCard @book={{book}} />
        {{else}}
          <p class="no-books">No books found.</p>
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
