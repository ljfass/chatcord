import { environment } from './../../../environments/environment';
import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import * as io from 'socket.io-client';
import { NzNotificationService } from 'ng-zorro-antd/notification';

interface Content {
  username: string;
  conent: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  socket;
  list: Array<{
    username: string,
    content: string
  }>[] = [];
  messageList = new Subject();


  constructor(
    private notification: NzNotificationService
  ) { }

  setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT);
    this.socket.on('send message', msg => {
      this.list.push(msg);
      this.messageList.next(this.list);
    });
    this.socket.on('typing message', msg => {
      console.log(msg);
    });
    this.socket.on('message', msg => {
      this.notification
        .blank(
          'Notification Title',
          msg
        );
    });

  }

  sendMessage(username: string, content: string) {
    this.socket.emit('send message', { username, content });
  }

  typingBroadcast(username: string) {
    this.socket.emit('typing message', username);
  }

}
