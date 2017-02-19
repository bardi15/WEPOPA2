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
  rooms: any[];
  newRooms: any[];
  currUser: string;
  constructor(private chatService: ChatService,
    private router: Router) {
    this.currUser = this.chatService.currUser;
    this.newRooms = [];
  }

  ngOnInit() {
    this.chatService.getRoomList().subscribe(lst => {
      this.rooms = lst;
    });
    this.getRoomList();
  }

  getRoomList() {
    this.chatService.getRoomList().subscribe(lst => {
      this.clearArray(this.newRooms);
      for (const key in lst) {
        const val = lst[key];
        let banned = false;
        for (const bn in val['banned']) {
          if (this.currUser === bn) {
            banned = true;
          }
        }
        const roomInfo = {name: val['name'], banned: banned, topic: val['topic']};
        this.newRooms.push(roomInfo);
      };
    });
  }

  clearArray(arr: any[]) {
    while (arr.length > 0) {
      arr.pop();
    }
  }

  onNewRoom() {
    if (this.newRoomName.length < 1) {
      return;
    }
    this.connectToRoom(this.newRoomName);
  }
  connectToRoom(roomName: string) {
    this.chatService.addRoom(roomName).subscribe(succeeded => {
      if (succeeded === true) {
        this.router.navigate(['rooms', roomName]);
      }
    });
  }

  disconnect() {
    this.chatService.disconnect();
    this.router.navigate(['login']);
  }
}
