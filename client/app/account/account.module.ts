import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {UIRouterModule} from '@uirouter/angular';
import {DirectivesModule} from '../../components/directives.module';
import {STATES} from './account.routes';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {SettingsComponent} from './settings/settings.component';

@NgModule({
  imports: [
    FormsModule,
    UIRouterModule.forChild({
      states: STATES,
    }),

    DirectivesModule,
  ],
  declarations: [
    LoginComponent,
    SignupComponent,
    SettingsComponent,
  ],
})
export default class AccountModule {
}
