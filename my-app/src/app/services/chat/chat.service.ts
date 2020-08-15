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
    text: string,
    time: string
  }>[] = [];
  messageList = new Subject();
  typingPersonName = new Subject();

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
      this.typingPersonName.next(msg);
    });
    this.socket.on('message', msg => {
      this.list.push(msg);
      this.messageList.next(this.list);
    });
    this.socket.on('roomInfos', msg => {
      // this.list.push(msg);
      // this.messageList.next(this.list);
    });

  }

  // 登入
  joinChat(username, room) {
    this.socket.emit('joinRoom', {username, room});
  }

  sendMessage(content: string) {
    this.socket.emit('send message', content);
  }

  typingBroadcast(username: string) {
    this.socket.emit('typing message', username);
  }

}
