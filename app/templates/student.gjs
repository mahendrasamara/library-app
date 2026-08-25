import '../styles/student.css';
import ProfileMenu from '../components/profile-menu';
import { pageTitle } from 'ember-page-title';
import { LinkTo } from '@ember/routing';

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
        </div>
      </div>
      
      <div class="header-actions">
        <div class="user-menu">
          <LinkTo @route="student.books" class="student-nav-link">Library Books</LinkTo>
          <LinkTo @route="student.borrowedbooks" class="student-nav-link">
            My Books
            <span class="nav-count-badge">{{@controller.myLoansCount}}</span>
          </LinkTo>
          <ProfileMenu @username={{@controller.currentUser.username}} @onLogout={{@controller.handleLogout}} />
        </div>
      </div>
    </div>
  </header>

  {{!-- Main Content --}}
  <main class="student-content">
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
