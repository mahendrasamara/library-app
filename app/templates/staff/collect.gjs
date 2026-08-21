import { pageTitle } from 'ember-page-title';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';

<template>
  {{pageTitle "Collect Books - YourCollegeLibrary"}}

  <main class="staff-page">
    <div class="staff-section-header">
      <h2 class="staff-section-title">Collect Books</h2>
      <span class="staff-book-count">{{@controller.activeLoansCount}} active loans</span>
    </div>

    <div class="staff-toolbar">
      <div class="staff-toggle">
        <button type="button" class={{if @controller.isStudentView "staff-toggle-btn active" "staff-toggle-btn"}}
          {{on "click" @controller.showStudents}}> Students </button>
        <button type="button" class={{if @controller.isBookView "staff-toggle-btn active" "staff-toggle-btn"}}
          {{on "click" @controller.showBooks}} > Books </button>
      </div>

      {{#if @controller.isStudentView}}
        <input type="text" class="staff-search-input" placeholder="Search students..."
          value={{@controller.studentSearch}} {{on "input" @controller.updateStudentSearch}} />
      {{else}}
        <input
          type="text" class="staff-search-input" placeholder="Search books..." value={{@controller.bookSearch}}
          {{on "input" @controller.updateBookSearch}} />
      {{/if}}
    </div>

    {{#if @controller.statusMessage}}
      <p class="staff-status">{{@controller.statusMessage}}</p>
    {{/if}}

    {{#if @controller.isStudentView}}
      <section class="staff-list">
        {{#each @controller.studentGroups as |group|}}
          <article class="staff-list-card">
            <div class="staff-list-card-header">
              <h3>{{group.studentName}}</h3>
              <span>{{group.loans.length}} books · Fine Rs. {{group.fineAmount}}</span>
            </div>

            {{#each group.loans as |loan|}}
              <div class="staff-loan-row">
                <div>
                  <strong>{{loan.title}}</strong>
                  <span>
                    By {{loan.author}} · Issued {{loan.issuedAt}} · {{loan.fineLabel}}
                  </span>
                </div>
                <button type="button" class="staff-secondary-btn" {{on "click" (fn @controller.collectLoan loan)}}>
                  Collect
                </button>
              </div>
            {{/each}}
          </article>
        {{else}}
          <p class="staff-empty">No issued books found for students.</p>
        {{/each}}
      </section>
    {{else}}
      <section class="staff-list">
        {{#each @controller.bookLoans as |loan|}}
          <article class="staff-loan-row staff-list-card">
            <div>
              <strong>{{loan.title}}</strong>
              <span>
                {{loan.studentName}} · By {{loan.author}} · Issued {{loan.issuedAt}} ·
                {{loan.fineLabel}}
              </span>
            </div>
            <button type="button" class="staff-secondary-btn" {{on "click" (fn @controller.collectLoan loan)}} >Collect</button>
          </article>
        {{else}}
          <p class="staff-empty">No issued books found.</p>
        {{/each}}
      </section>
    {{/if}}
  </main>
</template>
