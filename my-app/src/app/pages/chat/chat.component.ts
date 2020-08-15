import { ChatService } from './../../services/chat/chat.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less']
})
export class ChatComponent implements OnInit {

  username = '';
  room = '';
  validateForm: FormGroup;
  chatForm: FormGroup;
  isLogined = false;
  contentList: Array<{
    username: string,
    content: string
  }>[] = [];
  messageSubscription: Subscription;
  typingNameSubsciption: Subscription;
  typingMessage = '';

  constructor(
    private fb: FormBuilder,
    private service: ChatService
  ) {
    this.validateForm = this.fb.group({
      username: [null],
      room: [null]
    });
    this.chatForm = this.fb.group({
      content: [null]
    });
  }

  ngOnInit() {
    this.messageSubscription = this.service.messageList.subscribe((data: any) => {
      this.contentList = data.map(item => item);
    })
    this.service.setupSocketConnection();
    this.service.typingPersonName.subscribe((value: string) => {
      this.typingMessage = value;
    })
  }

  login() {
    this.username = this.validateForm.value.username;
    this.room = this.validateForm.value.room;
    this.service.joinChat(this.username, this.room);
    this.isLogined = true;
  }

  send() {
    this.service.sendMessage(this.chatForm.value.content);
  }

  onSearch(value) {
    this.service.typingBroadcast(this.username);
  }

}
