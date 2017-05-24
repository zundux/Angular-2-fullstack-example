import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {UIRouterModule} from '@uirouter/angular';
import {TooltipModule} from 'ng2-bootstrap';
import {MainComponent} from './main.component';
import {SocketService} from '../../components/socket/socket.service';
import {ThingService} from './thing.service';


export const STATES = [
  {name: 'main', url: '/', component: MainComponent},
];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,

    UIRouterModule.forChild({
      states: STATES,
    }),

    TooltipModule.forRoot(),
  ],
  declarations: [
    MainComponent,
  ],
  providers: [
    SocketService,
    ThingService
  ],
  exports: [
    MainComponent,
  ],
})
export class MainModule {
}
