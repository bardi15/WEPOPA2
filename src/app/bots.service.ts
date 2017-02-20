import { Injectable } from '@angular/core';
import { ChatService } from './chat.service';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class BotsService {
  private data = 'https://jsonplaceholder.typicode.com/';
  socketList: any[];
  converse: string[];
  users: string[];
  chatRooms: string[];
  botsAreActive: boolean;
  constructor(private http: Http) {
    this.socketList = [];
    this.converse = [];
    this.users = ['Leanne Graham', 'Ervin Howell', 'Clementine Bauch', 'Patricia Lebsack',
      'Chelsey Dietrich', 'Mrs. Dennis Schulist', 'Kurtis Weissnat', 'Glenna Reichert', 'Clementina DuBuque'];
    this.chatRooms = ['Warcraft chat', 'Russia Only', 'Left 4 Dead', 'Fork in the Road'];
    this.botsAreActive = false;
  }

  initiate() {
    for (const x in this.users) {
      let instance = this.newSocket();
      this.login(this.users[x], instance);
      let room = this.joinChats(instance);
      this.socketList.push({ instance: instance, room: room });
    }
    this.botsAreActive = true;
  }

  botStatus(): boolean {
    return this.botsAreActive;
  }

  botPosts() {
    this.getData('posts').then(data => {
      let posts = [];
      for (let x in data) {
        posts.push(data[x]['title']);
        posts.push(data[x]['body']);
      };
      this.randomMessageSend(posts);
    });
  }

  addOneBotToRoom(roomName: string) {
    let name = 'BOT_' + this.makeid();
    let instance = this.newSocket();
    this.login(name, instance);
    this.createRoom(roomName, instance);
    this.socketList.push({ instance: instance, room: roomName });
  }

  makeid(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  randomMessageSend(posts: string[]) {
    if (this.socketList.length > 0) {
      let count = Math.floor(Math.random() * 60 * 30);
      setTimeout(() => {
        let instance = this.socketList[Math.floor(Math.random() * this.socketList.length)];
        if (instance.room !== undefined || instance.instance !== undefined) {
          let message = posts[Math.floor(Math.random() * posts.length)];
          this.sendMessages(instance.room, message, instance.instance);
        }
      }, count);
    }
  }

  joinChats(instance: any) {
    let room = this.chatRooms[Math.floor(Math.random() * this.chatRooms.length)];
    this.createRoom(room, instance);
    return room;
  }

  loginBots() {
    let instance = this.newSocket();
    for (const x in this.users) {
      this.login(this.users[x], instance);
      let room = this.chatRooms[Math.floor(Math.random() * this.chatRooms.length)];
      this.createRoom(room, instance);
    };
  }

  getData(part: string): any {
    return this.http.get(this.data + part)
      .map(this.extractData).toPromise();
  }

  private extractData(res: Response) {
    let body = res.json();
    let arr = [];
    for (const x in body) {
      arr.push(body[x]);
    }
    return arr;
  }

  newSocket() {
    let socket;
    socket = io('http://localhost:8080/');
    socket.on('connect', function () {
    });
    return socket;
  }

  login(userName: string, socket: any) {
    socket.emit('adduser', userName, succeeded => {
    });
  }

  createRoom(roomName: string, socket: any) {
    socket.emit('joinroom', {room: roomName}, (a, b) => {
    });
  }

  sendMessages(roomName: string, message: string, socket: any) {
    const param = {
      roomName: roomName,
      msg: message
    };
    socket.emit('sendmsg', param);
  }
}
