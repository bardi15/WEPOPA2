import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})

export class RoomComponent implements OnInit {
  roomId: string;
  messages: string[];
  msg: any;
  text: any[];
  roomUsers: any[];
  messageSend: string;
  constructor(private router: Router,
    private route: ActivatedRoute, private chatService: ChatService) { 
      this.text = [];
      this.roomUsers = [];
    }

  ngOnInit() {
    console.log('nginit');
    const id = this.route.snapshot.params['id'];
    this.roomId = id;
    this.getChat();
    this.getUsers();
  }

  getChat() {
    let msg;
    this.chatService.getChat().subscribe(lst => {
      this.clearArray(this.text);
      // console.log('getChat', lst);
      const roomName = lst['roomName'];
      const messages = lst['messages'];
      // console.log('now roomname is: ' , roomName);
      // if (roomName === this.roomId) {
        for (let i = messages.length - 1; i >= 0; i--) {
          msg = {nick: messages[i]['nick'], timestamp: messages[i]['timestamp'], message: messages[i]['message'],
            initials: messages[i]['nick'].slice(0, 1) };
          this.text.push(msg);
        }
      // } else {
        // this.router.navigate(['rooms', roomName]); // ATH?? GÓÐ LAUSN ??
      // }
    });
  }

  getUsers() {
    this.chatService.getUsers().subscribe(lst => {
      this.clearArray(this.roomUsers);
      // tslint:disable-next-line:forin
      for (const key in lst) {
        this.roomUsers.push(lst[key]);
      }
    });
  }
  clearArray(arr: any[]) {
    while (arr.length > 0) {
      arr.pop();
    }
  }

  postMessage() {
    if (this.messageSend === undefined || this.messageSend.length < 1 || this.messageSend.length > 200) {
      return;
    }
    this.chatService.sendMessage(this.roomId, this.messageSend);

    this.messageSend = '';
  }


  leaveRoom() {
    this.chatService.leaveRoom(this.roomId);
    this.router.navigate(['rooms']);
  }

}
