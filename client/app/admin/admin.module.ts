import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {UIRouterModule} from '@uirouter/angular';
import {AdminComponent} from './admin.component';
import {STATES} from './admin.routes';

@NgModule({
  imports: [
    BrowserModule,

    UIRouterModule.forChild({
      states: STATES,
    }),
  ],
  declarations: [
    AdminComponent,
  ],
  exports: [
    AdminComponent,
  ],
})
export default class AdminModule {
}
