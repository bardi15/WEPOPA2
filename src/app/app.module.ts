import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RoomListComponent } from './room-list/room-list.component';
import { RoomComponent } from './room/room.component';
import { ChatService } from './chat.service';
import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap';
import { PrivateMessagesComponent } from './private-messages/private-messages.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RoomListComponent,
    RoomComponent,
    PrivateMessagesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AlertModule.forRoot(),
    RouterModule.forRoot([{
      path: '',
      redirectTo: 'login',
      pathMatch: 'full'
    }, {
      path: 'login',
      component: LoginComponent
    }, {
      path: 'rooms',
      component: RoomListComponent
    }, {
      path: 'rooms/:id',
      component: RoomComponent
    }, {
      path: 'privatemsg/:id',
      component: PrivateMessagesComponent
    }])
  ],
  providers: [ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
