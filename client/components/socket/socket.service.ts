'use strict';
import {Injectable} from '@angular/core';
import {noop, find, remove} from 'lodash';
import constants from '../../app/app.constants';
const io = require('socket.io-client');

@Injectable()
export class SocketService {
  socket;

  constructor() {
    this.socket = io(constants.env === 'development' ? `localhost:${constants.port}` : '', {
      // Send auth token on connection, you will need to DI the Auth service above
      // 'query': 'token=' + Auth.getToken()
    });
  }

  /**
   * Register listeners to sync an array with updates on a model
   *
   * Takes the array we want to sync, the model name that socket updates are sent from,
   * and an optional callback function after new items are updated.
   *
   * @param {String} modelName
   * @param {Array} array
   * @param {Function} cb
   */
  syncUpdates(modelName, array, cb = noop) {
    /**
     * Syncs item creation/updates on 'model:save'
     */
    this.socket.on(`${modelName}:save`, function(item) {
      let oldItem = find(array, {_id: item._id});
      let index = array.indexOf(oldItem);
      let event = 'created';

      // replace oldItem if it exists
      // otherwise just add item to the collection
      if (oldItem) {
        array.splice(index, 1, item);
        event = 'updated';
      } else {
        array.push(item);
      }

      cb(event, item, array);
    });

    /**
     * Syncs removed items on 'model:remove'
     */
    this.socket.on(`${modelName}:remove`, function(item) {
      let event = 'deleted';
      remove(array, {_id: item._id});
      cb(event, item, array);
    });
  }

  /**
   * Removes listeners for a models updates on the socket
   *
   * @param modelName
   */
  unsyncUpdates(modelName) {
    this.socket.removeAllListeners(`${modelName}:save`);
    this.socket.removeAllListeners(`${modelName}:remove`);
  }
}
