import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import '../styles/profile-menu.css';

export default class ProfileMenu extends Component {
  @tracked isOpen = false;

  @action
  toggle() {
    this.isOpen = !this.isOpen;
  }

  @action
  logout() {
    this.isOpen = false;
    this.args.onLogout();
  }

  <template>
    <div class="profile-menu">
      <button type="button" class="profile-icon-btn" aria-label="Open profile menu" {{on "click" this.toggle}}>
        👤
      </button>

      {{#if this.isOpen}}
        <div class="profile-dropdown">
          <span class="profile-dropdown-name">{{@username}}</span>
          <button type="button" class="profile-logout-btn" {{on "click" this.logout}}>
            Logout
          </button>
        </div>
      {{/if}}
    </div>
  </template>
}
