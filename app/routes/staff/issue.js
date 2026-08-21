import Route from '@ember/routing/route';

export default class StaffIssueRoute extends Route {
  
  resetController(controller, isExiting) {
    if (isExiting) {
      // console.log(controller.isbn);
      controller.isbn = null;
      controller.studentName = '';
      controller.statusMessage = '';
    }
  }
}
