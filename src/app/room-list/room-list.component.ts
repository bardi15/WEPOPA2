import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {

  newRoomName: string;
  rooms: string[];
  currUser: string;
  // bannedUsers: any[];
  constructor(private chatService: ChatService,
    private router: Router) {
      this.currUser = this.chatService.currUser;
      // this.bannedUsers = [];
    }


  ngOnInit() {
    this.chatService.getRoomList().subscribe(lst => {
      this.rooms = lst;
    });
    // this.getBannedUsers();
    // console.log('usernmae current test roomlist: ', this.chatService.currUser);
  }

  onNewRoom() {
    if (this.newRoomName.length < 1) {
      return;
      // TODO implement error message
    }
    this.connectToRoom(this.newRoomName);
  }
  connectToRoom(roomName: string) {
    // console.log('print: connectToRoom ' , roomName);
    this.chatService.addRoom(roomName).subscribe(succeeded => {
      if (succeeded === true) {
        // this.newRoomName = "";
        this.router.navigate(['rooms', roomName]);
      }
    });
  }

  // getBannedUsers () {
  //   // let ban;
  //   console.log('getBannedUsers');
  //   this.chatService.getBannedUsers().subscribe(lst => {
  //     // tslint:disable-next-line:forin
  //     for (const key in lst) {
  //       console.log('getBannedUsers', key);
  //     }
  //   })
  // }

  // getChat() {
  //   let msg;
  //   this.chatService.getChat().subscribe(lst => {
  //     this.clearArray(this.text);
  //     // console.log('getChat', lst);
  //     const roomName = lst['roomName'];
  //     const messages = lst['messages'];
  //     // console.log('now roomname is: ' , roomName);
  //     // if (roomName === this.roomId) {
  //       for (let i = messages.length - 1; i >= 0; i--) {
  //         const nickname = messages[i]['nick'];
  //         msg = {nick: nickname, timestamp: messages[i]['timestamp'], message: messages[i]['message'],
  //           initials: messages[i]['nick'].slice(0, 1), currentuser: this.isCurrentUser(nickname)};
  //         this.text.push(msg);
  //       }
  //     // } else {
  //       // this.router.navigate(['rooms', roomName]); // ATH?? GÓÐ LAUSN ??
  //     // }
  //   });
  // }
}
