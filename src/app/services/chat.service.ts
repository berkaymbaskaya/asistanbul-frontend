import { Injectable, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ContentObserver } from '@angular/cdk/observers';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  threadid: string = '';
  closeReq: EventEmitter<any> = new EventEmitter();
  firsMessageTrigger: EventEmitter<any> = new EventEmitter();
  chatFinish: EventEmitter<any> = new EventEmitter();
  locationOrselection: EventEmitter<any> = new EventEmitter();
  constructor(private httpClient: HttpClient) {}
  createThread() {
    return this.httpClient.get('http://localhost:1923/createThread');
  }

  sendMessage(messages: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let body = {
      thereadid: this.threadid,
      mesaj: messages,
    };
    return this.httpClient.post('http://localhost:1923/asistanbul', body, {
      headers,
    });
  }

  closeModalReq() {}
}
