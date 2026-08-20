// app/templates/student.gjs
import '../styles/student.css';
import BookCard from '../components/book-card';
import { pageTitle } from 'ember-page-title';
import { LinkTo } from '@ember/routing';
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
            {{on "keyup" @controller.handleQuickSearch}}
          />
          <span class="search-icon">🔍</span>
        </div>
        <div class="user-menu">
          <span class="badge student-badge">Student</span>
          <button type="button" class="logout-btn" {{on "click" @controller.handleLogout}}>
            Logout
          </button>
        </div>
      </div>
    </div>
  </header>

  {{!-- Student Navigation --}}
  <nav class="student-nav">
    <div class="nav-container">
      <ul class="nav-menu">
        <li class="nav-item">
          <LinkTo @route="student" class="nav-link">
            📊 Dashboard
          </LinkTo>
        </li>
        <li class="nav-item">
          <LinkTo @route="student" class="nav-link">
            📚 Browse Books
          </LinkTo>
        </li>
        <li class="nav-item">
          <a href="#search" class="nav-link">
            🔍 Advanced Search
          </a>
        </li>
        <li class="nav-item">
          <a href="#borrowings" class="nav-link">
            📖 My Borrowings
          </a>
        </li>
        <li class="nav-item">
          <a href="#favorites" class="nav-link">
            ❤️ Favorites
          </a>
        </li>
        <li class="nav-item">
          <a href="#account" class="nav-link">
            👤 My Account
          </a>
        </li>
      </ul>
    </div>
  </nav>

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
