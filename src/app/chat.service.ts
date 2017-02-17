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
      // console.log(' i am in chatservice addRoom');
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

  sendMessage(_roomName: string, _msg: string) {
    const param = {
        roomName : _roomName,
        msg : _msg
      };
    this.socket.emit('sendmsg', param);
  }
  getChat(): Observable<any> {
    let response;
    const observable = new Observable(observer => {
      this.socket.on('updatechat', (room, messageHistory) => {
        // const strArr: string[] = [];
        // for (let x = 0; x < messageHistory.length; x++) {
        //   strArr.push(messageHistory[x]);
        // }
        // observer.next([room, messageHistory]);
        observer.next(response = {roomName: room, messages: messageHistory});
      });
    });
    return observable;
  }
  getUsers(): Observable<any> {
    const observable = new Observable(observer => {
      this.socket.on('updateusers', (room, users, ops) => {
        console.log('service chat: ' , users, ops);
        // console.log('service length: ' , users.length, ops.length);
        // const strArr: string[] = [];
        // for (let x = 0; x < users.length; x++) {
        //   console.log('service push');
        //   strArr.push(users[x]);
        // }
        observer.next(users);
      });
    });
    return observable;
  }

  leaveRoom(roomName: string) {
    // const observable = new Observable(observer => {
    //   console.log(' leaveRoom in service', roomName);
    //   // TODO validate roomName
    //   this.socket.emit('partroom', roomName);
    //   //  {
    //   //   console.log('emitting in leaveroom in service');
    //   //     // observer.next(a);
    //   // };
    // });
    // return observable;
    this.socket.emit('partroom', roomName); // BÆTA VIÐ Observable ??????
  }

  //   getUsers() {
  //   const observable = new Observable(observer => {
  //     this.socket.on('updateusers', (room, users, ops) => {
  //       console.log(users);
  //       // console.log('chat service: ', ' a : ' , a , ' b : ' , b , ' c : ' , c , ' d : ' , d);
  //       observer.next(users);
  //     });
  //     return () => {
  //       this.socket.disconnect();
  //     };
  //   });
  //   return observable;
  // }
}
