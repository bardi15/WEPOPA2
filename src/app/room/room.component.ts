import { Component, OnInit } from '@angular/core';
import { ChatService } from "../chat.service";
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})

export class RoomComponent implements OnInit {
  roomId : string;
  text : string[];
  constructor(private router : Router, 
    private route: ActivatedRoute, private chatService : ChatService) { }

  ngOnInit() {
    //SIMPLE METHOD:
    let id = this.route.snapshot.params['id'];
    console.log(id);
    this.roomId = id;
    // this.chatService.sendMessage(id, "hi thar");

    // this.chatService.getChat().subscribe(lst => {
    //   this.text = lst;
    // });

    //TEST:
  }

  postMessage() {
    this.chatService.sendMessage(this.roomId, "hi thar");
    this.chatService.getChat().subscribe(lst => {
      console.log(lst);
      this.text = lst;
    });
  }

}
