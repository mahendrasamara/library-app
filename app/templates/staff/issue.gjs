import { pageTitle } from 'ember-page-title';
import { LinkTo } from '@ember/routing';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';

<template>
  {{pageTitle "Issue Book - YourCollegeLibrary"}}

  <main class="staff-page staff-detail-layout">
    {{#if @model}}
      
      <section class="staff-action-panel">
        <h2 class="staff-panel-title">Issue Book</h2>

        <div class="selected-book-summary">
          <h3>{{@model.title}}</h3>
          <p>By {{@model.author}}</p>
          <span>
            Available: {{@model.copies_available}} /
            {{@model.copies_total}}
          </span>
        </div>

        <label class="staff-label" for="issue-student-search">Search Student (Name or Phone)</label>
        <div style="position: relative;">
          <input
            class="staff-input"
            id="issue-student-search"
            type="text"
            placeholder="Type student name or phone number..."
            value={{@controller.searchQuery}}
            {{on "input" @controller.handleSearchInput}}
          />

          {{#if @controller.selectedStudent}}
            <div class="selected-student-card" style="margin-top: 0.5rem; padding: 0.75rem; background: #f1f5f9; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong>{{@controller.selectedStudent.name}}</strong> ({{@controller.selectedStudent.username}})<br />
                <span style="font-size: 0.85rem; color: #64748b;">Phone: {{@controller.selectedStudent.phone}}</span>
              </div>
              <button type="button" style="background: none; border: none; color: #ef4444; font-weight: 600; cursor: pointer;" {{on "click" @controller.clearSelection}}>Change</button>
            </div>
          {{else if @controller.searchQuery}}
            <ul class="student-search-results" style="margin-top: 0.5rem; list-style: none; padding: 0; border: 1px solid #cbd5e1; border-radius: 6px; max-height: 180px; overflow-y: auto; background: #ffffff;">
              {{#each @controller.filteredStudents as |student|}}
                <li style="padding: 0.5rem 0.75rem; border-bottom: 1px solid #f1f5f9; cursor: pointer; display: flex; justify-content: space-between;" {{on "click" (fn @controller.selectStudent student)}}>
                  <span><strong>{{student.name}}</strong> ({{student.username}})</span>
                  <span style="color: #64748b; font-size: 0.85rem;">{{student.phone}}</span>
                </li>
              {{else}}
                <li style="padding: 0.5rem 0.75rem; color: #94a3b8;">No student found matching "{{@controller.searchQuery}}".</li>
              {{/each}}
            </ul>
          {{/if}}
        </div>

        <div class="staff-actions" style="margin-top: 1rem;">
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
