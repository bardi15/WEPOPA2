import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-private-messages',
  templateUrl: './private-messages.component.html',
  styleUrls: ['./private-messages.component.css']
})
export class PrivateMessagesComponent implements OnInit {
  // id: number;
  text: any[];
  messageSend: string;
  userSend: string;
  currUser: string;
  allUsers = new Array<string>();
  selectedUser: string;
  constructor(private router: Router,
    private chatService: ChatService) {
    this.text = [];
  }

  ngOnInit() {
    this.getAllUsers();
    // const id = this.route.snapshot.params['id'];
    // this.addToUserList(id);
    // this.id = id;
    this.getprvmsgs();
    this.currUser = this.chatService.currUser;
  }

  prvmsg() {
    // console.log('this.userSend:', this.userSend);
    this.chatService.sendPrvMessage(this.messageSend, this.userSend);
  }

  getprvmsgs() {
    this.chatService.getPrvMessage().subscribe(lst => {
      const username = lst['username'];
      const messages = lst['messages'];
      if (username.length > 1) {
        this.text.push({ user: username, message: messages });
        this.text.reverse();
      }
    });
  }

  addToUserList(username: string) {
    if (!this.allUsers.some((x => x === username))) {
      this.allUsers.push(username);
    };
  }

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
