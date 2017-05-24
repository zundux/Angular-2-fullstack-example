// @flow
import {Component} from '@angular/core';
import {StateService} from '@uirouter/angular';
import {AuthService} from '../../../components/auth/auth.service';
import {ANGULARCLASS_MATCH_CONTROL_DIRECTIVES} from '@angularclass/match-control';


interface User {
  name: string;
  email: string;
  password: string;
}

@Component({
  selector: 'signup',
  template: require('./signup.pug'),
  // directives: [...ANGULARCLASS_MATCH_CONTROL_DIRECTIVES]
})
export class SignupComponent {
  user: User = {
    name: '',
    email: '',
    password: ''
  };
  errors = {};
  submitted = false;
  AuthService;

  StateService;

  static parameters = [AuthService, StateService];

  constructor(_AuthService_: AuthService, _StateService_: StateService) {
    this.AuthService = _AuthService_;
    this.StateService = _StateService_;
  }

  register(form) {
    this.submitted = true;

    return this.AuthService.createUser({
      name: this.user.name,
      email: this.user.email,
      password: this.user.password
    })
      .then(() => {
        // Account created, redirect to home
        this.StateService.go('main');
      })
      .catch(err => {
        err = err.data;
        this.errors = {};
        // Update validity of form fields that match the mongoose errors
        err.errors.forEach((error, field) => {
          // form[field].$setValidity('mongoose', false);
          this.errors[field] = error.message;
        });

      });
  }
}
