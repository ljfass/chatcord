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
  validateForm: FormGroup;
  chatForm: FormGroup;
  isLogined = false;
  contentList: Array<{
    username: string,
    content: string
  }>[] = [];
  messageSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private service: ChatService
  ) {
    this.validateForm = this.fb.group({
      username: [null]
    });
    this.chatForm = this.fb.group({
      content: [null]
    });
  }

  ngOnInit() {
    this.messageSubscription = this.service.messageList.subscribe((data: any) => {
      console.log(data);
      this.contentList = data.map(item => item);
    })
    this.service.setupSocketConnection();
  }

  login() {
    this.username = this.validateForm.value.username;
    this.isLogined = true;
  }

  send() {
    this.service.sendMessage(this.username, this.chatForm.value.content);
  }

}
