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

  constructor(private chatService: ChatService,
    private router: Router) { }


  ngOnInit() {
    this.chatService.getRoomList().subscribe(lst => {
      this.rooms = lst;
    });
    console.log('usernmae current test roomlist: ', this.chatService.currUser);
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

  // disconnect() {
  //   // console.log('disconnect in componenet');
  //   // this.chatService.disconnectFromServer();
  //   this.router.navigate(['login']);
  // }
}
