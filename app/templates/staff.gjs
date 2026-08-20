import { pageTitle } from 'ember-page-title';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import BookCard from '../components/book-card';
import '../styles/staff.css';

<template>
  {{pageTitle "Staff Dashboard - YourCollegeLibrary"}}

  <header class="staff-header">
    <div class="staff-header-container">
      <div>
        <h1 class="staff-title">Library Staff</h1>
        <span class="staff-greeting">Welcome, {{@controller.currentUser.username}}!</span>
      </div>

      <button type="button" class="staff-logout-btn" {{on "click" @controller.handleLogout}}>
        Logout
      </button>
    </div>
  </header>

  <main class="staff-content">
    <section class="staff-books-section">
      <div class="staff-section-header">
        <h2 class="staff-section-title">Book Inventory</h2>
        <span class="staff-book-count">{{@controller.books.length}} books</span>
      </div>

      <div class="staff-books-grid">
        {{#each @controller.books key="isbn" as |book|}}
          <button
            type="button"
            class="staff-book-button"
            {{on "click" (fn @controller.selectBook book)}}
          >
            <BookCard @book={{book}} />
          </button>
        {{else}}
          <p class="staff-empty">No books found.</p>
        {{/each}}
      </div>
    </section>

    <aside class="staff-action-panel">
      <h2 class="staff-panel-title">Issue / Collect</h2>

      {{#if @controller.selectedBook}}
        <div class="selected-book-summary">
          <h3>{{@controller.selectedBook.title}}</h3>
          <p>By {{@controller.selectedBook.author}}</p>
          <span>
            Available: {{@controller.selectedBook.copies_available}} /
            {{@controller.selectedBook.copies_total}}
          </span>
        </div>

        <label class="staff-label" for="student-name">Student name</label>
        <input
          id="student-name"
          type="text"
          class="staff-input"
          placeholder="Enter student name"
          value={{@controller.studentName}}
          {{on "input" @controller.updateStudentName}}
        />

        <div class="staff-actions">
          <button
            type="button"
            class="staff-primary-btn"
            disabled={{@controller.cannotIssueSelectedBook}}
            {{on "click" @controller.issueSelectedBook}}
          >
            Give to Student
          </button>

          <button
            type="button"
            class="staff-secondary-btn"
            disabled={{@controller.cannotCollectSelectedBook}}
            {{on "click" @controller.collectSelectedBook}}
          >
            Collect from Student
          </button>
        </div>

        {{#if @controller.statusMessage}}
          <p class="staff-status">{{@controller.statusMessage}}</p>
        {{/if}}
      {{else}}
        <p class="staff-empty">Select a book to issue or collect it.</p>
      {{/if}}
    </aside>
  </main>

  {{outlet}}
</template>
