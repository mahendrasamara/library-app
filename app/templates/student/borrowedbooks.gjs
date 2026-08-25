import { pageTitle } from 'ember-page-title';

<template>
  {{pageTitle "My Borrowed Books - YourCollegeLibrary"}}

  <div class="books-section">
    <div class="section-header-flex">
      <h2 class="section-title">My Borrowed Books</h2>
      <span class="books-count-badge">{{@controller.myLoans.length}} borrowed</span>
    </div>

    <div class="books-grid">
      {{#each @controller.myLoans as |loan|}}
        <div class="book-card" style="padding: 1.25rem;">
          <div class="book-card-header">
            <h3 class="book-title">{{loan.title}}</h3>
            <p class="book-author">By {{loan.author}}</p>
          </div>
          <div class="book-details" style="margin-top: 0.75rem; font-size: 0.875rem; color: #64748b; display: flex; flex-direction: column; gap: 0.25rem;">
            <p><strong>ISBN:</strong> {{loan.isbn}}</p>
            <p><strong>Issued At:</strong> {{loan.issuedAt}}</p>
            {{#if loan.fineAmount}}
              <p style="color: #ef4444; font-weight: 600;"><strong>Fine Due:</strong> Rs. {{loan.fineAmount}}</p>
            {{else}}
              <p style="color: #10b981;"><strong>Status:</strong> Issued (No fine)</p>
            {{/if}}
          </div>
        </div>
      {{else}}
        <p class="no-books">You currently have no borrowed books.</p>
      {{/each}}
    </div>
  </div>
</template>
