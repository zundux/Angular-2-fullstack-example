import {Component} from '@angular/core';
import {UserService} from '../../components/auth/user.service';

@Component({
  selector: 'admin',
  template: require('./admin.pug'),
  styles: [require('./admin.scss')],
})
export default class AdminComponent {
  users: Object[];
  UserService;

  static parameters = [UserService];

  constructor(_UserService_: UserService) {
    this.UserService = _UserService_;

    // Use the user service to fetch all users
    this.UserService.query().subscribe(users => {
      this.users = users;
    });
  }

  delete(user) {
    this.UserService.remove(user).subscribe(deletedUser => {
      this.users.splice(this.users.indexOf(deletedUser), 1);
    });
  }
}
