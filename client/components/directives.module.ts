import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UIRouterModule} from '@uirouter/angular';
import {CollapseModule} from 'ng2-bootstrap';
import {AuthModule} from './auth/auth.module';
import {NavbarComponent} from './navbar/navbar.component';
import {FooterComponent} from './footer/footer.component';
import {OauthButtonsComponent} from './oauth-buttons/oauth-buttons.component';

@NgModule({
  imports: [
    CommonModule,
    UIRouterModule.forChild(),
    CollapseModule,
    AuthModule,
  ],
  declarations: [
    NavbarComponent,
    FooterComponent,
    OauthButtonsComponent,
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    OauthButtonsComponent,
  ]
})
export class DirectivesModule {
}
