import { Component, OnInit } from '@angular/core';
import { ChatService } from "../chat.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {

  constructor(private chatService: ChatService, 
    private router: Router) { }

  rooms : string[];
  newRoomName : string;

  ngOnInit() {
    this.chatService.getRoomList().subscribe(lst => {
      this.rooms = lst;
    });
  }
  onNewRoom() {
    if (this.newRoomName.length < 1) {
      return;
      //TODO implement error message
    }
    this.chatService.addRoom(this.newRoomName).subscribe(succeeded => {
      if(succeeded === true) {
        //this.newRoomName = "";
        this.router.navigate(["rooms", this.newRoomName]);
      }
    });
   
  }
}
