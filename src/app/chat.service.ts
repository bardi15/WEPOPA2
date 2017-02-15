import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ChatService {
  socket: any;

  constructor() {
    this.socket = io('http://localhost:8080/');
    this.socket.on('connect', function() {
      // console.log('connect');
    });
  }

  login(userName: string): Observable<boolean> {
    const observable = new Observable(observer => {
      this.socket.emit('adduser', userName, succeeded => {
        // console.log('Reply received in chat service');
        observer.next(succeeded);
      });
    });
    return observable;
  }

  getRoomList(): Observable<string[]> {
    const obs = new Observable(observer => {
      this.socket.emit('rooms');
      this.socket.on('roomlist', (lst) => {
        const strArr: string[] = [];
        for (const x in lst) {
          if (lst.hasOwnProperty(x)) {
            strArr.push(x);
          }
        }
        observer.next(strArr);
      })
    });
    return obs;
  }

  addRoom(roomName: string): Observable<boolean> {
    const observable = new Observable(observer => {
      // TODO validate roomName
      const param = {
        room : roomName
      };
      this.socket.emit('joinroom', param, (a, b) => {
          observer.next(a);
      });
    });
    return observable;
  }

  sendMessage(_roomName : string, _msg : string) {
    const param = {
        roomName : _roomName,
        msg : _msg
      };
    this.socket.emit('sendmsg', param);
  }
  getChat(): Observable<any> {
    const observable = new Observable(observer => {
      this.socket.on('updatechat', (a, b) => {
        const strArr: string[] = [];
        for (let x = 0; x < b.length; x++) {
          strArr.push(b[x]);
        }
        observer.next(strArr);
      });
    });
    return observable;
  }

}