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
    // this.userSend = id;
    this.addToUserList(id);
    this.id = id;
    this.getprvmsgs();
  }

  prvmsg() {
    // console.log('in component');
    if (this.userSend === undefined) {
      return;
    }
    this.chatService.sendPrvMessage(this.messageSend, this.userSend);
    // console.log('userSend:::' , this.userSend);
  }

  getprvmsgs() {
    // let msg;
    this.chatService.getPrvMessage().subscribe(lst => {
      // this.clearArray(this.text);
      // console.log('getChat', lst);
      //         observer.next(response = {username: userName, messages: message});
      const username = lst['username'];
      const messages = lst['messages'];
      this.addToUserList(username);
      // console.log('now roomname is: ' , roomName);
      // if (roomName === this.roomId) {
      this.text.push({user: username, message: messages});
        // console.log('getprvmsgs' , messages);
        // for (let i = messages.length - 1; i >= 0; i--) {
        //   // msg = {nick: messages[i]['nick'], timestamp: messages[i]['timestamp'], message: messages[i]['message'],
        //   //   initials: messages[i]['nick'].slice(0, 1) };
        //   // this.text.push(msg);

        // }
      // } else {
        // this.router.navigate(['rooms', roomName]); // ATH?? GÓÐ LAUSN ??
      // }
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
