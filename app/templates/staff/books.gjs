import { pageTitle } from 'ember-page-title';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import BookCard from '../../components/book-card';

<template>
  {{pageTitle "Staff Books - YourCollegeLibrary"}}

  <main class="staff-page">
    <section>
      <div class="staff-section-header">
        <h2 class="staff-section-title">Books</h2>
        <span class="staff-book-count">{{@controller.books.length}} books</span>
      </div>

      <div class="staff-books-grid">
        {{#each @controller.books key="isbn" as |book|}}
          <button
            type="button"
            class="staff-book-button"
            {{on "click" (fn @controller.issueBook book)}}
          >
            <BookCard @book={{book}} />
          </button>
        {{else}}
          <p class="staff-empty">No books found.</p>
        {{/each}}
      </div>
    </section>
  </main>
</template>
