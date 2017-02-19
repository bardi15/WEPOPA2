import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {

  newRoomName: string; // VARIABLE STORES MESSAGE TYPED INTO MESSAGEBOX
  newRooms: any[]; // CONTAINS LIST ALL OF ROOMINFO OBJECTS
  currUser: string; // NAME OF CURRENT SOCKET USER
  constructor(private chatService: ChatService,
    private router: Router) {
    this.currUser = this.chatService.currUser;
    this.newRooms = [];
  }

  ngOnInit() {
    this.getRoomList();
  }

// GETS LIST OF ALL ROOMS
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

// CLEARS REFERENCED ARRAY
  clearArray(arr: any[]) {
    while (arr.length > 0) {
      arr.pop();
    }
  }

// CONNECTS TO SELECTED ROOM
  onNewRoom() {
    if (this.newRoomName.length < 1) {
      return;
    }
    this.connectToRoom(this.newRoomName);
  }

// CONNECTS TO A ROOM
  connectToRoom(roomName: string) {
    this.chatService.addRoom(roomName).subscribe(succeeded => {
      if (succeeded === true) {
        this.router.navigate(['rooms', roomName]);
      }
    });
  }

// WORKS ONLY PARTIALLY, DISCONNECT FROM SERVER
  disconnect() {
    this.chatService.disconnect();
    this.router.navigate(['login']);
  }
}
