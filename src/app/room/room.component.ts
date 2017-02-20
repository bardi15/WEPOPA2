import { Component, OnInit, Input } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BotsService } from '../bots.service';


@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})

export class RoomComponent implements OnInit {
  roomId: string; // NAME OF CURRENT ROOM
  msg: any; // PLACEHOLDER
  text: any[]; // ALL MESSAGES IN CURRENT CHAT
  roomUsers: any[]; // ALL USERS IN CURRENT ROOM
  messageSend: string; // VARIABLE STORES MESSAGE TYPED INTO MESSAGEBOX
  currUser: string; // USER ON CURRENT SOCKET
  currUserIsOp: boolean; // IF USER IS OP IN CURRENT ROOM
  currentTopic: string; // CURRENT SERVER TOPIC IN ROOM
  newTopic: string; // VARIABLE STORES MESSAGE TYPED INTO MESSAGEBOX
  botsAreActive: boolean;
  constructor(private router: Router,
    private route: ActivatedRoute, private chatService: ChatService, private botsService: BotsService ) {
    this.text = [];
    this.roomUsers = [];
    this.botsAreActive = this.botsService.botsAreActive;
  }

  ngOnInit() {
    this.roomId = this.route.snapshot.params['id'];
    this.currUser = this.chatService.currUser;
    this.checkCurrUser();
    this.getChat();
    this.getUsers();
    this.getCurrTopic();
  }

  checkCurrUser() {
    if (this.currUser === undefined || this.currUser.length < 1) {
      this.router.navigate(['login']);
    }
  }

  addBotToCurrentChat() {
    this.botsService.addOneBotToRoom(this.roomId);
  }

  getChat() {
    this.chatService.getChat(this.roomId).subscribe(lst => {
      this.clearArray(this.text);
      const roomName = lst['roomName'];
      const messages = lst['messages'];
      for (let i = messages.length - 1; i >= 0; i--) {
        const nickname = messages[i]['nick'];
        const time = this.fixTimeString(messages[i]['timestamp']);
        const msg = {
          nick: nickname, timestamp: time, message: messages[i]['message'],
          initials: messages[i]['nick'].slice(0, 1), currentuser: this.isCurrentUser(nickname)
        };
        this.text.push(msg);
      }
    });
  }

// COMPARES USERNAME TO CURRENT USER
  isCurrentUser(username: string): boolean {
    if (username === this.currUser) {
      return true;
    }
    return false;
  }

// KICK FROM ROOM
  kick(username: string) {
    this.chatService.kickUser(this.roomId, username);
  }

// BAN FROM ROOM
  ban(username: string) {
    this.chatService.banUser(this.roomId, username);
  }

// GETS USERS IN CURRENT ROOM
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

// SEND MESSAGE TO CURRENT CHATROOM
  postMessage() {
    if (this.messageSend === undefined || this.messageSend.length < 1 || this.messageSend.length > 200) {
      return;
    }
    this.chatService.sendMessage(this.roomId, this.messageSend);
    this.messageSend = '';
  }

// SENDS MESSAGE IF USER HAS BEEN REMOVED
  removeFromRoom() {
    this.serverMessage('YOU HAVE BEEN REMOVED FROM THIS CHATROOM');
  }

// LEAVES ROOM AND NAVIGATES TO ROOMLIST
  leaveRoom() {
    this.chatService.leaveRoom(this.roomId);
    this.router.navigate(['rooms']);
  }

// GETS TOPIC OF CURRENT ROOM
  getCurrTopic() {
    this.chatService.getTopic().subscribe(lst => {
      const topic = lst['topic'];
      this.currentTopic = topic;
      this.serverMessage(topic);
    });
  }

// SETS TOPIC OF CURRENT ROOM (ONLY OP)
  setCurrTopic() {
    this.chatService.setTopic(this.roomId, this.newTopic);
  }

// SENDS SERVER MESSAGE
  serverMessage(message: string) {
    const msg = {
      nick: 'SERVER', timestamp: 'NOW', message: message,
      initials: 'S', currentuser: ''
    };
    this.text.unshift(msg);
  }

// PRETTIFIES TIME
  private fixTimeString(time: any): string {
    let fTime = new Date(time);
    let strTime = fTime.getHours() + ':' + fTime.getMinutes();
    return strTime;
  }

// CLEARS REFRENCED ARRAY
  private clearArray(arr: any[]) {
    while (arr.length > 0) {
      arr.pop();
    }
  }
}
