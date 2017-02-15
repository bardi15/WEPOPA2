import { Injectable } from '@angular/core';
import * as io from "socket.io-client";
import { Observable } from "rxjs/Observable";

@Injectable()
export class ChatService {
  socket : any;

  constructor() {
    this.socket = io("http://localhost:8080/");
    this.socket.on("connect", function() {
      console.log("connect");
    });
  }

  login(userName : string) : Observable<boolean> {
    let observable = new Observable(observer => {
      this.socket.emit("adduser", userName, succeeded => {
        console.log("Reply received in chat service");
        observer.next(succeeded);
      });
    });
    return observable;
  }

  getRoomList() : Observable<string[]> {
    let obs = new Observable(observer => {
      this.socket.emit("rooms");
      this.socket.on("roomlist", (lst) => {
        const strArr : string[] = [];
        for (const x in lst) {
          if (lst.hasOwnProperty(x)) {
            strArr.push(x);
          }
        }
        observer.next(strArr);
      })
    });
    return obs;
  }

  addRoom(roomName : string) : Observable<boolean> {
    const observable = new Observable(observer => {
      //TODO validate roomName
      var param = {
        room : roomName
      }
      this.socket.emit("joinroom", param, (a,b) => {
        //TODO implement error
          observer.next(a);
      });
    });
    return observable;
  }

  sendMessage(_roomName : string, _msg : string) {
    var param = {
        roomName : _roomName,
        msg : _msg
      }
    this.socket.emit("sendmsg", param);
    // let observable = new Observable(observer => {
    //   this.socket.emit("sendmsg", param, succeeded => {
    //     console.log("send message");
    //     observer.next(succeeded);
    //   });
    // });
    // return observable;
  }
  getChat() : Observable<string[]> {
    const observable = new Observable(observer => {
      this.socket.on("updatechat", (a,b,c) => {
        const strArr : string[] = [];
        console.log("test1" , a[0]);
        console.log("test2" , b[0]);
        console.log("test3" , a[0]['nick']);
        console.log("test4" , b[0]['nick']);
        console.log("test5" , a['nick']);
        console.log("test6" , b['nick']);
        for (const x in b) {
          if (b.hasOwnProperty(x)) {
            strArr.push(x['nick']);
            console.log("ingetchat: " , x[0]['nick']);
          }
        }
        observer.next(strArr);
      });
    });
    return observable;
  }
  


  // sendMessage(_roomName : string, _msg : string) {
  //     var param = {
  //       roomName : _roomName,
  //       msg : _msg
  //     }
  //     this.socket.emit("sendmsg", param, (a,b) => {
  //       console.log("emmiting mesage: " + param);
  //     });



  //   // console.log("sending a message" +_roomName +_msg );
  //   // const observable = new Observable(observer => {
  //   //   //TODO validate roomName
  //   //   var param = {
  //   //     roomName : _roomName,
  //   //     msg : _msg
  //   //   }
  //   //   this.socket.emit("sendmsg", param, (a,b) => {
  //   //     console.log("emmiting mesage: " + param);
  //   //     //TODO implement error
  //   //       observer.next(a);
  //   //   });
  //   // });
  //   // return observable;
  // }

  // getChat() : Observable<string[]> {
  //   console.log("getting the chat");
  //   let obs = new Observable(observer => {
  //     this.socket.on("updatechat", (lst) => {
  //       const strArr : string[] = [];
  //       for (const x in lst[0]) {

  //         strArr.push(x);
  //         console.log(x);
  //         // console.log("chat " , x);
  //         // if (lst.hasOwnProperty(x)) {
  //         //   strArr.push(x);
  //         // }
  //       }
  //       observer.next(strArr);
  //     })
  //   });
  //   return obs;
  // }

}