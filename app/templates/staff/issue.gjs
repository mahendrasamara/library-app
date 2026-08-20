import { pageTitle } from 'ember-page-title';
import { LinkTo } from '@ember/routing';
import { on } from '@ember/modifier';
import BookCard from '../../components/book-card';

<template>
  {{pageTitle "Issue Book - YourCollegeLibrary"}}

  <main class="staff-page staff-detail-layout">
    {{#if @controller.selectedBook}}
      <section>
        <div class="staff-section-header">
          <h2 class="staff-section-title">Selected Book</h2>
        </div>

        <BookCard @book={{@controller.selectedBook}} />
      </section>

      <section class="staff-action-panel">
        <h2 class="staff-panel-title">Issue Book</h2>

        <div class="selected-book-summary">
          <h3>{{@controller.selectedBook.title}}</h3>
          <p>By {{@controller.selectedBook.author}}</p>
          <span>
            Available: {{@controller.selectedBook.copies_available}} /
            {{@controller.selectedBook.copies_total}}
          </span>
        </div>

        <label class="staff-label" for="issue-student-name">Student name</label>
        <input
          id="issue-student-name"
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
            disabled={{@controller.cannotIssueBook}}
            {{on "click" @controller.issueBook}}
          >
            Issue Book
          </button>
        </div>

        {{#if @controller.statusMessage}}
          <p class="staff-status">{{@controller.statusMessage}}</p>
        {{/if}}
      </section>
    {{else}}
      <section class="staff-action-panel">
        <h2 class="staff-panel-title">No Book Selected</h2>
        <p class="staff-empty">Choose a book from the Books page to issue it.</p>
        <LinkTo @route="staff.books" class="staff-inline-link">Go to Books</LinkTo>
      </section>
    {{/if}}
  </main>
</template>
