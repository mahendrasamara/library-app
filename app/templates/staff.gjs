import { pageTitle } from 'ember-page-title';
import { LinkTo } from '@ember/routing';
import ProfileMenu from '../components/profile-menu';
import '../styles/staff.css';

<template>
  {{pageTitle "Staff Dashboard - YourCollegeLibrary"}}

  <header class="staff-header">
    <div class="staff-header-container">
      <div>
        <h1 class="staff-title">Library Staff</h1>
        <span class="staff-greeting">Welcome, {{@controller.currentUser.username}}!</span>
      </div>

      <div class="staff-fine-summary" aria-label="Fine summary">
        <span>Collected: Rs. {{@controller.collectedFineTotal}}</span>
        <span>Yet to collect: Rs. {{@controller.pendingFineTotal}}</span>
      </div>

      <div class="staff-header-actions">
        <LinkTo @route="staff.books" class="staff-nav-link">Books</LinkTo>
        <LinkTo @route="staff.issue" class="staff-nav-link">Issue</LinkTo>
        <LinkTo @route="staff.collect" class="staff-nav-link">Collect</LinkTo>

        <ProfileMenu @username={{@controller.currentUser.username}} @onLogout={{@controller.handleLogout}} />
      </div>
    </div>
  </header>

  {{outlet}}
</template>
