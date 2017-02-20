import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ChatService {
  socket: any;
  currUser: string;
  // selectedUser: string;

  constructor() {
    this.socket = io('http://localhost:8080/');
    this.socket.on('connect', function () {
    });
  }

  login(userName: string): Observable<boolean> {
    this.currUser = userName;
    // this.selectedUser = '';
    const observable = new Observable(observer => {
      this.socket.emit('adduser', userName, succeeded => {
        observer.next(succeeded);
      });
    });
    return observable;
  }

  getRoomList(): Observable<string[]> {
    const obs = new Observable(observer => {
      this.socket.emit('rooms');
      this.socket.on('roomlist', (lst) => {
        const rmArr: any[] = [];
        for (const x in lst) {
          if (lst.hasOwnProperty(x)) {
            const val = lst[x];
            const rooms = { name: x, banned: val['banned'], locked: val['locked'], ops: val['ops'], password: val['password'], topic: val['topic'], users: val['users'] };
            rmArr.push(rooms);
          }
        }
        observer.next(rmArr);
      });
    });
    return obs;
  }

  addRoom(roomName: string): Observable<boolean> {
    const observable = new Observable(observer => {
      const param = {
        room: roomName
      };
      this.socket.emit('joinroom', param, (a, b) => {
        observer.next(a);
      });
    });
    return observable;
  }

  sendMessage(_roomName: string, _msg: string) {
    const param = {
      roomName: _roomName,
      msg: _msg
    };
    this.socket.emit('sendmsg', param);
  }

  getChat(currRoom: string): Observable<any> {
    let response;
    const observable = new Observable(observer => {
      this.socket.on('updatechat', (room, messageHistory) => {
        if (currRoom === room) {
          for (const x in room) {
          }
          observer.next(response = { roomName: room, messages: messageHistory });
        }
      });
    });
    return observable;
  }

  getUsers(): Observable<any> {
    this.socket.emit('users');
    const observable = new Observable(observer => {
      this.socket.on('updateusers', (room, users, ops) => {
        observer.next({ room: room, users: users, ops: ops });
      });
    });
    return observable;
  }

  serverEmitUsers() {
    this.socket.emit('users');
  }

  disconnect() {
    this.socket.emit('disconnect');
  }

  getAllUsers(): Observable<string[]> {
    const observable = new Observable(observer => {
      this.socket.on('userlist', lst => {
        const strArr: string[] = [];
        for (const x in lst) {
          if (lst.hasOwnProperty(x)) {
            strArr.push(lst[x]);
          }
        }
        observer.next(strArr);
      });
    });
    return observable;
  }

  leaveRoom(roomName: string) {
    if (roomName !== undefined) {
      this.socket.emit('partroom', roomName);
    }
  }

  sendPrvMessage(_msg: string, _nick: string) {
    if (_nick.length < 1) {
      return;
    }
    const param = {
      nick: _nick,
      message: _msg
    };
    this.socket.emit('privatemsg', param, (a, b) => {
    });
  }

  getPrvMessage(): Observable<any> {
    let response;
    const observable = new Observable(observer => {
      this.socket.on('recv_privatemsg', (userName, message) => {
        observer.next(response = { username: userName, messages: message });
      });
    });
    return observable;
  }

  kickUser(_roomName: string, _user: string) {
    const param = {
      room: _roomName,
      user: _user['nick']
    };
    this.socket.emit('kick', param, (a, b) => {
    });
  }

  banUser(_roomName: string, _user: string) {
    const param = {
      room: _roomName,
      user: _user['nick']
    };
    this.socket.emit('ban', param, (a, b) => {
    });
  }

  getTopic(): Observable<any> {
    const observable = new Observable(observer => {
      this.socket.on('updatetopic', (room, topic, username) => {
        observer.next({ room: room, topic: topic, username: username });
      });
    });
    return observable;
  }

  setTopic(_roomName: string, _topic: string) {
    const param = {
      room: _roomName,
      topic: _topic
    };
    this.socket.emit('settopic', param, (a, b) => {
    });
  }
}
