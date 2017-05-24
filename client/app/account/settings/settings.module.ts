import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {UIRouterModule} from '@uirouter/angular';
import {LoginComponent} from './login.component';
import {STATES} from './login.routes';

@NgModule({
  imports: [
    BrowserModule,

    UIRouterModule.forChild({
      states: STATES,
    }),
  ],
  declarations: [
    LoginComponent,
  ],
  exports: [
    LoginComponent,
  ],
})
export default class LoginModule {
}
