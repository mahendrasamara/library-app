import { pageTitle } from 'ember-page-title';
import { LinkTo } from '@ember/routing';
import { on } from '@ember/modifier';
import '../styles/staff.css';

<template>
  {{pageTitle "Staff Dashboard - YourCollegeLibrary"}}

  <header class="staff-header">
    <div class="staff-header-container">
      <div>
        <h1 class="staff-title">Library Staff</h1>
        <span class="staff-greeting">Welcome, {{@controller.currentUser.username}}!</span>
      </div>

      <div class="staff-header-actions">
        <LinkTo @route="staff.books" class="staff-nav-link">Books</LinkTo>
        <LinkTo @route="staff.issue" class="staff-nav-link">Issue</LinkTo>
        <LinkTo @route="staff.collect" class="staff-nav-link">Collect</LinkTo>

        <button type="button" class="staff-logout-btn" {{on "click" @controller.handleLogout}}>
          Logout
        </button>
      </div>
    </div>
  </header>

  {{outlet}}
</template>
