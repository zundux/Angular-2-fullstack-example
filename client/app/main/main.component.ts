import {Component, OnInit, OnDestroy} from '@angular/core';
import {Http} from '@angular/http';
import {SocketService} from '../../components/socket/socket.service';
import {ThingService} from './thing.service';
// import {ThingService, ThingType} from './thing.service';

// copy from ThingService
class Thing {
  // TODO: use Mongoose model
  // _id: string = '';
  name: string = '';
  info: string = '';
}

@Component({
  selector: 'main',
  template: require('./main.pug'),
  styles: [require('./main.scss')],
})
export default class MainComponent implements OnInit, OnDestroy {
  things = [];
  newThing: Thing;

  static parameters = [Http, SocketService, ThingService];
  private Http: Http;
  private SocketService: SocketService;
  private ThingService: ThingService;

  constructor(_Http_: Http, _SocketService_: SocketService, _ThingService_: ThingService) {
    this.Http = _Http_;
    this.SocketService = _SocketService_;
    this.ThingService = _ThingService_;
  }

  ngOnInit() {
    this.newThing = new Thing();
    this.ThingService.query()
      .subscribe(things => {
        this.things = things;
      });

    // this.SocketService.syncUpdates('thing', this.things);
  }


  ngOnDestroy() {
    this.SocketService.unsyncUpdates('thing');
  }

  addThing() {
    if (this.newThing.name) {
      this.ThingService.create(this.newThing)
        .subscribe(thing => {
          this.things.push(thing);
          this.newThing.name = '';
        });

      // this.Http.post('/api/things', {name: this.newThing});
    }
  }

  deleteThing(thing) {
    this.Http.delete('/api/things/' + thing._id);
  }
}
