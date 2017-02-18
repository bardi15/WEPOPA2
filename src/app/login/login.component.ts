import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userName: string;
  loginFailed: boolean = false;

  constructor(private chatService: ChatService,
    private router: Router) {

   }

  ngOnInit() {
  }

  onLogin() {
    console.log('Login called in Component');
    this.chatService.login(this.userName).subscribe(succeeded => {
      console.log('succeess!');
      this.loginFailed = !succeeded;
      if (succeeded === true) {
        this.router.navigate(['/rooms']);
        // TODO Redirect to RoomList componenet!
      }
    });
  }
}
