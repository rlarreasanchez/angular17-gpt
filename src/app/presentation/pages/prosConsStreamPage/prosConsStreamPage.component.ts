import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { ChatMessageComponent } from '@components/chat-bubbles/chatMessage/chatMessage.component';
import { MyMessageComponent } from '@components/chat-bubbles/myMessage/myMessage.component';
import { TextMessageBoxComponent } from '@components/text-boxes/textMessageBox/textMessageBox.component';
import { TypingLoaderComponent } from '@components/typingLoader/typingLoader.component';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-pros-cons-stream-page',
  standalone: true,
  imports: [
    CommonModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
  ],
  templateUrl: './prosConsStreamPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProsConsStreamPageComponent implements AfterViewChecked {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  public messages = signal<Message[]>([]);
  public isLoading = signal<boolean>(false);
  public openAiService = inject(OpenAiService);

  public abortSignal = new AbortController();

  ngAfterViewChecked(): void {
    this._scrollToBottom();
  }

  async handleMessage(message: string) {
    this.abortSignal.abort();
    this.abortSignal = new AbortController();

    this.messages.update((prev) => [
      ...prev,
      {
        text: message,
        isGpt: false,
      },
      {
        text: 'Pensando...',
        isGpt: true,
      },
    ]);
    this._scrollToBottom();

    this.isLoading.set(true);
    const stream = this.openAiService.prosConsDiscusserStream(
      message,
      this.abortSignal.signal,
    );
    this.isLoading.set(false);

    for await (const chunk of stream) {
      this._handleStreamResponse(chunk);
      this._scrollToBottom();
    }
  }

  private _handleStreamResponse(message: string) {
    this.messages().pop();
    const messages = this.messages();

    this.messages.set([...messages, { text: message, isGpt: true }]);
  }

  private _scrollToBottom() {
    this.scrollContainer.nativeElement.scrollTop =
      this.scrollContainer.nativeElement.scrollHeight + 900;
  }
}
