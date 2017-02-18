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
  constructor(private chatService: ChatService,
    private router: Router) {
    this.currUser = this.chatService.currUser;
  }

  ngOnInit() {
    this.chatService.getRoomList().subscribe(lst => {
      this.rooms = lst;
    });
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
}
