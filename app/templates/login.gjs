import { on } from '@ember/modifier';
import '../styles/login.css';

<template>
  <div class="login-page">
    <div class="login-card">
      <h1 class="login-title">Library Login</h1>
      <p class="login-subtitle">Sign in as a student or librarian</p>

      {{#if @controller.errorMessage}}
        <p class="login-error">{{@controller.errorMessage}}</p>
      {{/if}}

      <form class="login-form" {{on "submit" @controller.login}}>
        <div class="form-group">
          <label for="username">Username</label>
          <input id="username" type="text" placeholder="Enter your username"
            value={{@controller.username}} {{on "input" @controller.updateUsername}} />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" type="password" placeholder="Enter your password"
            value={{@controller.password}} {{on "input" @controller.updatePassword}} />
        </div>

        <button type="submit" class="login-button">Log In</button>
      </form>
    </div>
  </div>
</template>