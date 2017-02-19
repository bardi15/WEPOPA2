import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-private-messages',
  templateUrl: './private-messages.component.html',
  styleUrls: ['./private-messages.component.css']
})
export class PrivateMessagesComponent implements OnInit {
  text: any[]; // ARRAY OF ALL PRIVATE MESSAGES THIS USER HAS RECIEVED
  messageSend: string; // VARIABLE STORES MESSAGE TYPED INTO MESSAGEBOX
  userSend: string; // NAME OF USER RECIVEING MESSAGES
  currUser: string;
  allUsers = new Array<string>(); // ARRAY OF ALL USERS
  constructor(private router: Router,
    private chatService: ChatService) {
    this.text = [];
  }

  ngOnInit() {
    this.getAllUsers();
    this.getprvmsgs();
    this.currUser = this.chatService.currUser;
  }

// SENDS PRIVATE MESSAGE messageSend VARIABLE TAKES INPUT FROM USER
  prvmsg() {
    this.chatService.sendPrvMessage(this.messageSend, this.userSend);
  }

// GETS ALL PRIVATE MESSAGES TO THIS USER
  getprvmsgs() {
    this.chatService.getPrvMessage().subscribe(lst => {
      const username = lst['username'];
      const messages = lst['messages'];
      if (username.length > 0) {
        console.log('')
        this.text.push({ user: username, message: messages });
        this.text.reverse();
      }
    });
  }

// ADDS VARIABLE TO LIST ONLY IF IT IS NOT ALREADY IN THE LIST
  addToUserList(username: string) {
    if (!this.allUsers.some((x => x === username))) {
      this.allUsers.push(username);
    };
  }

// EMITS TO SERVER TO RECIEVE USERLIST, AND ADDS THEM TO LIST
  getAllUsers() {
    this.chatService.serverEmitUsers();
    this.chatService.getAllUsers().subscribe(lst => {
      this.chatService.serverEmitUsers();
      for (const key in lst) {
        this.addToUserList(lst[key]);
      }
    });
  }

}
