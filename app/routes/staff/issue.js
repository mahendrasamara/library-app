import Route from '@ember/routing/route';

export default class StaffIssueRoute extends Route {
  queryParams = {
    isbn: {
      refreshModel: false,
    },
  };
}
