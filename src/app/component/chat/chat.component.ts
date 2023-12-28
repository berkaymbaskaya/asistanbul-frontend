import {
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PoiService } from 'src/app/services/poi.service';
import { ChatService } from 'src/app/services/chat.service';
interface MessageModel {
  text: string;
  date: number;
  classNameContainer: string;
  classNameText: string;
  from: string;
}
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent {
  allMessages: MessageModel[] = [];
  suggestionVisible: boolean = true;
  humanMessage: string = '';
  messageLoadVisible: boolean = true;
  inputIsActive: boolean = true;
  @ViewChild('messageBoxContainer') messageBoxContainer!: ElementRef;
  constructor(
    private snackBar: MatSnackBar,
    private poiService: PoiService,
    private renderer: Renderer2,
    private el: ElementRef,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.chatService.sendMessage('merhaba').subscribe((res: any) => {
        console.log(res);
        this.messageLoadVisible = false;
        this.allMessages.push({
          text: res.messages.text.value,
          date: Date.now(),
          classNameContainer: 'robot-message-container',
          classNameText: 'text-container-robot',
          from: 'robot',
        });
        setTimeout(() => {
          this.messageBoxContainer.nativeElement.scrollTop =
            this.messageBoxContainer.nativeElement.scrollHeight;
        }, 300);
      });
    }, 100);
  }
  sendMessagge() {
    this.allMessages.push({
      text: this.humanMessage,
      date: Date.now(),
      classNameContainer: 'human-message-container',
      classNameText: 'text-container-human',
      from: 'human',
    });
    setTimeout(() => {
      this.humanMessage = '';
    }, 500);
    setTimeout(() => {
      this.messageBoxContainer.nativeElement.scrollTop =
        this.messageBoxContainer.nativeElement.scrollHeight;
      this.humanMessage = '';
    }, 100);
    this.messageLoadVisible = true;
    this.chatService.sendMessage(this.humanMessage).subscribe((res: any) => {
      if (res.finish === false) {
        console.log(res);
        this.messageLoadVisible = false;
        this.allMessages.push({
          text: res.messages.text.value,
          date: Date.now(),
          classNameContainer: 'robot-message-container',
          classNameText: 'text-container-robot',
          from: 'robot',
        });
        setTimeout(() => {
          this.messageBoxContainer.nativeElement.scrollTop =
            this.messageBoxContainer.nativeElement.scrollHeight;
        }, 100);
      } else if (res.finish === true) {
        console.log(res);
        let myDataString = res.data;
        console.log(myDataString);
        this.messageLoadVisible = false;
        this.allMessages.push({
          text: res.message,
          date: Date.now(),
          classNameContainer: 'robot-message-container',
          classNameText: 'text-container-robot',
          from: 'robot',
        });
        this.chatService.chatFinish.emit(JSON.parse(myDataString));
      }
    });
  }

  onSelectionSuggesttion(evt: any) {
    this.inputIsActive = false;
    console.log(evt.source.value);
    this.chatService.locationOrselection.emit(evt.source.value);
    this.suggestionVisible = false;
    console.log('inputu açıyorum...');
  }
  closeAsistan() {
    console.log('kapattım');
    this.snackBar.dismiss();
  }
}
