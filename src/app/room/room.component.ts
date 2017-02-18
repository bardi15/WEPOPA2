import { Component, OnInit, Input } from '@angular/core';
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
  currUser: string;
  currUserIsOp: boolean;
  constructor(private router: Router,
    private route: ActivatedRoute, private chatService: ChatService) {
    this.text = [];
    this.roomUsers = [];
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.roomId = id;
    this.getChat();
    this.getUsers();
    this.currUser = this.chatService.currUser;
  }

  getChat() {
    let msg;
    this.chatService.getChat().subscribe(lst => {
      this.clearArray(this.text);
      const roomName = lst['roomName'];
      const messages = lst['messages'];
      for (let i = messages.length - 1; i >= 0; i--) {
        const nickname = messages[i]['nick'];
        msg = {
          nick: nickname, timestamp: messages[i]['timestamp'], message: messages[i]['message'],
          initials: messages[i]['nick'].slice(0, 1), currentuser: this.isCurrentUser(nickname)
        };
        this.text.push(msg);
      }
    });
  }

  isCurrentUser(username: string): boolean {
    if (username === this.currUser) {
      return true;
    }
    return false;
  }

  kick(username: string) {
    this.chatService.kickUser(this.roomId, username);
  }

  // ban(username: string) {
  //   this.chatService.banUser(this.roomId, username);
  // }

  getUsers() {
    let usr;
    this.chatService.getUsers().subscribe(lst => {
      const users = lst['users'];
      const ops = lst['ops'];
      this.clearArray(this.roomUsers);
      for (const key in ops) {
        if (this.isCurrentUser(ops[key])) {
          this.currUserIsOp = true;
        }
        this.roomUsers.push(usr = { nick: ops[key], isOp: true });
      }

      for (const key in users) {
        this.roomUsers.push(usr = { nick: users[key], isOp: false });
      }

      if (!this.roomUsers.some(x => x['nick'] === this.currUser)) {
        this.removeFromRoom();
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

  removeFromRoom() {
    const msg = {
      nick: 'SERVER', timestamp: '', message: 'YOU HAVE BEEN REMOVED FROM THIS CHATROOM',
      initials: 'S', currentuser: ''
    };
    this.text.push(msg);
  }

  leaveRoom() {
    this.chatService.leaveRoom(this.roomId);
    this.router.navigate(['rooms']);
  }

  privateMsg(username: string) {
    this.router.navigate(['privatemsg', username]);
  }
}
