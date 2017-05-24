// @flow
import {Component} from '@angular/core';
import {StateService} from '@uirouter/angular';
import {AuthService} from '../../../components/auth/auth.service';

interface User {
  name: string;
  email: string;
  password: string;
}

@Component({
  selector: 'login',
  template: require('./login.pug'),
})
export class LoginComponent {
  user: User = {
    name: '',
    email: '',
    password: '',
  };
  errors = {login: undefined};
  submitted = false;
  AuthService;

  StateService;

  static parameters = [AuthService, StateService];

  constructor(_AuthService_: AuthService, _StateService_: StateService) {
    this.AuthService = _AuthService_;
    this.StateService = _StateService_;
  }

  login() {
    this.submitted = true;

    return this.AuthService.login({
      email: this.user.email,
      password: this.user.password
    })
      .then(() => {
        // Logged in, redirect to home
        this.StateService.go('main');
      })
      .catch(err => {
        this.errors.login = err.message;
      });
  }
}
