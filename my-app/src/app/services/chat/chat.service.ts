import { environment } from './../../../environments/environment';
import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import * as io from 'socket.io-client';

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

  ) { }

  setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT);
    this.socket.on('send message', msg => {
      this.list.push(msg);
      this.messageList.next(this.list);
    });

  }

  sendMessage(username: string, content: string) {
   this.socket.emit('send message', { username, content });
  }

}
