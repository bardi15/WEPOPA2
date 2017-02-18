import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-private-messages',
  templateUrl: './private-messages.component.html',
  styleUrls: ['./private-messages.component.css']
})
export class PrivateMessagesComponent implements OnInit {
  id: number;
  text: any[];
  messageSend: string;
  userSend: string;
  myData = new Array<string>();
  allUsers = [];

  constructor(private router: Router,
    private route: ActivatedRoute, private chatService: ChatService) {
    this.text = [];
    this.allUsers = [];
  }

  ngOnInit() {
    this.getAllUsers();
    const id = this.route.snapshot.params['id'];
    this.addToUserList(id);
    this.id = id;
    this.getprvmsgs();
  }

  prvmsg() {
    if (this.userSend === undefined) {
      return;
    }
    this.chatService.sendPrvMessage(this.messageSend, this.userSend);
  }

  getprvmsgs() {
    this.chatService.getPrvMessage().subscribe(lst => {
      const username = lst['username'];
      const messages = lst['messages'];
      this.addToUserList(username);
      this.text.push({ user: username, message: messages });
    });
  }

  addToUserList(username: string) {
    if (!this.myData.some((x => x === username))) {
      this.myData.push(username);
    };
  }

  getAllUsers() {
    this.chatService.getAllUsers().subscribe(lst => {
      // tslint:disable-next-line:forin
      for (const key in lst) {
        this.allUsers.push(lst[key]);
      }
    });
  }
}
