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
    // this.chatService.addRoom(id);
    this.getChat();
    this.getUsers();
  }

  getChat() {
    let msg;
    this.chatService.getChat().subscribe(lst => {
      this.clearArray();
      // console.log('getChat OF ARRAY: ' , this.text.length);
      for (const msgObj of lst) {
        msg = {nick: msgObj['nick'], timestamp: msgObj['timestamp'], message: msgObj['message']}
          this.text.push(msg);
        };
      });
  }

  getUsers() {
    this.chatService.getUsers().subscribe(lst => {
      console.log('room component users: ' , lst);
      // tslint:disable-next-line:forin
      for (const key in lst) {
        this.roomUsers.push(lst[key]);
      }
    });
  }
  // getUsers() {
  //   this.chatService.getUsers().subscribe(usr => {
  //     this.roomUsers.push(usr);
  //   });
  // }

  clearArray() {
    // console.log('LENGTH OF ARRAY: ' , this.text.length);
    while (this.text.length > 0) {
      this.text.pop();
    }
  }


  postMessage() {
    this.clearArray();
    if (this.messageSend === undefined || this.messageSend.length < 1 || this.messageSend.length > 200) {
      return;
    }
    this.chatService.sendMessage(this.roomId, this.messageSend);
  }

}
