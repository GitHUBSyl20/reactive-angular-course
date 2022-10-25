import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Message} from '../model/message';
import {tap} from 'rxjs/operators';
import { MessagesService } from './messages.service';

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  showMessages = false;

  errors$: Observable<string[]>

  constructor(public messagesService: MessagesService) {

    console.log("messages service created");
  }

  ngOnInit() {
    // the messages service tell the component and all the app if there is an error
    this.errors$ = this.messagesService.errors$
    .pipe(
      // taking into account if the array of message is empty or not (see service)
        tap(() =>  this.showMessages = true)
    )

  }


  onClose() {
    this.showMessages = false;

  }

}
