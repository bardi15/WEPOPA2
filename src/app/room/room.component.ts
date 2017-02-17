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
    // console.log('nginit');
    const id = this.route.snapshot.params['id'];
    this.roomId = id;
    this.getChat();
    this.getUsers();
    this.currUser = this.chatService.currUser;
    console.log('is curr op: ', this.currUserIsOp);
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
          const nickname = messages[i]['nick'];
          msg = {nick: nickname, timestamp: messages[i]['timestamp'], message: messages[i]['message'],
            initials: messages[i]['nick'].slice(0, 1), currentuser: this.isCurrentUser(nickname)};
          this.text.push(msg);
        }
      // } else {
        // this.router.navigate(['rooms', roomName]); // ATH?? GÓÐ LAUSN ??
      // }
    });
  }

  isCurrentUser(username: string): boolean {
    console.log('iscrcheck:', username, this.currUser);
    if (username === this.currUser) {
      console.log('TTRUEE');
      return true;
    }
    console.log('FALLSE');
    return false;
  }

  getUsers() {
    let usr;
    // let crUserIsOp: boolean;
    this.chatService.getUsers().subscribe(lst => {
      // crUserIsOp = false;
      const users = lst['users'];
      const ops = lst['ops'];
      // console.log(users.length);
      // console.log(ops.length);
      this.clearArray(this.roomUsers);
      // tslint:disable-next-line:forin
      for (const key in ops) {
        if (this.isCurrentUser(ops[key])) {
          console.log('.....!!!!......', ops[key]);
          this.currUserIsOp = true;
          // crUserIsOp = true;
        }
        this.roomUsers.push(usr = {nick: ops[key], isOp: true});
      }
      // tslint:disable-next-line:forin
      for (const key in users) {
        this.roomUsers.push(usr = {nick: users[key], isOp: false});
      }
        // for (let i = ops.length - 1; i >= 0; i--) {
        //   usr = {nick: ops[i], isOp: true};
        //   console.log('user: ',  usr);
        //   this.roomUsers.push(usr);
        // }
        // for (let i = users.length - 1; i >= 0; i--) {
        //   usr = {nick: users[i], isOp: false};
        //   this.roomUsers.push(usr);
        // }
      // tslint:disable-next-line:forin
      // for (const key in lst) {
      //   this.roomUsers.push(lst[key]);
      // }
    });

    // return crUserIsOp;
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

  privateMsg(username: string) {
    // this.chatService.leaveRoom(this.roomId);
    this.router.navigate(['privatemsg', username]); // PLACEHOLDER
  }
}
