import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ChatMessageComponent } from '@components/chat-bubbles/chatMessage/chatMessage.component';
import { MyMessageComponent } from '@components/chat-bubbles/myMessage/myMessage.component';
import {
  TextMessageBoxFileComponent,
  TextMessageEvent,
} from '@components/text-boxes/textMessageBoxFile/textMessageBoxFile.component';
import { TypingLoaderComponent } from '@components/typingLoader/typingLoader.component';
import { AudioToTextResponse } from '@interfaces/audio-text-response.interface';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-audio-to-text-page',
  standalone: true,
  imports: [
    CommonModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxFileComponent,
  ],
  templateUrl: './audioToTextPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AudioToTextPageComponent {
  public messages = signal<Message[]>([]);
  public isLoading = signal<boolean>(false);
  public openAiService = inject(OpenAiService);

  handleMessageFile({ prompt, file }: TextMessageEvent): void {
    const text = prompt ?? file.name ?? 'Traduce el Audio';
    this.isLoading.set(true);

    this.messages.update((prev) => [
      ...prev,
      { text, isGpt: false },
      { text: 'Transcribiendo...', isGpt: true },
    ]);

    this.openAiService
      .audioToText(file)
      .subscribe((resp) => this._handleResponse(resp));
  }

  private _handleResponse(response: AudioToTextResponse | null) {
    this.isLoading.set(false);
    if (!response) return;

    const text = `## Transcripción:
__Duración:__ ${Math.round(response.duration)} segundos.

## El texto es:
${response.text}
    `;

    this.messages.update((prev) => [...prev, { text, isGpt: true }]);

    for (const segment of response.segments) {
      const segmentMessage = `
__De ${Math.round(segment.start)} a ${Math.round(segment.end)} segundos.__
${segment.text}
      `;

      this.messages.update((prev) => [
        ...prev,
        { text: segmentMessage, isGpt: true },
      ]);
    }
  }
}
